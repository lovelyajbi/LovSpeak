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
  const [selectedWordInfo, setSelectedWordInfo] = useState<{word: string, ipa: string, rect?: DOMRect} | null>(null);
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
      <div className="space-y-4 md:space-y-8 animate-fade-in max-w-4xl mx-auto pb-20 px-2 md:px-0">
        <div className="flex items-center justify-between px-1 md:px-2">
          <button onClick={() => setStep('setup')} className="text-gray-500 hover:text-gray-800 font-bold flex items-center gap-2 transition text-[10px] md:text-sm"><i className="fas fa-arrow-left"></i> Change Topic</button>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => handleStartSetup(true)} 
              disabled={loading}
              className="p-2 md:p-2.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-500 hover:text-lovelya-600 transition shadow-sm"
              title="Refresh Topics"
            >
              <i className={`fas fa-sync-alt ${loading ? 'fa-spin' : ''}`}></i>
            </button>
            <div className="bg-lovelya-50 dark:bg-lovelya-900/20 text-lovelya-600 dark:text-lovelya-400 px-2.5 md:px-4 py-1 md:py-2 rounded-full font-bold text-[9px] md:text-sm border border-lovelya-100 dark:border-lovelya-800">{themeCategory === 'custom' ? customTopic : theme.name}</div>
          </div>
        </div>
        
        {titles.length === 0 ? (
            <div className="text-center py-12 md:py-20 bg-white dark:bg-gray-800 rounded-2xl md:rounded-3xl border border-dashed border-gray-300 dark:border-gray-700">
                <p className="text-gray-400 font-bold text-xs md:text-base">No titles found. Please try generating again.</p>
                <button onClick={() => handleStartSetup(false)} className="mt-4 px-5 py-2 bg-lovelya-500 text-white rounded-xl font-bold text-xs md:text-base">Retry</button>
            </div>
        ) : (
          <>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {currentTitles.map((title, idx) => (
            <button key={idx} onClick={() => handleSelectTitle(title)} className="bg-white dark:bg-gray-800 p-4 md:p-5 rounded-3xl border border-gray-100 dark:border-gray-700 hover:border-lovelya-400 hover:shadow-lg transition-all text-left h-full flex flex-col justify-between group transform hover:-translate-y-1">
              <h3 className="font-bold text-[11px] md:text-sm text-gray-800 dark:text-gray-100 group-hover:text-lovelya-600 leading-snug line-clamp-2">{title}</h3>
              <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-lovelya-50 dark:bg-gray-700 text-lovelya-400 group-hover:bg-lovelya-500 group-hover:text-white transition-all flex items-center justify-center mt-3 shadow-sm"><i className="fas fa-book-open text-[10px]"></i></div>
            </button>
          ))}
          {/* Custom Title Card */}
          <button 
            onClick={() => setShowTitleModal(true)} 
            className="bg-gray-50 dark:bg-gray-800/50 p-4 md:p-5 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-700 hover:border-lovelya-400 hover:bg-lovelya-50 dark:hover:bg-lovelya-900/20 transition flex flex-col items-center justify-center gap-2 group min-h-[90px] md:min-h-[120px]"
          >
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white dark:bg-gray-700 flex items-center justify-center shadow-sm group-hover:scale-110 transition text-lovelya-500 text-base">
              <i className="fas fa-plus"></i>
            </div>
            <span className="font-black uppercase tracking-widest font-bold text-[8px] md:text-[10px] text-gray-400 group-hover:text-lovelya-600">Custom Title</span>
          </button>
        </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 md:gap-4 mt-6 md:mt-8">
                <button 
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-500 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-lovelya-50 dark:hover:bg-lovelya-900/20 transition text-xs md:text-base"
                >
                  <i className="fas fa-chevron-left"></i>
                </button>
                <span className="text-[10px] md:text-sm font-black text-gray-500">
                  Page {currentPage} of {totalPages}
                </span>
                <button 
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-500 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-lovelya-50 dark:hover:bg-lovelya-900/20 transition text-xs md:text-base"
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
      <div className={`transition-all duration-500 ${isFocusMode ? 'fixed inset-0 z-[60] bg-gray-50 dark:bg-gray-900 overflow-y-auto' : 'max-w-4xl mx-auto px-2 md:px-0'}`}>
        <div className={`mb-4 md:mb-6 flex items-center justify-between bg-white/90 dark:bg-gray-800/90 backdrop-blur-md p-2.5 md:p-4 rounded-xl md:rounded-2xl shadow-sm border border-lovelya-100 dark:border-lovelya-800 sticky top-0 z-[70] ${isFocusMode ? 'mx-2 md:mx-4 mt-2 md:mt-4' : ''}`}>
           <button onClick={() => setStep(initialContext?.autoStart ? 'setup' : 'titles')} className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-500 hover:text-gray-800 transition text-xs md:text-base"><i className="fas fa-arrow-left"></i></button>
           <div className="flex gap-1.5 md:gap-2">
             <button onClick={() => setFontSize(prev => Math.max(12, prev - 2))} className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-500 hover:text-gray-800 transition text-xs md:text-base" title="Decrease font size">A-</button>
             <button onClick={() => setFontSize(prev => Math.min(48, prev + 2))} className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-500 hover:text-gray-800 transition text-xs md:text-base" title="Increase font size">A+</button>
             <button onClick={() => setIsFocusMode(!isFocusMode)} className={`px-2.5 py-1.5 md:px-4 md:py-2 rounded-lg md:rounded-xl text-[9px] md:text-xs font-bold uppercase transition flex items-center gap-1.5 md:gap-2 ${isFocusMode ? 'bg-lovelya-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-500'}`}><i className={`fas ${isFocusMode ? 'fa-compress' : 'fa-expand'}`}></i> {isFocusMode ? 'Normal' : 'Focus'}</button>
           </div>
        </div>

        <div className={`bg-white dark:bg-gray-800 transition-all duration-500 ${isFocusMode ? 'min-h-screen py-10 px-4 md:py-12 md:px-6' : 'p-4 md:p-12 rounded-2xl md:rounded-[2.5rem] shadow-xl border border-lovelya-100 dark:border-lovelya-800 mb-24 md:mb-32'}`}>
          <div className="max-w-[75ch] mx-auto">
            <h1 className="text-xl md:text-3xl font-black text-gray-900 dark:text-white mb-4 md:mb-8 pb-4 md:pb-8 border-b border-gray-100 dark:border-gray-700 leading-tight">{content?.title || selectedTitle}</h1>
            
            <div className="prose dark:prose-invert max-w-none leading-[1.6] md:leading-[1.9] font-medium text-gray-700 dark:text-gray-300 space-y-5 md:space-y-10" style={{ fontSize: `${window.innerWidth < 768 ? fontSize - 2 : fontSize}px` }}>
              {content ? (
                content.paragraphs?.map((para, pIdx) => (
                  <p key={pIdx} className={`${pIdx === 0 ? 'first-letter:text-5xl md:first-letter:text-7xl first-letter:font-black first-letter:text-lovelya-600 first-letter:mr-2 md:first-letter:mr-3 first-letter:float-left first-letter:leading-none' : ''}`}>
                    {para.split(/\s+/).map((word, wIdx) => {
                      const currentData = wordList[globalIndex++];
                      if (!currentData) return <span key={wIdx}>{word} </span>;
                      let style = "hover:bg-lovelya-50 dark:hover:bg-lovelya-900/40 rounded px-0.5 md:px-1 transition-all cursor-pointer ";
                      if (currentData.status === 'correct') style += "text-green-600 dark:text-green-400 font-bold ";
                      if (currentData.status === 'incorrect') style += "text-red-500 font-bold underline decoration-wavy decoration-red-300 ";
                      return (
                        <span key={wIdx} className="relative inline-block mr-1 group">
                          <span onClick={(e) => handleWordClick(e, currentData.clean)} className={style}>{word}</span>
                          {currentData.status === 'incorrect' && (
                            <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 md:px-3 py-1 text-[8px] md:text-[10px] font-black uppercase text-white bg-red-600 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none">{currentData.errorDetails}</span>
                          )}
                        </span>
                      );
                    })}
                  </p>
                ))
              ) : (
                <div className="animate-pulse">
                  <p className="text-gray-400 italic">{streamingText}...</p>
                </div>
              )}
            </div>

            <div id="analysis-results-anchor" className="pt-1"></div>
            {analysisResult && (
              <div id="analysis-results" className="mt-12 md:mt-20 pt-12 md:pt-20 border-t-2 border-gray-100 dark:border-gray-800 animate-slide-up space-y-6 md:space-y-10">
                <div className="flex items-center gap-3 md:gap-4"><div className="w-8 h-8 md:w-10 md:h-10 rounded-xl md:rounded-2xl bg-lovelya-500 text-white flex items-center justify-center shadow-lg"><i className="fas fa-chart-line text-sm md:text-lg"></i></div><h2 className="text-lg md:text-xl font-black text-gray-800 dark:text-white uppercase tracking-tight">Summary</h2></div>
                <div className="grid grid-cols-2 md:grid-cols-2 gap-4 md:gap-6">
                   <div className="p-4 md:p-6 bg-gray-50 dark:bg-gray-800/50 rounded-2xl md:rounded-[2rem] text-center"><div className="text-2xl md:text-4xl font-black text-lovelya-600">{Math.round(analysisResult.score)}</div><div className="text-[8px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1 md:mt-2">Score</div></div>
                   <div className="p-4 md:p-6 bg-green-50 dark:bg-green-900/10 rounded-2xl md:rounded-[2rem] text-center"><div className="text-2xl md:text-4xl font-black text-green-600">{Math.round(analysisResult.accuracy)}%</div><div className="text-[8px] md:text-[10px] font-black text-green-500 uppercase tracking-widest mt-1 md:mt-2">Accuracy</div></div>
                </div>
                <div className="grid grid-cols-1 gap-4 md:gap-6">
                   <div className="bg-white dark:bg-gray-800 p-5 md:p-8 rounded-2xl md:rounded-[2rem] border border-gray-100 dark:border-gray-700 shadow-sm"><span className="text-[10px] md:text-xs font-black text-lovelya-500 uppercase tracking-widest block mb-2 md:mb-4">Feedback</span><p className="text-gray-700 dark:text-gray-300 text-sm md:text-lg leading-relaxed">{analysisResult.feedback}</p></div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="fixed bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-[100] w-full max-w-2xl px-4 animate-slide-up">
           <div className="bg-gray-900/90 dark:bg-gray-800/95 backdrop-blur-xl p-3 md:p-4 rounded-2xl md:rounded-[2.5rem] shadow-2xl border border-white/10 flex items-center justify-between gap-3 md:gap-4">
              <button 
                onClick={isRecording ? stopRecording : startRecording} 
                disabled={loading} 
                className={`flex-1 flex items-center gap-3 md:gap-4 px-4 md:px-6 py-3 md:py-4 rounded-full transition-all group shadow-xl active:scale-95 ${isRecording ? 'bg-red-600 text-white animate-pulse' : loading ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-900 hover:bg-gray-100'}`}
              >
                <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-base md:text-xl ${isRecording ? 'bg-white/20' : loading ? 'bg-gray-300' : 'bg-gray-900 text-white transition'}`}>
                  <i className={`fas ${isRecording ? 'fa-stop' : loading ? 'fa-spinner fa-spin' : 'fa-microphone'}`}></i>
                </div>
                <div className="text-left">
                  <div className="text-[10px] md:text-xs font-black uppercase tracking-widest leading-none mb-0.5 md:mb-1">
                    {isRecording ? 'Recording...' : loading ? 'Preparing...' : 'Start Practicing'}
                  </div>
                  <div className={`text-[8px] md:text-[10px] font-bold opacity-60 ${isRecording ? 'text-white' : 'text-gray-500'}`}>
                    {isRecording ? 'Tap to finish' : loading ? 'AI is generating' : 'AI Analysis'}
                  </div>
                </div>
              </button>
           </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto">
      {step === 'setup' && (
        <div className="max-w-2xl mx-auto px-2 md:px-0">
          <button onClick={() => onNavigate?.(AppView.HOME)} className="mb-4 md:mb-6 text-gray-400 hover:text-gray-600 font-bold transition flex items-center gap-2 uppercase text-[10px] md:text-xs tracking-widest">
            <i className="fas fa-arrow-left"></i> Back to Home
          </button>
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-4 md:p-6 rounded-2xl md:rounded-3xl shadow-soft border border-lovelya-100 animate-fade-in">
            <h2 className="text-base md:text-xl font-black mb-4 md:mb-6 text-gray-800 dark:text-white text-center tracking-tight">Reading Practice</h2>
          {loading ? (
             <div className="flex flex-col items-center py-10 md:py-16 animate-pulse">
                <i className="fas fa-magic text-2xl md:text-4xl text-lovelya-500 mb-3 md:mb-5"></i>
                <p className="font-black text-gray-400 uppercase tracking-widest text-[9px] md:text-xs text-center">{statusMsg || 'Building Your Experience...'}</p>
             </div>
          ) : (
          <div className="space-y-5 md:space-y-6">
            <div>
              <label className="block text-[8px] md:text-[10px] font-black text-gray-400 mb-2 md:mb-2.5 uppercase tracking-widest">1. Select Proficiency Level</label>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                {LEVELS.map(l => <button key={l} onClick={() => setLevel(l)} className={`py-1.5 md:py-2 rounded-lg font-black text-[10px] md:text-sm transition-all ${level === l ? 'bg-lovelya-500 text-white shadow-md' : 'bg-gray-50 dark:bg-gray-700 text-gray-500'}`}>{l}</button>)}
              </div>
            </div>

            <div>
              <label className="block text-[8px] md:text-[10px] font-black text-gray-400 mb-2 md:mb-2.5 uppercase tracking-widest">2. Select Category</label>
              <div className="flex gap-1 bg-gray-50 dark:bg-gray-700 p-0.5 rounded-xl">
                 {(['islamic', 'general', 'custom'] as const).map(cat => (
                   <button 
                    key={cat}
                    onClick={() => setThemeCategory(cat)}
                    className={`flex-1 py-1.5 md:py-2 rounded-lg font-black text-[10px] md:text-xs capitalize transition-all ${themeCategory === cat ? 'bg-white dark:bg-gray-600 text-lovelya-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                   >
                     {cat}
                   </button>
                 ))}
              </div>
            </div>

            {themeCategory !== 'custom' ? (
              <div className="animate-fade-in">
                <label className="block text-[8px] md:text-[10px] font-black text-gray-400 mb-2 md:mb-2.5 uppercase tracking-widest">3. Pick a Theme</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-40 md:max-h-56 overflow-y-auto custom-scrollbar pr-1 md:pr-1.5">
                  {THEMES.filter(t => themeCategory === 'islamic' ? t.isIslamic : !t.isIslamic).map(t => (
                    <button key={t.id} onClick={() => setTheme(t)} className={`p-2.5 md:p-3 rounded-xl text-left transition border-2 text-[10px] md:text-sm ${theme.id === t.id ? 'border-lovelya-500 bg-lovelya-50 dark:bg-lovelya-900/20 text-lovelya-700 font-bold' : 'border-transparent bg-gray-50 dark:bg-gray-700 text-gray-500 hover:border-gray-200'}`}>
                      {t.name}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-3 animate-slide-up">
                <div>
                  <label className="block text-[8px] md:text-[10px] font-black text-gray-400 mb-1.5 uppercase tracking-widest">3. Topic Theme</label>
                  <input value={customTopic} onChange={e => setCustomTopic(e.target.value)} placeholder="Topic theme..." className="w-full p-2.5 md:p-3 rounded-xl border-2 border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 outline-none focus:border-lovelya-500 transition text-[11px] md:text-sm font-bold" />
                </div>
                <div>
                  <label className="block text-[8px] md:text-[10px] font-black text-gray-400 mb-1.5 uppercase tracking-widest">4. Specific Title (Optional)</label>
                  <input value={customTitle} onChange={e => setCustomTitle(e.target.value)} placeholder="Lesson title..." className="w-full p-2.5 md:p-3 rounded-xl border-2 border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 outline-none focus:border-lovelya-500 transition text-[11px] md:text-sm font-bold" />
                </div>
              </div>
            )}
            {error && <div className="p-3 bg-red-50 text-red-500 rounded-xl text-[9px] md:text-xs font-bold text-center border border-red-100">{error}</div>}
            <button onClick={() => handleStartSetup(false)} disabled={loading || (themeCategory === 'islamic' && !theme) || (themeCategory === 'custom' && !customTopic)} className="w-full py-3 md:py-4 mt-3 md:mt-4 rounded-xl md:rounded-2xl bg-lovelya-600 text-white font-black text-xs md:text-base shadow-lg hover:bg-lovelya-700 transition disabled:opacity-50 uppercase tracking-widest">Start Lesson</button>
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
                          if(newCustomTitle.trim()) { 
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