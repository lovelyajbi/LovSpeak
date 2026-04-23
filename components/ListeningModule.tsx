import React, { useState, useEffect, useRef } from 'react';
import { Level, ModuleProps, AppView, ModuleContext, QuizQuestion } from '../types';
import { LEVELS } from '../constants';
import { generateListeningTitles, generateListeningScript, generateListeningQuiz, generateTTSAudio, generateSingleListeningTitle } from '../services/gemini';
import { logActivity, completeRoadmapUnit, getCachedListeningTitles, setCachedListeningTitles } from '../services/storage';
import { audioService } from '../services/audioService';
import { base64ToUint8Array, pcmToWav } from '../utils/audio';

// Define Listening Specific Themes
const LISTENING_THEMES = [
  { id: 'adab', name: 'Adab (Manners)', isIslamic: true },
  { id: 'akhlak', name: 'Akhlak (Character)', isIslamic: true },
  { id: 'tauhid', name: 'Tauhid (Monotheism)', isIslamic: true },
  { id: 'prophets', name: 'Stories of Prophets', isIslamic: true },
  { id: 'righteous', name: 'Stories of Righteous People', isIslamic: true },
  { id: 'daily', name: 'Daily Conversations', isIslamic: false },
  { id: 'education', name: 'Education & Learning', isIslamic: false },
  { id: 'work', name: 'Workplace Scenarios', isIslamic: false },
  { id: 'travel', name: 'Travel Experiences', isIslamic: false },
  { id: 'health', name: 'Health & Lifestyle', isIslamic: false },
  { id: 'tech', name: 'Technology Trends', isIslamic: false },
  { id: 'environment', name: 'Environment & Nature', isIslamic: false },
  { id: 'science', name: 'Science & Discovery', isIslamic: false },
  { id: 'history', name: 'World History', isIslamic: false },
  { id: 'business', name: 'Business & Finance', isIslamic: false },
  { id: 'arts', name: 'Arts & Culture', isIslamic: false },
  { id: 'sports', name: 'Sports & Fitness', isIslamic: false },
];

const SPEED_OPTIONS = [0.5, 0.75, 0.9, 1.0, 1.25, 1.5, 2.0];

const ListeningModule: React.FC<ModuleProps> = ({ onComplete, initialContext, onNavigate }) => {
  // Navigation State
  const [step, setStep] = useState<'setup' | 'titles' | 'player' | 'result'>('setup');

  // Selection State
  const [level, setLevel] = useState<Level>('A1');
  const [type, setType] = useState<'monologue' | 'dialogue'>('monologue');
  const [themeId, setThemeId] = useState<string>('');
  const [selectedTitle, setSelectedTitle] = useState<string>('');
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [themeCategory, setThemeCategory] = useState<'islamic' | 'general'>('islamic');

  // Custom Input State
  const [customTopic, setCustomTopic] = useState('');
  const [customTitle, setCustomTitle] = useState('');

  // Data State
  const [titles, setTitles] = useState<string[]>([]);
  const [script, setScript] = useState<string>('');
  const [quiz, setQuiz] = useState<QuizQuestion[]>([]);

  // Player State
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);

  // Quiz State
  const [quizLoading, setQuizLoading] = useState(false);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [score, setScore] = useState(0);

  // UI State
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const [error, setError] = useState('');

  // Modal State: Add Title
  const [showTitleModal, setShowTitleModal] = useState(false);
  const [newCustomTitle, setNewCustomTitle] = useState('');
  const [randomTitleLoading, setRandomTitleLoading] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // --- PERSISTENCE LOGIC ---
  useEffect(() => {
    if (initialContext?.autoStart) return;

    const savedState = localStorage.getItem('lovspeak_state_listening');
    if (savedState) {
      try {
        const state = JSON.parse(savedState);
        setStep(state.step || 'setup');
        setLevel(state.level || 'A1');
        setType(state.type || 'monologue');
        setThemeId(state.themeId || '');
        setSelectedTitle(state.selectedTitle || '');
        setIsCustomMode(state.isCustomMode || false);
        setThemeCategory(state.themeCategory || 'islamic');
        setCustomTopic(state.customTopic || '');
        setCustomTitle(state.customTitle || '');
        setTitles(state.titles || []);
        setScript(state.script || '');
        setQuiz(state.quiz || []);
        setCurrentPage(state.currentPage || 1);
        // Note: audioUrl is not persisted as it's a blob URL
      } catch (e) {
        console.error("Failed to load listening state", e);
      }
    }
  }, []);

  useEffect(() => {
    if (initialContext?.autoStart) return;

    const stateToSave = {
      step, level, type, themeId, selectedTitle, isCustomMode,
      themeCategory, customTopic, customTitle, titles, script, quiz, currentPage
    };
    localStorage.setItem('lovspeak_state_listening', JSON.stringify(stateToSave));
  }, [step, level, type, themeId, selectedTitle, isCustomMode, themeCategory, customTopic, customTitle, titles, script, quiz, currentPage]);

  // --- AUTO START LOGIC ---
  useEffect(() => {
    if (initialContext?.autoStart && initialContext.type === 'unit') {
      autoLaunch(initialContext);
    }
  }, [initialContext]);

  const autoLaunch = async (ctx: ModuleContext) => {
    setSelectedTitle(ctx.title);
    setLevel(ctx.level);
    setType('monologue');
    setCustomTopic(ctx.vocabTheme || 'General');
    setIsCustomMode(true);

    processSelection(ctx.title, ctx.vocabTheme || 'General', false);
  };

  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  // --- AUDIO HANDLERS ---

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
  };

  const togglePlayback = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = Number(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    if (audioRef.current) {
      audioRef.current.playbackRate = speed;
    }
    setShowSpeedMenu(false);
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const min = Math.floor(time / 60);
    const sec = Math.floor(time % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  // --- LOGIC HANDLERS ---

  const handleFetchTitles = async (forceRefresh = false) => {
    if (!themeId) {
      setError('Please select a theme.');
      return;
    }

    if (!forceRefresh) {
      const cached = getCachedListeningTitles(level, type, themeId);
      if (cached && cached.length > 0) {
        setTitles(cached);
        setCurrentPage(1);
        setStep('titles');
        return;
      }
    }

    audioService.play('tap');
    setError('');
    setLoading(true);
    setStatusMsg(forceRefresh ? 'Refreshing topics...' : 'Generating topics...');
    try {
      const themeObj = LISTENING_THEMES.find(t => t.id === themeId);
      const generated = await generateListeningTitles(level, type, themeObj?.name || '', themeObj?.isIslamic || false);
      if (!generated || generated.length === 0) {
        throw new Error("No titles were generated. Please try again.");
      }
      setTitles(generated);
      setCachedListeningTitles(level, type, themeId, generated);
      setCurrentPage(1);
      setStep('titles');
    } catch (e: any) {
      console.error(e);
      setError(e.message || 'Failed to generate titles. Try again.');
      setTitles([]);
    } finally {
      setLoading(false);
      setStatusMsg('');
    }
  };

  const processSelection = async (title: string, themeName: string, isIslamic: boolean) => {
    setLoading(true);
    setError('');
    setQuiz([]);

    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }

    try {
      setStatusMsg('Writing audio script...');
      const generatedScript = await generateListeningScript(title, level, type, themeName, isIslamic);
      if (!generatedScript) throw new Error("Failed to generate script");
      setScript(generatedScript);

      setStatusMsg('Generating AI voice audio...');
      const base64Audio = await generateTTSAudio(generatedScript, type);
      if (!base64Audio) throw new Error("Failed to generate audio data");

      const binary = base64ToUint8Array(base64Audio);
      const wavBlob = pcmToWav(binary, 24000);
      const url = URL.createObjectURL(wavBlob);
      setAudioUrl(url);

      setCurrentTime(0);
      setDuration(0);
      setIsPlaying(false);
      setPlaybackSpeed(1.0);

      setStep('player');
    } catch (e) {
      console.error(e);
      setError('Failed to generate content. Please try a different topic.');
    } finally {
      setLoading(false);
      setStatusMsg('');
    }
  };

  const handleGenerateQuiz = async () => {
    if (!script) return;
    setQuizLoading(true);
    setError('');
    try {
      const generatedQuiz = await generateListeningQuiz(script, level);
      if (!generatedQuiz || generatedQuiz.length === 0) {
        setError("AI generation returned empty. Please try again.");
        setQuiz([]);
      } else {
        setQuiz(generatedQuiz);
        setUserAnswers(new Array(generatedQuiz.length).fill(-1));
      }
    } catch (e) {
      console.error(e);
      setError("Failed to generate quiz due to network error.");
    } finally {
      setQuizLoading(false);
    }
  };

  const handleSelectTitle = (title: string) => {
    audioService.play('nav');
    setSelectedTitle(title);
    if (isCustomMode) {
      processSelection(title, customTopic, false);
    } else {
      const themeObj = LISTENING_THEMES.find(t => t.id === themeId);
      processSelection(title, themeObj?.name || '', themeObj?.isIslamic || false);
    }
  };

  const handleRegenerate = () => {
    if (window.confirm("Generate a new conversation for this title?")) {
      handleSelectTitle(selectedTitle);
    }
  };

  const handleRandomTitle = async () => {
    setRandomTitleLoading(true);
    try {
      const themeObj = LISTENING_THEMES.find(t => t.id === themeId);
      const themeName = themeObj?.name || customTopic || 'General Conversation';
      const isIslamic = themeObj?.isIslamic || false;
      const random = await generateSingleListeningTitle(level, type, themeName, isIslamic);
      setNewCustomTitle(random);
    } catch (e) {
      console.error(e);
    } finally {
      setRandomTitleLoading(false);
    }
  };

  const handleCustomStart = async () => {
    if (!customTopic) {
      setError("Please fill in Topic Theme");
      return;
    }

    if (customTitle) {
      setSelectedTitle(customTitle);
      processSelection(customTitle, customTopic, false);
    } else {
      setError('');
      setLoading(true);
      setStatusMsg('Generating topics...');
      try {
        const generated = await generateListeningTitles(level, type, customTopic, false);
        if (!generated || generated.length === 0) {
          throw new Error("No titles were generated. Please try again.");
        }
        setTitles(generated);
        setCurrentPage(1);
        setStep('titles');
      } catch (e: any) {
        console.error(e);
        setError(e.message || 'Failed to generate titles. Try again.');
        setTitles([]);
      } finally {
        setLoading(false);
        setStatusMsg('');
      }
    }
  };

  const handleSubmitQuiz = () => {
    let correctCount = 0;
    quiz.forEach((q, idx) => {
      if (userAnswers[idx] === q.correctIndex) correctCount++;
    });

    const finalScore = quiz.length > 0 ? Math.round((correctCount / quiz.length) * 100) : 0;
    setScore(finalScore);

    logActivity({
      type: AppView.LISTENING,
      date: new Date().toISOString(),
      durationSeconds: Math.round(duration),
      score: finalScore,
      accuracy: finalScore,
      details: `${selectedTitle} (${type})`
    });

    if (initialContext?.stepId && finalScore >= 70) {
      completeRoadmapUnit(initialContext.stepId);
    }

    setStep('result');
    if (onComplete && finalScore >= 70) onComplete();
  };

  // --- RENDERERS ---

  const renderSetup = () => (
    <div className="max-w-4xl mx-auto px-2 md:px-0">
      <button onClick={() => onNavigate?.(AppView.HOME)} className="mb-4 md:mb-6 text-gray-400 hover:text-gray-600 font-bold transition flex items-center gap-2 uppercase text-[10px] md:text-xs tracking-widest">
        <i className="fas fa-arrow-left"></i> Back to Home
      </button>
      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-4 md:p-6 rounded-2xl md:rounded-3xl shadow-sm border border-lovelya-100 dark:border-gray-700 animate-fade-in">
        <h2 className="text-sm md:text-lg font-black mb-3 md:mb-4 text-lovelya-700 dark:text-lovelya-300 text-center tracking-tight">
          <i className="fas fa-headphones mr-2 md:mr-3"></i> Listening Practice
        </h2>

        <div className="flex justify-center mb-4 md:mb-5">
          <div className="bg-gray-100 dark:bg-gray-700 p-0.5 rounded-xl flex">
            <button onClick={() => setIsCustomMode(false)} className={`px-4 py-1.5 md:px-5 md:py-1.5 rounded-lg text-[9px] md:text-[10px] font-black uppercase tracking-widest transition ${!isCustomMode ? 'bg-white dark:bg-gray-600 shadow text-lovelya-600 dark:text-white' : 'text-gray-400'}`}>Standard</button>
            <button onClick={() => setIsCustomMode(true)} className={`px-4 py-1.5 md:px-5 md:py-1.5 rounded-lg text-[9px] md:text-[10px] font-black uppercase tracking-widest transition ${isCustomMode ? 'bg-white dark:bg-gray-600 shadow text-lovelya-600 dark:text-white' : 'text-gray-400'}`}>Custom</button>
          </div>
        </div>

        <div className="space-y-5 md:space-y-6">
          <div>
            <label className="block text-xs md:text-sm font-black text-gray-500 dark:text-gray-400 mb-2 md:mb-2.5 uppercase tracking-widest">1. Select Level</label>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
              {LEVELS.map(l => (
                <button key={l} onClick={() => setLevel(l)} className={`py-1.5 md:py-2 rounded-lg text-[10px] md:text-xs font-black transition-all ${level === l ? 'bg-lovelya-500 text-white shadow-md' : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-400 hover:bg-gray-200'}`}>{l}</button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs md:text-sm font-black text-gray-500 dark:text-gray-400 mb-2 md:mb-2.5 uppercase tracking-widest">2. Select Type</label>
            <div className="flex gap-2 md:gap-3">
              <button onClick={() => setType('monologue')} className={`flex-1 p-2 md:p-3 rounded-xl border-2 transition flex items-center justify-center gap-2 text-[10px] md:text-xs ${type === 'monologue' ? 'border-lovelya-500 bg-lovelya-50 dark:bg-lovelya-900/20 text-lovelya-700 font-black uppercase tracking-wider' : 'border-gray-100 dark:border-gray-700 text-gray-400'}`}><i className="fas fa-user text-xs md:text-base"></i> Monologue</button>
              <button onClick={() => setType('dialogue')} className={`flex-1 p-2 md:p-3 rounded-xl border-2 transition flex items-center justify-center gap-2 text-[10px] md:text-xs ${type === 'dialogue' ? 'border-lovelya-500 bg-lovelya-50 dark:bg-lovelya-900/20 text-lovelya-700 font-black uppercase tracking-wider' : 'border-gray-100 dark:border-gray-700 text-gray-400'}`}><i className="fas fa-user-friends text-xs md:text-base"></i> Dialogue</button>
            </div>
          </div>

          {!isCustomMode ? (
            <div>
              <label className="block text-xs md:text-sm font-black text-gray-500 dark:text-gray-400 mb-2 md:mb-2.5 uppercase tracking-widest">3. Choose Topic</label>
              <div className="flex gap-2 md:gap-3 mb-2.5 md:mb-3">
                <button onClick={() => setThemeCategory('islamic')} className={`flex-1 py-1.5 md:py-2 rounded-lg border-2 text-[10px] md:text-xs font-black uppercase tracking-widest transition flex items-center justify-center gap-1.5 ${themeCategory === 'islamic' ? 'border-lovelya-500 text-lovelya-600 bg-lovelya-50 dark:bg-lovelya-900/20' : 'border-gray-100 text-gray-400 dark:border-gray-700'}`}><i className="fas fa-moon"></i> Islamic</button>
                <button onClick={() => setThemeCategory('general')} className={`flex-1 py-1.5 md:py-2 rounded-lg border-2 text-[10px] md:text-xs font-black uppercase tracking-widest transition flex items-center justify-center gap-1.5 ${themeCategory === 'general' ? 'border-lovelya-500 text-lovelya-600 bg-lovelya-50 dark:bg-lovelya-900/20' : 'border-gray-100 text-gray-400 dark:border-gray-700'}`}><i className="fas fa-globe"></i> General</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 max-h-40 md:max-h-56 overflow-y-auto custom-scrollbar p-0.5">
                {LISTENING_THEMES.filter(t => themeCategory === 'islamic' ? t.isIslamic : !t.isIslamic).map(t => (
                  <button key={t.id} onClick={() => setThemeId(t.id)} className={`p-2.5 md:p-3 rounded-xl text-left transition border-2 text-[10px] md:text-xs font-bold ${themeId === t.id ? 'border-lovelya-500 bg-lovelya-50 dark:bg-lovelya-900/20 text-lovelya-700' : 'border-transparent bg-gray-50 dark:bg-gray-700 text-gray-500 hover:border-gray-200'}`}>{t.name}{t.isIslamic && <span className="ml-1">🌙</span>}</button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-3 animate-slide-up">
              <div><label className="block text-xs md:text-sm font-black text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-widest">3. Topic Theme</label><input value={customTopic} onChange={e => setCustomTopic(e.target.value)} placeholder="e.g. Life in Medina..." className="w-full p-2.5 md:p-3.5 rounded-xl border-2 border-gray-100 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-lovelya-500 outline-none text-[11px] md:text-sm font-bold" /></div>
              <div><label className="block text-xs md:text-sm font-black text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-widest">4. Specific Title <span className="text-[9px] md:text-[10px] font-medium text-gray-400 ml-1">(Optional)</span></label><input value={customTitle} onChange={e => setCustomTitle(e.target.value)} placeholder="Leave empty for AI suggestions..." className="w-full p-2.5 md:p-3.5 rounded-xl border-2 border-gray-100 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-lovelya-500 outline-none text-[11px] md:text-sm font-bold" /></div>
            </div>
          )}

          {error && <p className="text-red-500 text-center text-[10px] md:text-sm font-bold border border-red-100 p-2 md:p-3 rounded-xl bg-red-50">{error}</p>}

          <button onClick={() => !isCustomMode ? handleFetchTitles(false) : handleCustomStart()} disabled={loading || (!isCustomMode && !themeId) || (isCustomMode && !customTopic)} className="w-full py-3 md:py-3.5 rounded-xl bg-lovelya-600 text-white font-black text-[13px] md:text-base shadow-lg hover:bg-lovelya-700 transition disabled:opacity-50 flex items-center justify-center gap-2 md:gap-3 uppercase tracking-widest">
            {loading ? <span className="flex items-center gap-2"><i className="fas fa-spinner fa-spin"></i> {statusMsg || 'Loading...'}</span> : <span className="flex items-center gap-2">{!isCustomMode ? <i className="fas fa-search text-xs"></i> : <i className="fas fa-magic text-xs"></i>}{!isCustomMode ? 'Get Lessons' : (customTitle ? 'Start Now' : 'Suggestions')}</span>}
          </button>
        </div>
      </div>
    </div>
  );

  const renderTitles = () => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentTitles = titles.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(titles.length / itemsPerPage);

    return (
      <div className="space-y-4 md:space-y-6 animate-fade-in-up max-w-4xl mx-auto pb-20">
        <div className="flex items-center justify-between bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-3 md:p-4 rounded-xl shadow-sm border border-lovelya-100 dark:border-gray-700">
          <button onClick={() => setStep('setup')} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 flex items-center gap-2 font-bold transition text-xs md:text-sm"><i className="fas fa-arrow-left"></i> Back</button>
          <div className="flex items-center gap-3">
            {!isCustomMode && (
              <button
                onClick={() => handleFetchTitles(true)}
                disabled={loading}
                className="p-2 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-500 hover:text-lovelya-600 transition"
                title="Refresh Topics"
              >
                <i className={`fas fa-sync-alt ${loading ? 'fa-spin' : ''}`}></i>
              </button>
            )}
            <div className="text-right">
              <span className="bg-lovelya-100 text-lovelya-700 px-2 md:px-3 py-0.5 md:py-1 rounded-full text-[10px] md:text-xs font-bold mr-2 uppercase">{level}</span>
              <span className="font-bold text-gray-700 dark:text-gray-200 text-xs md:text-sm">{isCustomMode ? customTopic : LISTENING_THEMES.find(t => t.id === themeId)?.name}</span>
            </div>
          </div>
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white px-2">Select a Conversation</h2>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 p-4 rounded-xl text-red-600 dark:text-red-400 text-sm font-bold flex items-center gap-3 animate-shake">
            <i className="fas fa-exclamation-circle text-lg"></i>
            <p>{error}</p>
          </div>
        )}

        {loading ? (
          <div className="text-center py-20"><i className="fas fa-spinner fa-spin text-4xl text-lovelya-500 mb-4"></i><p className="text-gray-500">Preparing content...</p></div>
        ) : titles.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-3xl border-2 border-dashed border-gray-200">
            <p className="text-gray-400 font-bold mb-4">No suggestions found. Please try again.</p>
            <button onClick={() => setStep('setup')} className="px-6 py-2 bg-lovelya-500 text-white rounded-xl">Go Back</button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {currentTitles.map((title, idx) => (
                <button key={idx} onClick={() => handleSelectTitle(title)} className="bg-white dark:bg-gray-800 p-3.5 md:p-4 rounded-2xl border border-gray-100 dark:border-gray-700 hover:border-lovelya-400 hover:shadow-lg transition-all text-left h-full flex flex-col justify-between group transform hover:-translate-y-1">
                  <h3 className="font-bold text-[11px] md:text-sm text-gray-800 dark:text-gray-100 group-hover:text-lovelya-600 leading-snug line-clamp-2">{title}</h3>
                  <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-lovelya-50 dark:bg-gray-700 text-lovelya-400 group-hover:bg-lovelya-500 group-hover:text-white transition-all flex items-center justify-center mt-3"><i className="fas fa-play text-[10px]"></i></div>
                </button>
              ))}
              {/* Custom Title Card */}
              <button
                onClick={() => setShowTitleModal(true)}
                className="bg-gray-50 dark:bg-gray-800/50 p-3.5 md:p-4 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-600 hover:border-lovelya-400 hover:bg-lovelya-50 dark:hover:bg-lovelya-900/20 transition flex flex-col items-center justify-center gap-2 md:gap-3 group min-h-[90px] md:min-h-[120px]"
              >
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white dark:bg-gray-700 flex items-center justify-center shadow-sm group-hover:scale-110 transition text-lovelya-500 text-lg">
                  <i className="fas fa-plus"></i>
                </div>
                <span className="font-black uppercase tracking-widest text-[8px] md:text-[10px] text-gray-400 group-hover:text-lovelya-600">Custom Title</span>
              </button>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-8">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  className="w-10 h-10 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-500 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-lovelya-50 dark:hover:bg-lovelya-900/20 transition"
                >
                  <i className="fas fa-chevron-left"></i>
                </button>
                <span className="text-sm font-black text-gray-500">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  className="w-10 h-10 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-500 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-lovelya-50 dark:hover:bg-lovelya-900/20 transition"
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

  const renderPlayer = () => (
    <div className="max-w-3xl mx-auto animate-fade-in space-y-4 md:space-y-6 px-2 md:px-0">
      {audioUrl && <audio ref={audioRef} src={audioUrl} onTimeUpdate={handleTimeUpdate} onLoadedMetadata={handleLoadedMetadata} onEnded={handleAudioEnded} />}
      <button onClick={() => { setIsPlaying(false); setStep('titles'); }} className="text-gray-500 hover:text-gray-800 dark:text-gray-400 flex items-center gap-2 mb-2 md:mb-4 font-bold text-xs md:text-sm"><i className="fas fa-arrow-left"></i> Back to Topics</button>
      <div className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-2xl md:rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700 text-center relative">
        <div className="flex justify-between items-start mb-4 md:mb-6">
          <div className="text-left"><h2 className="text-sm md:text-xl font-bold text-gray-800 dark:text-white leading-tight line-clamp-2">{selectedTitle}</h2><p className="text-[9px] md:text-xs text-gray-500 dark:text-gray-400 mt-0.5 md:mt-1">{type === 'dialogue' ? 'Conversation' : 'Monologue'}</p></div>
          <button onClick={handleRegenerate} className="text-lovelya-600 dark:text-lovelya-400 bg-lovelya-50 dark:bg-lovelya-900/20 hover:bg-lovelya-100 dark:hover:bg-lovelya-900/40 px-2 md:px-3 py-1 md:py-1.5 rounded-lg text-[9px] md:text-xs font-black uppercase tracking-wide flex items-center gap-1 transition shrink-0" title="Generate new audio for this title"><i className="fas fa-sync-alt"></i> Regenerate</button>
        </div>
        <div className="w-14 h-14 md:w-24 md:h-24 bg-gradient-to-br from-lovelya-100 to-white dark:from-gray-700 dark:to-gray-600 rounded-full flex items-center justify-center text-xl md:text-4xl mx-auto mb-5 md:mb-8 shadow-inner text-lovelya-500"><i className="fas fa-headphones-alt"></i></div>
        <div className="mb-6 md:mb-8 px-2 md:px-4"><input type="range" min="0" max={duration || 100} value={currentTime} onChange={handleSeek} className="w-full h-1.5 md:h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-lovelya-500" /><div className="flex justify-between text-[9px] md:text-xs font-bold text-gray-400 mt-1.5 md:mt-2"><span>{formatTime(currentTime)}</span><span>{formatTime(duration)}</span></div></div>
        <div className="flex justify-center items-center gap-4 md:gap-8 mb-6 md:mb-8 relative">
          <div className="relative"><button onClick={() => setShowSpeedMenu(!showSpeedMenu)} className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-bold text-[9px] md:text-xs hover:bg-gray-200 dark:hover:bg-gray-600 transition flex items-center justify-center">{playbackSpeed}x</button>
            {showSpeedMenu && <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 p-1 min-w-[60px] flex flex-col gap-1 z-20">{SPEED_OPTIONS.map(spd => (<button key={spd} onClick={() => handleSpeedChange(spd)} className={`px-2 py-1.5 text-[9px] md:text-xs font-bold rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 ${playbackSpeed === spd ? 'text-lovelya-600 bg-lovelya-50 dark:bg-lovelya-900/20' : 'text-gray-600 dark:text-gray-300'}`}>{spd}x</button>))}</div>}
          </div>
          <button onClick={togglePlayback} className="w-14 h-14 md:w-20 md:h-20 rounded-full bg-lovelya-600 text-white hover:bg-lovelya-700 shadow-xl shadow-lovelya-200/50 dark:shadow-none flex items-center justify-center text-xl md:text-3xl transition transform hover:scale-105 active:scale-95"><i className={`fas ${isPlaying ? 'fa-pause' : 'fa-play pl-1'}`}></i></button>
          <button onClick={() => { if (audioRef.current) audioRef.current.currentTime -= 10; }} className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center transition" title="Rewind 10s"><i className="fas fa-undo-alt text-[9px] md:text-xs"></i></button>
        </div>
        {!quiz.length && !quizLoading && <button onClick={handleGenerateQuiz} disabled={quizLoading} className="px-5 py-2 md:px-8 md:py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-xl font-black text-xs md:text-base shadow-lg hover:shadow-xl transition transform hover:-translate-y-1">Generate Quiz</button>}
        {quizLoading && <div className="py-3 md:py-4 text-purple-600 font-black animate-pulse text-[10px] md:text-sm"><i className="fas fa-magic mr-2"></i> Creating quiz questions...</div>}
        {error && <div className="p-3 md:p-4 bg-red-50 text-red-600 rounded-xl mt-4 border border-red-100 text-[10px] md:text-sm font-bold animate-pulse">{error}</div>}
      </div>
      {quiz.length > 0 && (
        <div className="bg-white dark:bg-gray-800 p-5 md:p-8 rounded-2xl md:rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700 animate-slide-up"><h3 className="text-base md:text-xl font-bold text-gray-800 dark:text-white mb-4 md:mb-6 flex items-center gap-2"><i className="fas fa-clipboard-list text-purple-500"></i> Comprehension Quiz</h3><div className="space-y-5 md:space-y-8">{quiz.map((q, idx) => (
          <div key={idx} className="space-y-2 md:space-y-3"><p className="font-bold text-xs md:text-base text-gray-800 dark:text-gray-200">{idx + 1}. {q.question}</p>{q.options && q.options.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3">{q.options.map((opt, optIdx) => (<button key={optIdx} onClick={() => { const newAnswers = [...userAnswers]; newAnswers[idx] = optIdx; setUserAnswers(newAnswers); }} className={`p-2.5 md:p-3 rounded-xl text-left text-[11px] md:text-sm transition border-2 ${userAnswers[idx] === optIdx ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 font-bold' : 'border-gray-100 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-500 text-gray-600 dark:text-gray-400'}`}>{opt}</button>))}</div>
          ) : <p className="text-red-500 text-[9px] md:text-xs italic">Error loading options for this question.</p>}</div>
        ))}</div><button onClick={handleSubmitQuiz} disabled={userAnswers.includes(-1)} className="w-full mt-6 md:mt-8 py-3.5 md:py-4 bg-lovelya-600 text-white rounded-xl font-black text-sm md:text-lg shadow-lg hover:bg-lovelya-700 transition disabled:opacity-50 disabled:cursor-not-allowed">Submit Answers</button></div>
      )}
    </div>
  );

  const renderResult = () => (
    <div className="max-w-2xl mx-auto text-center animate-bounce-in bg-white dark:bg-gray-800 p-6 md:p-10 rounded-2xl md:rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 mx-2 md:mx-auto">
      <div className={`w-16 h-16 md:w-24 md:h-24 rounded-full flex items-center justify-center text-2xl md:text-4xl mx-auto mb-4 md:mb-6 ${score >= 70 ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
        <i className={`fas ${score >= 70 ? 'fa-trophy' : 'fa-star-half-alt'}`}></i>
      </div>
      <h2 className="text-3xl md:text-4xl font-black text-gray-800 dark:text-white mb-1 md:mb-2">{score}%</h2>
      <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mb-6 md:mb-8 font-medium">Comprehension Score</p>
      <div className="space-y-3 md:space-y-4 text-left bg-gray-50 dark:bg-gray-700/50 p-4 md:p-6 rounded-xl md:rounded-2xl mb-6 md:mb-8 max-h-48 md:max-h-60 overflow-y-auto custom-scrollbar">
        {quiz.map((q, idx) => (
          <div key={idx} className="mb-3 md:mb-4 last:mb-0">
            <div className="font-bold text-xs md:text-sm text-gray-800 dark:text-gray-200 mb-1">Q{idx + 1}: {q.question}</div>
            {q.options && q.options.length > 0 && (
              <div className={`text-[10px] md:text-sm ${userAnswers[idx] === q.correctIndex ? 'text-green-600 font-bold' : 'text-red-500'}`}>
                You answered: {q.options[userAnswers[idx]]}
                {userAnswers[idx] !== q.correctIndex && <span className="block text-green-600 mt-1">Correct: {q.options[q.correctIndex]}</span>}
              </div>
            )}
            <div className="text-[10px] md:text-xs text-gray-500 mt-1 italic">{q.explanation}</div>
          </div>
        ))}
      </div>
      <button onClick={() => { setStep('setup'); setScore(0); setQuiz([]); if (audioUrl) URL.revokeObjectURL(audioUrl); setAudioUrl(null); }} className="w-full md:w-auto px-10 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-xl font-bold hover:bg-gray-300 dark:hover:bg-gray-600 transition text-sm md:text-base">Back to Menu</button>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto">
      {step === 'setup' && renderSetup()}
      {step === 'titles' && renderTitles()}
      {step === 'player' && renderPlayer()}
      {step === 'result' && renderResult()}

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
                placeholder="e.g. Discussing Charity..."
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
                  Start Listening
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListeningModule;