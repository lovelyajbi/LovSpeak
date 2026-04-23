import React, { useState, useEffect, useRef } from 'react';
import { Level, Theme, ReadingContent, ModuleProps, AppView, VocabItem, ModuleContext } from '../types';
import { LEVELS, THEMES } from '../constants';
import { generateReadingTitles, generateReadingContent, generateReadingContentStream, analyzePronunciationAudio, getWordIPA, translateText, generateSingleReadingTitle, safeParseJSON } from '../services/gemini';
import { saveProgress, getCachedTitles, setCachedTitles, getCachedContent, setCachedContent, logActivity, saveVocab, completeRoadmapUnit } from '../services/storage';
import { audioService } from '../services/audioService';

interface WordAnalysis {
  word: string;
  status: 'correct' | 'incorrect' | 'neutral';
  clean: string;
  errorDetails?: string;
}

const ReadingModule: React.FC<ModuleProps> = ({ onComplete, initialContext, onNavigate }) => {
  // Navigation State
  const [step, setStep] = useState<'setup' | 'titles' | 'reading'>('setup');

  // Selection State
  const [level, setLevel] = useState<Level>('A1');
  const [theme, setTheme] = useState<Theme>(THEMES[0]);
  const [themeCategory, setThemeCategory] = useState<'islamic' | 'general' | 'custom'>('islamic');
  const [customTopic, setCustomTopic] = useState('');
  const [customTitle, setCustomTitle] = useState('');

  // Data State
  const [titles, setTitles] = useState<string[]>([]);
  const [content, setContent] = useState<ReadingContent | null>(null);
  const [selectedTitle, setSelectedTitle] = useState('');
  const [streamingText, setStreamingText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [statusMsg, setStatusMsg] = useState('');

  // Reading & Analysis State
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [wordList, setWordList] = useState<WordAnalysis[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);

  // UI Helpers
  const [fontSize, setFontSize] = useState(18);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const [selectedWordInfo, setSelectedWordInfo] = useState<{ word: string, ipa: string, rect?: DOMRect } | null>(null);
  const [ipaLoading, setIpaLoading] = useState(false);

  // Modal for Custom Title
  const [showTitleModal, setShowTitleModal] = useState(false);
  const [newCustomTitle, setNewCustomTitle] = useState('');
  const [randomTitleLoading, setRandomTitleLoading] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // Vocabulary Save Modal
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [saveWordInput, setSaveWordInput] = useState('');
  const [saveTransInput, setSaveTransInput] = useState('');

  const startTimeRef = useRef<number>(0);

  // --- PERSISTENCE LOGIC ---
  useEffect(() => {
    if (initialContext?.autoStart) return; // Don't load if auto-starting from roadmap

    const savedState = localStorage.getItem('lovspeak_state_reading');
    if (savedState) {
      try {
        const state = JSON.parse(savedState);
        setStep(state.step || 'setup');
        setLevel(state.level || 'A1');
        setTheme(state.theme || THEMES[0]);
        setThemeCategory(state.themeCategory || 'islamic');
        setCustomTopic(state.customTopic || '');
        setCustomTitle(state.customTitle || '');
        setTitles(state.titles || []);
        setContent(state.content || null);
        setSelectedTitle(state.selectedTitle || '');
        setWordList(state.wordList || []);
        setAnalysisResult(state.analysisResult || null);
        setFontSize(state.fontSize || 18);
        setIsFocusMode(state.isFocusMode || false);
        setCurrentPage(state.currentPage || 1);
      } catch (e) {
        console.error("Failed to load reading state", e);
      }
    }
  }, []);

  useEffect(() => {
    if (initialContext?.autoStart) return; // Don't save if auto-starting from roadmap

    const stateToSave = {
      step, level, theme, themeCategory, customTopic, customTitle,
      titles, content, selectedTitle, wordList, analysisResult,
      fontSize, isFocusMode, currentPage
    };
    localStorage.setItem('lovspeak_state_reading', JSON.stringify(stateToSave));
  }, [step, level, theme, themeCategory, customTopic, customTitle, titles, content, selectedTitle, wordList, analysisResult, fontSize, isFocusMode, currentPage]);

  // --- AUTO START LOGIC ---
  useEffect(() => {
    if (initialContext?.autoStart && initialContext.type === 'unit') {
      autoLaunch(initialContext);
    }
  }, [initialContext]);

  const autoLaunch = async (ctx: ModuleContext) => {
    setLoading(true);
    setStatusMsg('Preparing guided content...');
    setLevel(ctx.level);
    setCustomTitle(ctx.title);
    setCustomTopic(ctx.vocabTheme || ctx.promptContext || 'General');
    setThemeCategory('custom');

    startTimeRef.current = Date.now();
    try {
      const loadedContent = await generateReadingContent(ctx.title, ctx.level, ctx.vocabTheme || 'General', false);
      setContent(loadedContent);
      prepareWordList(loadedContent);
      setStep('reading');
    } catch (e) {
      setError('Guided content failed to load.');
    } finally {
      setLoading(false);
      setStatusMsg('');
    }
  };

  // --- INTERACTION HANDLERS ---

  const handleWordClick = async (e: React.MouseEvent, text: string) => {
    audioService.play('tap');
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'en-US';
    utter.rate = 0.9;
    window.speechSynthesis.speak(utter);

    const cleanWord = text.replace(/[^a-zA-Z]/g, '');
    if (!cleanWord) return;
    setIpaLoading(true);
    setSelectedWordInfo({ word: text, ipa: '...', rect });
    try {
      const ipa = await getWordIPA(cleanWord);
      setSelectedWordInfo({ word: text, ipa, rect });
    } catch (e) {
      setSelectedWordInfo({ word: text, ipa: '', rect });
    } finally {
      setIpaLoading(false);
    }
  };

  const prepareWordList = (contentObj: ReadingContent) => {
    const words: WordAnalysis[] = [];
    if (contentObj.paragraphs) {
      contentObj.paragraphs.forEach(para => {
        para.split(/\s+/).forEach(word => {
          words.push({ word: word, clean: word.toLowerCase().replace(/[^a-z0-9]/g, ''), status: 'neutral' });
        });
      });
    }
    setWordList(words);
  };

  const handleRandomTitle = async () => {
    setRandomTitleLoading(true);
    try {
      const currentThemeName = themeCategory === 'custom' ? customTopic : theme.name;
      const isIslamicLocal = themeCategory === 'islamic';
      const random = await generateSingleReadingTitle(level, currentThemeName, isIslamicLocal);
      setNewCustomTitle(random);
    } catch (e) {
      console.error(e);
    } finally {
      setRandomTitleLoading(false);
    }
  };

  // --- NAVIGATION & FETCHING ---

  const handleStartSetup = async (forceRefresh = false) => {
    setError('');

    if (themeCategory === 'custom' && customTitle) {
      handleSelectTitle(customTitle);
      return;
    }

    const currentThemeName = themeCategory === 'custom' ? customTopic : theme.name;
    const isIslamicLocal = themeCategory === 'islamic';

    if (themeCategory !== 'custom' && !forceRefresh) {
      const cached = getCachedTitles(level, theme.id);
      if (cached && cached.length > 0) {
        setTitles(cached);
        setStep('titles');
        return;
      }
    }

    setLoading(true);
    setStatusMsg(forceRefresh ? 'Refreshing topics...' : 'Generating topics...');
    audioService.play('tap');
    try {
      const generatedTitles = await generateReadingTitles(level, currentThemeName, isIslamicLocal);
      if (!generatedTitles || generatedTitles.length === 0) {
        throw new Error("No titles were generated. Please try again.");
      }
      setTitles(generatedTitles);
      setCurrentPage(1);
      if (themeCategory !== 'custom') {
        setCachedTitles(level, theme.id, generatedTitles);
      }
      setStep('titles');
    } catch (e: any) {
      setError(e.message || 'Failed to load titles. Please try a different topic.');
    } finally {
      setLoading(false);
      setStatusMsg('');
    }
  };

  const handleSelectTitle = async (title: string) => {
    audioService.play('nav');
    setError('');
    setSelectedTitle(title);
    setStreamingText('');
    startTimeRef.current = Date.now();
    const currentThemeName = themeCategory === 'custom' ? customTopic : theme.name;
    const isIslamicLocal = themeCategory === 'islamic';

    if (themeCategory !== 'custom') {
      const cached = getCachedContent(level, theme.id, title);
      if (cached) {
        setContent(cached);
        prepareWordList(cached);
        setAudioBlob(null);
        setAnalysisResult(null);
        setStep('reading');
        return;
      }
    }

    setLoading(true);
    setStatusMsg('Generating content...');
    try {
      const stream = await generateReadingContentStream(title, level, currentThemeName, isIslamicLocal);
      let fullText = '';
      setStep('reading');

      for await (const chunk of (stream as any)) {
        const chunkText = chunk.text;
        if (chunkText) {
          fullText += chunkText;
          // Try to extract paragraphs from the growing JSON string
          const parsed = safeParseJSON(fullText, null);
          if (parsed && parsed.paragraphs) {
            setContent(parsed);
          } else {
            // Fallback: just show the raw text if JSON isn't valid yet
            setStreamingText(fullText.replace(/\{.*"paragraphs":\s*\[|\]\}/g, '').replace(/"/g, ''));
          }
        }
      }

      const finalParsed = safeParseJSON(fullText, { title, paragraphs: [] });
      setContent(finalParsed);
      if (themeCategory !== 'custom') {
        setCachedContent(level, theme.id, title, finalParsed);
      }
      prepareWordList(finalParsed);
      setAudioBlob(null);
      setAnalysisResult(null);
    } catch (e) {
      setError('Failed to generate reading content.');
    } finally {
      setLoading(false);
      setStatusMsg('');
    }
  };

  // --- RECORDING & ANALYSIS ---

  const processAnalysis = async (blob: Blob) => {
    if (!content) return;
    setLoading(true);
    setStatusMsg('Analyzing pronunciation...');
    setError('');

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          const base64 = (reader.result as string).split(',')[1];
          // Use the actual words from the wordList to ensure consistency
          const targetText = wordList.map(w => w.word).join(' ');

          const result: any = await analyzePronunciationAudio(targetText, base64, blob.type || 'audio/webm');

          if (result) {
            setAnalysisResult(result);

            if (result.wordAnalysis && Array.isArray(result.wordAnalysis)) {
              const newWordList = [...wordList];
              // Update status for words provided by AI
              result.wordAnalysis.forEach((analysis: any, idx: number) => {
                if (newWordList[idx]) {
                  newWordList[idx].status = analysis.status === 'correct' ? 'correct' : 'incorrect';
                  newWordList[idx].errorDetails = analysis.errorDetails || '';
                }
              });
              setWordList(newWordList);
            }

            // Save progress
            const score = Math.round(Number(result.score || 0));
            const accuracy = Math.round(Number(result.accuracy || 0));

            saveProgress({
              level,
              themeId: themeCategory === 'custom' ? 'custom' : theme.id,
              title: content.title,
              score,
              accuracy,
              date: new Date().toISOString()
            });

            logActivity({
              type: AppView.READING,
              date: new Date().toISOString(),
              durationSeconds: Math.round((Date.now() - startTimeRef.current) / 1000),
              score,
              accuracy,
              details: content.title
            });

            if (initialContext?.stepId && score >= 70) {
              completeRoadmapUnit(initialContext.stepId);
            }

            if (onComplete && score >= 70) onComplete();

            // Scroll to results with a slight delay to ensure rendering
            setTimeout(() => {
              const element = document.getElementById('analysis-results-anchor');
              if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }, 800);
          } else {
            setError("AI could not provide an analysis. Please try recording again.");
          }
        } catch (innerError) {
          console.error("Inner Analysis Error:", innerError);
          setError("An error occurred during analysis. Please try again.");
        } finally {
          setLoading(false);
          setStatusMsg('');
        }
      };
      reader.onerror = () => {
        setError("Failed to read audio data.");
        setLoading(false);
      };
      reader.readAsDataURL(blob);
    } catch (e) {
      console.error("Outer Analysis Error:", e);
      setError("Failed to start analysis.");
      setLoading(false);
      setStatusMsg('');
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];
      mediaRecorderRef.current.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        processAnalysis(blob);
        stream.getTracks().forEach(track => track.stop());
      };
      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Mic error:", err);
      setError("Microphone access denied. Please enable microphone permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // --- RENDERERS ---

  const renderTitles = () => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentTitles = titles.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(titles.length / itemsPerPage);

    return (
      <div className="space-y-6 md:space-y-10 lg:space-y-12 animate-fade-in max-w-6xl mx-auto pb-20 px-2 md:px-0">
        <div className="flex items-center justify-between px-2 md:px-4">
          <button onClick={() => setStep('setup')} className="text-gray-500 hover:text-gray-800 font-black flex items-center gap-2 transition text-[10px] md:text-sm lg:text-base uppercase tracking-wider">
            <i className="fas fa-arrow-left"></i> Change Topic
          </button>
          <div className="flex items-center gap-3 md:gap-4">
            <button
              onClick={() => handleStartSetup(true)}
              disabled={loading}
              className="p-2.5 md:p-3.5 lg:p-4 rounded-xl lg:rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-500 hover:text-lovelya-600 transition shadow-sm"
              title="Refresh Topics"
            >
              <i className={`fas fa-sync-alt ${loading ? 'fa-spin' : ''} md:text-lg`}></i>
            </button>
            <div className="bg-lovelya-50 dark:bg-lovelya-900/20 text-lovelya-600 dark:text-lovelya-400 px-3 md:px-6 py-1.5 md:py-3 rounded-full font-black text-[9px] md:text-base lg:text-lg border border-lovelya-100 dark:border-lovelya-800 shadow-sm uppercase tracking-tight">
              {themeCategory === 'custom' ? customTopic : theme.name}
            </div>
          </div>
        </div>

        {titles.length === 0 ? (
          <div className="text-center py-16 md:py-32 bg-white dark:bg-gray-800 rounded-3xl md:rounded-[3rem] border border-dashed border-gray-300 dark:border-gray-700">
            <p className="text-gray-400 font-black text-xs md:text-xl lg:text-2xl mb-6">No titles found. Please try generating again.</p>
            <button onClick={() => handleStartSetup(false)} className="px-8 py-3 lg:px-12 lg:py-5 bg-lovelya-500 text-white rounded-2xl font-black text-xs md:text-lg lg:text-xl shadow-lg hover:shadow-xl transition active:scale-95">Retry</button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
              {currentTitles.map((title, idx) => (
                <button key={idx} onClick={() => handleSelectTitle(title)} className="bg-white dark:bg-gray-800 p-5 md:p-8 lg:p-10 rounded-[2rem] lg:rounded-[3rem] border border-gray-100 dark:border-gray-700 hover:border-lovelya-400 hover:shadow-2xl transition-all text-left h-full flex flex-col justify-between group transform hover:-translate-y-2 duration-300 shadow-sm">
                  <h3 className="font-black text-sm md:text-xl lg:text-2xl text-gray-800 dark:text-gray-100 group-hover:text-lovelya-600 leading-tight mb-6 line-clamp-3">{title}</h3>
                  <div className="w-9 h-9 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-2xl lg:rounded-3xl bg-lovelya-50 dark:bg-gray-700 text-lovelya-400 group-hover:bg-lovelya-500 group-hover:text-white transition-all flex items-center justify-center shadow-inner group-hover:scale-110"><i className="fas fa-book-open text-sm md:text-2xl"></i></div>
                </button>
              ))}
              {/* Custom Title Card */}
              <button
                onClick={() => setShowTitleModal(true)}
                className="bg-gray-50 dark:bg-gray-800/50 p-5 md:p-8 rounded-[2rem] lg:rounded-[3rem] border-2 border-dashed border-gray-200 dark:border-gray-700 hover:border-lovelya-400 hover:bg-lovelya-50 dark:hover:bg-lovelya-900/20 transition-all duration-300 flex flex-col items-center justify-center gap-3 lg:gap-5 group min-h-[140px] md:min-h-[200px]"
              >
                <div className="w-10 h-10 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-full bg-white dark:bg-gray-700 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform text-lovelya-500 text-xl md:text-3xl">
                  <i className="fas fa-plus"></i>
                </div>
                <span className="font-black uppercase tracking-[0.2em] text-[9px] md:text-xs lg:text-sm text-gray-400 group-hover:text-lovelya-600">Custom Title</span>
              </button>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 md:gap-8 mt-10 md:mt-16 bg-white dark:bg-gray-800 p-3 rounded-2xl md:rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 w-fit mx-auto">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  className="w-10 h-10 md:w-14 md:h-14 rounded-xl lg:rounded-2xl bg-gray-50 dark:bg-gray-700 border border-transparent text-gray-500 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-lovelya-50 dark:hover:bg-lovelya-900/20 transition-all text-sm md:text-xl active:scale-90"
                >
                  <i className="fas fa-chevron-left"></i>
                </button>
                <span className="text-xs md:text-lg lg:text-xl font-black text-gray-800 dark:text-gray-200 tracking-tight">
                  Page <span className="text-lovelya-600">{currentPage}</span> <span className="text-gray-400 font-medium">/ {totalPages}</span>
                </span>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  className="w-10 h-10 md:w-14 md:h-14 rounded-xl lg:rounded-2xl bg-gray-50 dark:bg-gray-700 border border-transparent text-gray-500 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-lovelya-50 dark:hover:bg-lovelya-900/20 transition-all text-sm md:text-xl active:scale-90"
                >
                  <i className="fas fa-chevron-right"></i>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    );
  };

  const renderReading = () => {
    if (!content && !streamingText) return null;
    let globalIndex = 0;
    return (
      <div className={`transition-all duration-500 ${isFocusMode ? 'fixed inset-0 z-[60] bg-gray-50 dark:bg-gray-900 overflow-y-auto' : 'max-w-6xl mx-auto px-2 md:px-0'}`}>
        <div className={`mb-4 md:mb-8 flex items-center justify-between bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl p-3 md:p-5 lg:p-6 rounded-2xl lg:rounded-3xl shadow-xl border border-lovelya-100 dark:border-lovelya-800 sticky top-4 z-[70] ${isFocusMode ? 'mx-4 md:mx-8 mt-4 md:mt-8' : ''}`}>
          <button onClick={() => setStep(initialContext?.autoStart ? 'setup' : 'titles')} className="w-10 h-10 md:w-14 md:h-14 rounded-xl lg:rounded-2xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-500 hover:text-gray-900 dark:hover:text-white transition-all text-sm md:text-2xl shadow-inner active:scale-95"><i className="fas fa-arrow-left"></i></button>
          <div className="flex gap-2.5 md:gap-4">
            <button onClick={() => setFontSize(prev => Math.max(12, prev - 2))} className="w-10 h-10 md:w-14 md:h-14 rounded-xl lg:rounded-2xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-500 hover:text-gray-900 transition-all text-sm md:text-2xl font-black shadow-inner active:scale-95" title="Decrease font size">A-</button>
            <button onClick={() => setFontSize(prev => Math.min(48, prev + 2))} className="w-10 h-10 md:w-14 md:h-14 rounded-xl lg:rounded-2xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-500 hover:text-gray-900 transition-all text-sm md:text-2xl font-black shadow-inner active:scale-95" title="Increase font size">A+</button>
            <button onClick={() => setIsFocusMode(!isFocusMode)} className={`px-4 py-2 md:px-8 md:py-4 rounded-xl lg:rounded-2xl text-[10px] md:text-sm lg:text-base font-black uppercase tracking-widest transition-all shadow-md flex items-center gap-2.5 md:gap-4 active:scale-95 ${isFocusMode ? 'bg-lovelya-600 text-white shadow-lovelya-500/30' : 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'}`}><i className={`fas ${isFocusMode ? 'fa-compress' : 'fa-expand'} md:text-xl`}></i> {isFocusMode ? 'Normal' : 'Focus View'}</button>
          </div>
        </div>

        <div className={`bg-white dark:bg-gray-800 transition-all duration-500 ${isFocusMode ? 'min-h-screen py-16 px-6 md:py-24 md:px-12 lg:px-24' : 'p-6 md:p-16 lg:p-24 rounded-3xl md:rounded-[3rem] lg:rounded-[4rem] shadow-[0_32px_128px_-32px_rgba(0,0,0,0.15)] border border-lovelya-50 dark:border-lovelya-900/10 mb-28 md:mb-40'}`}>
          <div className="max-w-[80ch] mx-auto">
            <h1 className="text-2xl md:text-5xl lg:text-6xl font-black text-gray-900 dark:text-white mb-6 md:mb-12 pb-6 md:pb-12 border-b border-gray-100 dark:border-gray-700 leading-tight tracking-tight">{content?.title || selectedTitle}</h1>

            <div className="prose dark:prose-invert max-w-none leading-[1.6] md:leading-[1.8] lg:leading-[2.0] font-medium text-gray-700 dark:text-gray-200 space-y-7 md:space-y-12" style={{ fontSize: `${window.innerWidth < 768 ? fontSize - 1 : fontSize + 4}px` }}>
              {content ? (
                content.paragraphs?.map((para, pIdx) => (
                  <p key={pIdx} className={`${pIdx === 0 ? 'first-letter:text-6xl md:first-letter:text-8xl lg:first-letter:text-9xl first-letter:font-black first-letter:text-lovelya-600 first-letter:mr-3 md:first-letter:mr-5 first-letter:float-left first-letter:leading-none' : ''}`}>
                    {para.split(/\s+/).map((word, wIdx) => {
                      const currentData = wordList[globalIndex++];
                      if (!currentData) return <span key={wIdx}>{word} </span>;
                      let style = "hover:bg-lovelya-50 dark:hover:bg-lovelya-900/40 rounded px-1 lg:px-2 transition-all cursor-pointer ";
                      if (currentData.status === 'correct') style += "text-green-600 dark:text-green-400 font-black ";
                      if (currentData.status === 'incorrect') style += "text-red-500 font-bold underline decoration-wavy decoration-red-300 underline-offset-4 ";
                      return (
                        <span key={wIdx} className="relative inline-block mr-1 md:mr-1.5 group">
                          <span onClick={(e) => handleWordClick(e, currentData.clean)} className={style}>{word}</span>
                          {currentData.status === 'incorrect' && (
                            <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 px-3 md:px-5 py-1.5 md:py-2 text-[9px] md:text-xs font-black uppercase tracking-widest text-white bg-red-600 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none shadow-xl border border-red-700">{currentData.errorDetails}</span>
                          )}
                        </span>
                      );
                    })}
                  </p>
                ))
              ) : (
                <div className="animate-pulse space-y-4">
                  <div className="h-6 bg-gray-100 dark:bg-gray-700 rounded-lg w-full"></div>
                  <div className="h-6 bg-gray-100 dark:bg-gray-700 rounded-lg w-5/6"></div>
                  <div className="h-6 bg-gray-100 dark:bg-gray-700 rounded-lg w-4/6"></div>
                  <p className="text-gray-400 italic text-xl mt-8">{streamingText}...</p>
                </div>
              )}
            </div>

            <div id="analysis-results-anchor" className="pt-2"></div>
            {analysisResult && (
              <div id="analysis-results" className="mt-20 md:mt-32 pt-16 md:pt-24 border-t-4 border-gray-50 dark:border-gray-800 animate-slide-up space-y-8 md:space-y-16">
                <div className="flex items-center gap-4 md:gap-6"><div className="w-10 h-10 md:w-16 md:h-16 rounded-2xl md:rounded-3xl bg-lovelya-600 text-white flex items-center justify-center shadow-xl"><i className="fas fa-chart-line text-lg md:text-3xl"></i></div><h2 className="text-xl md:text-3xl lg:text-4xl font-black text-gray-800 dark:text-white uppercase tracking-tighter">Performance Analysis</h2></div>
                <div className="grid grid-cols-2 md:grid-cols-2 gap-6 md:gap-10">
                  <div className="p-8 md:p-12 bg-gray-50 dark:bg-gray-800/50 rounded-3xl md:rounded-[3rem] text-center shadow-inner border border-white dark:border-gray-700"><div className="text-4xl md:text-7xl font-black text-lovelya-600">{Math.round(analysisResult.score)}</div><div className="text-[10px] md:text-sm lg:text-base font-black text-gray-400 uppercase tracking-[0.3em] mt-3 md:mt-5">Performance Score</div></div>
                  <div className="p-8 md:p-12 bg-green-50 dark:bg-green-900/10 rounded-3xl md:rounded-[3rem] text-center shadow-inner border border-white dark:border-gray-700"><div className="text-4xl md:text-7xl font-black text-green-600">{Math.round(analysisResult.accuracy)}%</div><div className="text-[10px] md:text-sm lg:text-base font-black text-green-500 uppercase tracking-[0.3em] mt-3 md:mt-5">Pronunciation Accuracy</div></div>
                </div>
                <div className="grid grid-cols-1">
                  <div className="bg-white dark:bg-gray-800 p-8 md:p-16 lg:p-20 rounded-3xl md:rounded-[4rem] border border-gray-100 dark:border-gray-700 shadow-xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 md:w-64 md:h-64 bg-lovelya-50 dark:bg-lovelya-900/10 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-700"></div>
                    <span className="text-[10px] md:text-sm lg:text-base font-black text-lovelya-600 dark:text-lovelya-400 uppercase tracking-[0.4em] block mb-6 md:mb-10 relative z-10">Mastery Feedback</span>
                    <p className="text-gray-700 dark:text-gray-300 text-base md:text-lg lg:text-xl leading-relaxed md:leading-snug lg:leading-normal relative z-10 font-medium italic">{analysisResult.feedback}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="fixed bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 z-[100] w-full max-w-4xl px-6 animate-slide-up">
          <div className="bg-gray-900/95 dark:bg-gray-800/95 backdrop-blur-2xl p-4 md:p-6 rounded-3xl md:rounded-[3.5rem] shadow-[0_32px_128px_-16px_rgba(0,0,0,0.5)] border border-white/10 flex items-center justify-between gap-4 md:gap-8">
            <button
              onClick={isRecording ? stopRecording : startRecording}
              disabled={loading}
              className={`flex-1 flex items-center gap-4 md:gap-6 px-5 md:px-8 py-3 md:py-5 rounded-3xl transition-all duration-300 group shadow-2xl active:scale-90 ${isRecording ? 'bg-red-600 text-white animate-pulse' : loading ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-900 hover:bg-lovelya-50 hover:scale-105'}`}
            >
              <div className={`w-10 h-10 md:w-14 md:h-14 rounded-full flex items-center justify-center text-lg md:text-2xl ${isRecording ? 'bg-white/20' : loading ? 'bg-gray-300' : 'bg-gray-900 text-white shadow-xl group-hover:bg-lovelya-600 transition-colors'}`}>
                <i className={`fas ${isRecording ? 'fa-stop' : loading ? 'fa-spinner fa-spin' : 'fa-microphone'}`}></i>
              </div>
              <div className="text-left flex-1">
                <div className="text-[10px] md:text-base font-black uppercase tracking-[0.2em] md:tracking-[0.2em] leading-none mb-1 md:mb-1.5">
                  {isRecording ? 'Capturing...' : loading ? 'Processing...' : 'Start Practicing'}
                </div>
                <div className={`text-[9px] md:text-sm lg:text-base font-bold opacity-70 ${isRecording ? 'text-white' : 'text-gray-500'}`}>
                  {isRecording ? 'Tap to evaluate' : loading ? 'AI analyzing pitch' : 'Evaluate with AI Tutor'}
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto pb-20">
      {step === 'setup' && (
        <div className="max-w-2xl mx-auto px-4 py-6 md:py-10">
          <button onClick={() => onNavigate?.(AppView.HOME)} className="mb-5 text-gray-400 hover:text-lovelya-600 font-black transition-all flex items-center gap-2 uppercase text-[10px] tracking-widest group">
            <i className="fas fa-arrow-left group-hover:-translate-x-1 transition-transform"></i> Back to Home
          </button>
          <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl p-5 md:p-6 rounded-2xl md:rounded-3xl shadow-xl border border-lovelya-50 dark:border-lovelya-900/10 animate-fade-in relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-lovelya-400 via-lovelya-600 to-lovelya-400"></div>
            <h2 className="text-md md:text-xl font-black mb-6 text-gray-900 dark:text-white text-center tracking-tight">Reading Mastery</h2>
            {loading ? (
              <div className="flex flex-col items-center py-12 animate-fade-in">
                <div className="relative mb-4">
                  <i className="fas fa-book-open text-4xl text-lovelya-500 animate-bounce block"></i>
                </div>
                <p className="font-black text-gray-400 uppercase tracking-widest text-[10px] text-center">{statusMsg || 'Curating your library...'}</p>
              </div>
            ) : (
              <div className="space-y-5">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 mb-2.5 uppercase tracking-widest">1. Proficiency Level</label>
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                    {LEVELS.map(l => <button key={l} onClick={() => setLevel(l)} className={`py-2.5 rounded-xl font-black text-xs transition-all duration-200 ${level === l ? 'bg-lovelya-600 text-white shadow-md scale-105' : 'bg-gray-50 dark:bg-gray-700 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600'}`}>{l}</button>)}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-gray-400 mb-2.5 uppercase tracking-widest">2. Practice Mode</label>
                  <div className="flex gap-1.5 bg-gray-50 dark:bg-gray-700 p-1 rounded-xl shadow-inner">
                    {(['islamic', 'general', 'custom'] as const).map(cat => (
                      <button
                        key={cat}
                        onClick={() => setThemeCategory(cat)}
                        className={`flex-1 py-2 rounded-lg font-black text-[10px] md:text-xs capitalize transition-all duration-200 ${themeCategory === cat ? 'bg-white dark:bg-gray-600 text-lovelya-600 shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {themeCategory !== 'custom' ? (
                  <div className="animate-fade-in">
                    <label className="block text-[10px] font-black text-gray-400 mb-2.5 uppercase tracking-widest">3. Core Theme</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-52 overflow-y-auto custom-scrollbar pr-1">
                      {THEMES.filter(t => themeCategory === 'islamic' ? t.isIslamic : !t.isIslamic).map(t => (
                        <button key={t.id} onClick={() => setTheme(t)} className={`p-3 rounded-xl text-left transition-all duration-200 border-2 text-xs font-semibold ${theme.id === t.id ? 'border-lovelya-500 bg-lovelya-50 dark:bg-lovelya-900/20 text-lovelya-700 font-black shadow-md' : 'border-transparent bg-gray-50 dark:bg-gray-700 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-600'}`}>
                          {t.name}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 animate-slide-up bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl shadow-inner border border-white dark:border-gray-700">
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 mb-2 uppercase tracking-widest">3. Exploration Topic</label>
                      <input value={customTopic} onChange={e => setCustomTopic(e.target.value)} placeholder="What do you want to learn about?" className="w-full p-3 rounded-xl border-2 border-white dark:border-gray-600 bg-white dark:bg-gray-800 outline-none focus:border-lovelya-500 shadow-sm transition-all text-sm font-medium" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 mb-2 uppercase tracking-widest">4. Precise Focus (Optional)</label>
                      <input value={customTitle} onChange={e => setCustomTitle(e.target.value)} placeholder="Specific article title..." className="w-full p-3 rounded-xl border-2 border-white dark:border-gray-600 bg-white dark:bg-gray-800 outline-none focus:border-lovelya-500 shadow-sm transition-all text-sm font-medium" />
                    </div>
                  </div>
                )}
                {error && <div className="p-3 bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 rounded-xl text-xs font-bold text-center border border-red-100 dark:border-red-900/30">{error}</div>}
                <button onClick={() => handleStartSetup(false)} disabled={loading || (themeCategory === 'islamic' && !theme) || (themeCategory === 'custom' && !customTopic)} className="w-full py-4 mt-2 rounded-xl bg-lovelya-600 text-white font-black text-sm shadow-lg hover:bg-lovelya-700 hover:shadow-xl transition-all duration-200 disabled:opacity-50 uppercase tracking-widest active:scale-95 flex items-center justify-center gap-3">
                  Begin Training <i className="fas fa-chevron-right"></i>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {step === 'titles' && renderTitles()}
      {step === 'reading' && renderReading()}

      {/* Modal for Custom Title Input */}
      {showTitleModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white dark:bg-gray-800 w-full max-w-md rounded-3xl shadow-2xl p-6 animate-slide-up">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">Enter Custom Title</h3>
              <button onClick={() => setShowTitleModal(false)} className="text-gray-400 hover:text-gray-600">
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="space-y-4">
              <input
                placeholder="e.g. My Favorite Sunnah..."
                value={newCustomTitle}
                onChange={(e) => setNewCustomTitle(e.target.value)}
                className="w-full p-3.5 border rounded-xl dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-lovelya-500 outline-none transition"
              />
              <button
                onClick={handleRandomTitle}
                disabled={randomTitleLoading}
                className="w-full py-2.5 bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 rounded-xl font-bold hover:bg-purple-100 dark:hover:bg-purple-900/50 transition flex items-center justify-center gap-2"
              >
                {randomTitleLoading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-magic"></i>} Surprise Me (AI Suggestion)
              </button>
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setShowTitleModal(false)}
                  className="flex-1 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-xl font-bold hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (newCustomTitle.trim()) {
                      handleSelectTitle(newCustomTitle);
                      setShowTitleModal(false);
                    }
                  }}
                  className="flex-1 py-2.5 bg-lovelya-600 text-white rounded-xl font-bold hover:bg-lovelya-700 shadow-lg"
                >
                  Start Reading
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default ReadingModule;