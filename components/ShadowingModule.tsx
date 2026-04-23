
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ModuleProps, ShadowingTask, AppView } from '../types';
import { SHADOWING_DATA, ShadowingTheme } from '../src/constants/shadowingData';
import { logActivity, completeRoadmapUnit } from '../services/storage';

interface FeedbackDetail {
  score: number;
  incorrectWords: string[];
  tips: string;
}

const ShadowingModule: React.FC<ModuleProps> = ({ onComplete, initialContext, onNavigate }) => {
  const [selectedTheme, setSelectedTheme] = useState<ShadowingTheme | null>(null);
  const [selectedTask, setSelectedTask] = useState<ShadowingTask | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [feedbackDetail, setFeedbackDetail] = useState<FeedbackDetail | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [activeCategory, setActiveCategory] = useState<'All' | 'General' | 'Islamic'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [themePage, setThemePage] = useState(0);
  const [taskPage, setTaskPage] = useState(0);
  const [showScenarioModal, setShowScenarioModal] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const THEMES_PER_PAGE = 5;
  const TASKS_PER_PAGE = 10;

  useEffect(() => {
    setThemePage(0);
  }, [activeCategory, searchQuery]);

  useEffect(() => {
    setTaskPage(0);
  }, [selectedTheme]);

  useEffect(() => {
    const loadVoices = () => setVoices(window.speechSynthesis.getVoices());
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    return () => window.speechSynthesis.cancel();
  }, []);

  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      setRecordingTime(0);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isRecording]);

  const toggleRecording = useCallback(() => {
    if (!selectedTask) return;

    if (isRecording) {
      setIsRecording(false);
      // Simulate AI Scoring
      setTimeout(() => {
        const words = selectedTask.text.replace(/[.,!?;]/g, '').split(' ');
        const randomScore = Math.floor(Math.random() * 30) + 70; // 70-100

        // Pick 1-2 random words as "incorrect" if score < 95
        const incorrectWords: string[] = [];
        if (randomScore < 95) {
          const count = Math.floor(Math.random() * 2) + 1;
          for (let i = 0; i < count; i++) {
            const word = words[Math.floor(Math.random() * words.length)];
            if (!incorrectWords.includes(word)) incorrectWords.push(word);
          }
        }

        const tips = randomScore > 90
          ? 'Excellent! Your pronunciation is very close to a native speaker. Keep up the great work!'
          : randomScore > 80
            ? `Great job! Try to focus more on the clarity of "${incorrectWords.join(', ')}". Listen to the original audio again to hear the stress pattern.`
            : `Good effort! You need to work on the rhythm. Specifically, the words "${incorrectWords.join(', ')}" were a bit unclear. Try to speak more slowly and clearly.`;

        setFeedbackDetail({
          score: randomScore,
          incorrectWords,
          tips
        });
      }, 1500);
    } else {
      setIsRecording(true);
      setFeedbackDetail(null);
    }
  }, [isRecording, selectedTask]);

  // Spacebar support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && selectedTask && !feedbackDetail) {
        e.preventDefault();
        toggleRecording();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedTask, feedbackDetail, toggleRecording]);

  const playAudio = () => {
    if (!selectedTask) return;
    window.speechSynthesis.cancel();
    setIsPlaying(true);

    const utterance = new SpeechSynthesisUtterance(selectedTask.text);

    // Improved voice selection for more natural audio
    // We prioritize Neural/Google voices which sound more human
    const availableVoices = window.speechSynthesis.getVoices();
    const preferredVoice =
      availableVoices.find(v => v.name.includes('Neural') && v.lang.startsWith('en-US')) ||
      availableVoices.find(v => v.name.includes('Google US English')) ||
      availableVoices.find(v => v.name.includes('Enhanced') && v.lang.startsWith('en-US')) ||
      availableVoices.find(v => v.lang === 'en-US');

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    // Set natural prosody (pitch and rate)
    utterance.pitch = 1.05; // Slightly higher for friendly, natural tone
    utterance.rate = 0.9;   // Slightly slower for clarity in shadowing

    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    window.speechSynthesis.speak(utterance);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const filteredThemes = SHADOWING_DATA.filter(theme => {
    const matchesCategory = activeCategory === 'All' || theme.category === activeCategory;
    const matchesSearch = theme.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      theme.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const totalThemePages = Math.ceil(filteredThemes.length / THEMES_PER_PAGE);
  const paginatedThemes = filteredThemes.slice(
    themePage * THEMES_PER_PAGE,
    (themePage + 1) * THEMES_PER_PAGE
  );

  const totalTaskPages = selectedTheme ? Math.ceil(selectedTheme.tasks.length / TASKS_PER_PAGE) : 0;
  const paginatedTasks = selectedTheme ? selectedTheme.tasks.slice(
    taskPage * TASKS_PER_PAGE,
    (taskPage + 1) * TASKS_PER_PAGE
  ) : [];

  return (
    <div className="max-w-4xl lg:max-w-6xl mx-auto space-y-4 md:space-y-8 lg:space-y-12 animate-fade-in px-3 md:px-0 mb-20 relative">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-lovelya-100/30 rounded-full blur-[120px] dark:bg-lovelya-900/10"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-amber-100/30 rounded-full blur-[120px] dark:bg-amber-900/10"></div>
      </div>
      {/* Back button */}
      <button onClick={() => onNavigate?.(AppView.HOME)} className="text-gray-400 hover:text-gray-600 font-bold transition flex items-center gap-2 lg:gap-3 uppercase text-[10px] md:text-xs lg:text-sm tracking-widest px-2 md:px-0">
        <i className="fas fa-arrow-left"></i> Back to Home
      </button>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 md:gap-4 lg:gap-6">
        <div>
          <h2 className="text-lg md:text-xl lg:text-3xl font-black text-gray-900 dark:text-white tracking-tight">Shadowing Lab</h2>
          <p className="text-[9px] md:text-xs lg:text-sm text-gray-500 font-medium tracking-wide max-w-xs md:max-w-none">Listen, repeat, and master your English fluency.</p>
        </div>
        <div className="flex gap-2 lg:gap-3">
          <div className="px-3 py-1.5 md:px-6 md:py-3 bg-lovelya-50 dark:bg-lovelya-900/20 text-lovelya-600 dark:text-lovelya-400 rounded-lg md:rounded-2xl font-black text-[8px] md:text-xs uppercase tracking-widest border border-lovelya-100 dark:border-lovelya-800 shadow-sm">
            <i className="fas fa-bolt mr-1 md:mr-2"></i> Fluency Mode
          </div>
        </div>
      </div>

      {!selectedTheme ? (
        <div className="space-y-6">
          {/* Theme Filters & Search */}
          <div className="flex flex-col md:flex-row gap-3 items-center justify-between bg-white dark:bg-gray-800 p-2.5 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
            <div className="flex bg-gray-100 dark:bg-gray-700 p-0.5 rounded-xl w-full md:w-auto">
              {(['All', 'General', 'Islamic'] as const).map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`flex-1 md:flex-none px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition ${activeCategory === cat ? 'bg-white dark:bg-gray-600 text-lovelya-600 dark:text-white shadow-sm' : 'text-gray-400'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="relative w-full md:w-56 text-gray-600">
              <i className="fas fa-search absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
              <input
                type="text"
                placeholder="Search themes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-gray-50 dark:bg-gray-900 border border-transparent focus:border-lovelya-500 rounded-lg outline-none text-xs font-bold transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            {paginatedThemes.map(theme => {
              // Define vibrant color styles based on category or index
              const isIslamic = theme.category === 'Islamic';
              const colorStyles = isIslamic
                ? "from-amber-400 via-orange-500 to-amber-600 shadow-amber-200"
                : "from-blue-500 via-indigo-500 to-indigo-600 shadow-blue-200";

              return (
                <button
                  key={theme.id}
                  onClick={() => setSelectedTheme(theme)}
                  className={`group p-3 md:p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl md:rounded-3xl border border-white/60 dark:border-gray-700/50 shadow-xl shadow-gray-200/50 dark:shadow-none hover:-translate-y-1.5 transition-all text-left relative overflow-hidden flex flex-col h-full`}
                >
                  <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${colorStyles} opacity-0 group-hover:opacity-100 transition-opacity`}></div>

                  <div className="absolute -top-12 -right-12 w-32 h-32 bg-gradient-to-br opacity-[0.03] group-hover:opacity-[0.08] transition-opacity rounded-full blur-2xl from-current" />

                  <div className="flex items-start justify-between mb-3 md:mb-4">
                    <div className={`w-9 h-9 md:w-11 md:h-11 rounded-xl md:rounded-2xl flex items-center justify-center text-lg md:text-xl text-white shadow-xl bg-gradient-to-br ${colorStyles} transform group-hover:rotate-6 transition-transform duration-300`}>
                      <i className={`fas ${theme.icon}`}></i>
                    </div>
                    <span className={`px-2 py-0.5 md:px-3 md:py-1 rounded-full text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] border shadow-sm ${isIslamic
                      ? 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-900/30 dark:border-amber-800/50'
                      : 'bg-indigo-50 text-indigo-700 border-indigo-100 dark:bg-indigo-900/30 dark:border-indigo-800/50'
                      }`}>
                      {theme.category}
                    </span>
                  </div>

                  <div className="flex-grow">
                    <h3 className="text-sm md:text-base font-black text-gray-900 dark:text-white mb-1 group-hover:text-lovelya-600 dark:group-hover:text-amber-400 transition-colors whitespace-normal break-words leading-tight">
                      {theme.title}
                    </h3>
                    <p className="text-[10px] md:text-xs text-gray-500 dark:text-gray-400 font-medium leading-relaxed line-clamp-2">
                      {theme.description}
                    </p>
                  </div>

                  <div className="mt-3 pt-3 md:mt-4 md:pt-4 border-t border-gray-100 dark:border-gray-700/50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-1.5 md:-space-x-2">
                        {[1, 2, 3].map(i => (
                          <div key={i} className={`w-4 h-4 md:w-5 md:h-5 rounded-full border-2 border-white dark:border-gray-800 bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-[6px] md:text-[7px] font-bold ${isIslamic ? 'text-amber-600' : 'text-indigo-600'}`}>
                            <i className="fas fa-check"></i>
                          </div>
                        ))}
                      </div>
                      <span className="text-[8px] md:text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">{theme.tasks.length} Modules</span>
                    </div>
                    <div className={`w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center transition-all ${isIslamic ? 'bg-amber-50 text-amber-600 group-hover:bg-amber-500 group-hover:text-white' : 'bg-indigo-50 text-indigo-600 group-hover:bg-indigo-500 group-hover:text-white'}`}>
                      <i className="fas fa-arrow-right text-[9px] md:text-px"></i>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Theme Pagination Controls */}
          {totalThemePages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-8">
              <button
                onClick={() => setThemePage(prev => Math.max(0, prev - 1))}
                disabled={themePage === 0}
                className="w-12 h-12 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 flex items-center justify-center text-gray-400 hover:text-lovelya-600 disabled:opacity-30 transition-all"
              >
                <i className="fas fa-chevron-left"></i>
              </button>
              <span className="text-xs font-black text-gray-400 uppercase tracking-widest">
                Page {themePage + 1} of {totalThemePages}
              </span>
              <button
                onClick={() => setThemePage(prev => Math.min(totalThemePages - 1, prev + 1))}
                disabled={themePage === totalThemePages - 1}
                className="w-12 h-12 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 flex items-center justify-center text-gray-400 hover:text-lovelya-600 disabled:opacity-30 transition-all"
              >
                <i className="fas fa-chevron-right"></i>
              </button>
            </div>
          )}
        </div>
      ) : !selectedTask ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSelectedTheme(null)}
              className="text-gray-400 hover:text-gray-600 font-bold flex items-center gap-2 transition"
            >
              <i className="fas fa-arrow-left"></i> Back to Themes
            </button>
            <div className="text-right">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Theme</span>
              <h4 className="text-lg font-black text-gray-900 dark:text-white">{selectedTheme.title}</h4>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {paginatedTasks.map(task => (
              <button
                key={task.id}
                onClick={() => setSelectedTask(task)}
                className="group p-4 md:p-5 bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-[1.5rem] md:rounded-[2rem] border border-white/50 dark:border-gray-700/50 shadow-lg shadow-gray-200/30 dark:shadow-none hover:bg-white dark:hover:bg-gray-800 hover:-translate-y-1 transition-all text-left flex items-center gap-3 md:gap-6"
              >
                <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center text-xs md:text-sm shrink-0 shadow-inner ${task.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                  task.difficulty === 'Medium' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'
                  }`}>
                  <i className="fas fa-play"></i>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm md:text-base font-black text-gray-900 dark:text-white leading-tight">
                      {task.title}
                    </h4>
                    <span className={`shrink-0 text-[7px] md:text-[8px] font-black uppercase px-1.5 md:px-2 py-0.5 rounded-md ${task.difficulty === 'Easy' ? 'bg-green-50 text-green-600' :
                      task.difficulty === 'Medium' ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'
                      }`}>
                      {task.difficulty}
                    </span>
                  </div>
                  <p className="text-[10px] md:text-[11px] text-gray-500 font-medium line-clamp-2 italic">"{task.text}"</p>
                </div>
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-50 dark:bg-gray-700 flex items-center justify-center text-gray-400 group-hover:bg-lovelya-600 group-hover:text-white transition-all shadow-sm">
                  <i className="fas fa-chevron-right text-[10px]"></i>
                </div>
              </button>
            ))}
          </div>

          {/* Task Pagination Controls */}
          {totalTaskPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-8">
              <button
                onClick={() => setTaskPage(prev => Math.max(0, prev - 1))}
                disabled={taskPage === 0}
                className="w-12 h-12 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 flex items-center justify-center text-gray-400 hover:text-lovelya-600 disabled:opacity-30 transition-all"
              >
                <i className="fas fa-chevron-left"></i>
              </button>
              <span className="text-xs font-black text-gray-400 uppercase tracking-widest">
                Page {taskPage + 1} of {totalTaskPages}
              </span>
              <button
                onClick={() => setTaskPage(prev => Math.min(totalTaskPages - 1, prev + 1))}
                disabled={taskPage === totalTaskPages - 1}
                className="w-12 h-12 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 flex items-center justify-center text-gray-400 hover:text-lovelya-600 disabled:opacity-30 transition-all"
              >
                <i className="fas fa-chevron-right"></i>
              </button>
            </div>
          )}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`relative rounded-3xl md:rounded-[3rem] shadow-2xl border border-white/50 dark:border-gray-700/50 overflow-hidden ${selectedTheme.category === 'Islamic'
            ? 'bg-gradient-to-br from-amber-50 to-white dark:from-amber-900/10 dark:to-gray-800'
            : 'bg-gradient-to-br from-blue-50 to-white dark:from-blue-900/10 dark:to-gray-800'
            }`}
        >
          {/* Subtle background glow */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-lovelya-400/5 blur-[120px] pointer-events-none rounded-full"></div>
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-lovelya-600/5 blur-[100px] pointer-events-none rounded-full"></div>

          <div className="relative p-4 md:p-8 space-y-4 md:space-y-6">
            {/* Task Info */}
            <div className="flex justify-between items-center bg-white/30 dark:bg-black/20 p-2 md:p-3 rounded-2xl md:rounded-3xl backdrop-blur-sm">
              <button
                onClick={() => { setSelectedTask(null); setFeedbackDetail(null); }}
                className="px-2 py-1 md:px-4 md:py-2 bg-white/50 hover:bg-white dark:bg-gray-700/50 dark:hover:bg-gray-700 rounded-lg md:rounded-full text-gray-400 hover:text-gray-600 font-bold flex items-center gap-1.5 md:gap-2 transition text-[10px] md:text-sm"
              >
                <i className="fas fa-arrow-left"></i> <span className="hidden sm:inline">Back</span>
              </button>
              <div className="text-right flex flex-col items-end flex-1 min-w-0">
                <span className={`text-[7px] md:text-[10px] font-black uppercase tracking-widest leading-none mb-0.5 md:mb-1 truncate w-full ${selectedTheme.category === 'Islamic' ? 'text-amber-600' : 'text-blue-600'}`}>
                  {selectedTheme.title}
                </span>
                <div className="flex items-center justify-end gap-1 w-full">
                  <h4 className="text-[10px] md:text-base font-black text-gray-900 dark:text-white capitalize leading-tight truncate">
                    {selectedTask.title.toLowerCase()}
                  </h4>
                  {selectedTask.scenario && (
                    <button
                      onClick={() => setShowScenarioModal(true)}
                      className={`shrink-0 w-6 h-6 md:w-9 md:h-9 rounded-full flex items-center justify-center transition-all bg-white dark:bg-gray-800 shadow-md ${selectedTheme.category === 'Islamic'
                        ? 'text-amber-500 hover:text-amber-600 hover:bg-amber-50'
                        : 'text-lovelya-600 hover:text-lovelya-700 hover:bg-lovelya-50'
                        }`}
                      title="View Context"
                    >
                      <i className="fas fa-lightbulb text-[9px] md:text-sm"></i>
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-3 md:space-y-8 text-center px-1 md:px-0">
              {/* Context Floating Bubble for Mobile Visibility */}
              {selectedTask.scenario && (
                <div className="md:hidden flex justify-center">
                  <button
                    onClick={() => setShowScenarioModal(true)}
                    className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest flex items-center gap-1.5 animate-bounce-slow shadow-sm ${selectedTheme.category === 'Islamic' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                      }`}
                  >
                    <i className="fas fa-lightbulb"></i> Context
                  </button>
                </div>
              )}
              <div className={`p-5 md:p-10 rounded-3xl md:rounded-[2.5rem] border backdrop-blur-md relative group shadow-xl transition-all ${selectedTheme.category === 'Islamic'
                ? 'bg-white/60 dark:bg-amber-900/5 border-amber-100/50 dark:border-amber-800/20'
                : 'bg-white/60 dark:bg-blue-900/5 border-blue-100/50 dark:border-blue-800/20'
                }`}>
                <button
                  onClick={playAudio}
                  className={`absolute -top-4 md:-top-9 left-1/2 -translate-x-1/2 w-10 h-10 md:w-20 md:h-20 rounded-full shadow-2xl flex items-center justify-center transition-all ${isPlaying
                    ? 'bg-lovelya-600 text-white scale-110 shadow-lovelya-200'
                    : 'bg-white dark:bg-gray-800 text-lovelya-600 hover:scale-110 shadow-xl'
                    }`}
                >
                  <i className={`fas ${isPlaying ? 'fa-volume-up' : 'fa-play'} text-sm md:text-3xl`}></i>
                </button>

                <p className="text-sm md:text-xl lg:text-2xl font-black text-gray-900 dark:text-white leading-relaxed mb-4 md:mb-8 selection:bg-lovelya-200 selection:text-lovelya-900">
                  {selectedTask.text.split(' ').map((word, i) => {
                    const cleanWord = word.replace(/[.,!?;]/g, '');
                    const isIncorrect = feedbackDetail?.incorrectWords.includes(cleanWord);
                    return (
                      <span
                        key={i}
                        className={`transition-colors ${isIncorrect ? 'text-rose-500 underline decoration-rose-300 underline-offset-4 decoration-2 md:underline-offset-8 md:decoration-4' : ''}`}
                      >
                        {word}{' '}
                      </span>
                    );
                  })}
                </p>

                <div className="space-y-2 md:space-y-6 border-t border-gray-100/50 dark:border-gray-700/30 pt-4 md:pt-8 mt-2 md:mt-4">
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-[7px] md:text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Meaning</span>
                    <p className="text-gray-800 dark:text-gray-200 font-bold text-xs md:text-lg lg:text-xl line-clamp-2 md:line-clamp-none">
                      {selectedTask.translation}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col items-center gap-4 md:gap-6">
              {!feedbackDetail ? (
                <div className="flex flex-col items-center gap-2 md:gap-4">
                  <button
                    onClick={toggleRecording}
                    className={`
                      w-16 h-16 md:w-24 md:h-24 rounded-full flex items-center justify-center text-xl md:text-3xl shadow-2xl transition-all duration-300
                      ${isRecording
                        ? 'bg-rose-500 text-white scale-110 md:scale-125 animate-pulse'
                        : 'bg-lovelya-600 text-white hover:scale-110 shadow-lovelya-200'}
                    `}
                  >
                    <i className={`fas ${isRecording ? 'fa-stop' : 'fa-microphone-alt'}`}></i>
                  </button>
                  <p className="text-[9px] md:text-sm font-black text-gray-400 uppercase tracking-widest text-center px-4">
                    {isRecording ? `Recording... ${formatTime(recordingTime)}` : 'Click to Record'}
                  </p>
                </div>
              ) : (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="w-full space-y-8"
                >
                  <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                    <div className="relative w-32 h-32 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="45" fill="none" stroke="#f3f4f6" strokeWidth="8" />
                        <circle cx="50" cy="50" r="45" fill="none" stroke="#10b981" strokeWidth="8" strokeDasharray="283" strokeDashoffset={283 - (283 * feedbackDetail.score) / 100} className="transition-all duration-1000" strokeLinecap="round" />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-3xl font-black text-gray-900 dark:text-white">{feedbackDetail.score}</span>
                        <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Score</span>
                      </div>
                    </div>
                    <div className="flex-1 text-center md:text-left space-y-4">
                      <div>
                        <h5 className="text-xs font-black text-lovelya-600 uppercase tracking-widest mb-1">AI Analysis</h5>
                        <p className="text-gray-800 dark:text-white font-bold leading-relaxed">{feedbackDetail.tips}</p>
                      </div>

                      {feedbackDetail.incorrectWords.length > 0 && (
                        <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest self-center">Needs Work:</span>
                          {feedbackDetail.incorrectWords.map((word, i) => (
                            <span key={i} className="px-3 py-1 bg-rose-50 dark:bg-rose-900/20 text-rose-600 rounded-lg text-[10px] font-black border border-rose-100 dark:border-rose-800">
                              {word}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                    <button
                      onClick={() => setFeedbackDetail(null)}
                      className="flex-1 py-3 md:py-4 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-xl md:rounded-2xl font-black hover:bg-gray-200 transition text-sm md:text-base"
                    >
                      Try Again
                    </button>
                    <button
                      onClick={() => {
                        // Log activity as a speaking session for integration
                        if (feedbackDetail) {
                          logActivity({
                            type: AppView.LIVE, // Integrated with Speaking
                            date: new Date().toISOString(),
                            score: feedbackDetail.score,
                            accuracy: feedbackDetail.score, // Assume score as accuracy for shadowing
                            durationSeconds: recordingTime || 15,
                            metadata: {
                              taskTitle: selectedTask.title,
                              moduleOrigin: 'Shadowing'
                            }
                          });

                          if (initialContext?.stepId && feedbackDetail.score >= 70) {
                            completeRoadmapUnit(initialContext.stepId);
                          }
                        }

                        if (onComplete && feedbackDetail && feedbackDetail.score >= 70) onComplete();
                        setSelectedTask(null);
                        setFeedbackDetail(null);
                      }}
                      className="flex-1 py-3 md:py-4 bg-lovelya-600 text-white rounded-xl md:rounded-2xl font-black shadow-xl shadow-lovelya-200 hover:bg-lovelya-700 transition text-sm md:text-base"
                    >
                      Complete Mission
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      )}
      {/* Modals & Overlays */}
      <AnimatePresence>
        {showScenarioModal && selectedTask && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
            onClick={() => setShowScenarioModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className={`w-full max-w-md p-6 md:p-10 rounded-3xl md:rounded-[3rem] shadow-2xl border relative ${selectedTheme?.category === 'Islamic'
                ? 'bg-amber-50 dark:bg-gray-900 border-amber-100 dark:border-amber-900/30'
                : 'bg-blue-50 dark:bg-gray-900 border-blue-100 dark:border-blue-900/30'
                }`}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowScenarioModal(false)}
                className="absolute top-4 right-4 md:top-6 md:right-6 w-8 h-8 md:w-10 md:h-10 rounded-full bg-white dark:bg-gray-800 shadow-md flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
              >
                <i className="fas fa-times text-xs md:text-base"></i>
              </button>

              <div className="flex flex-col items-center text-center space-y-4 md:space-y-6">
                <div className={`w-12 h-12 md:w-20 md:h-20 rounded-2xl md:rounded-3xl flex items-center justify-center text-lg md:text-3xl shadow-lg ${selectedTheme?.category === 'Islamic' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'
                  }`}>
                  <i className="fas fa-lightbulb"></i>
                </div>

                <div className="space-y-2 md:space-y-4">
                  <h3 className="text-sm md:text-lg font-black text-gray-900 dark:text-white uppercase tracking-wider">Usage Context</h3>
                  <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 font-bold leading-relaxed italic px-2">
                    "{selectedTask.scenario}"
                  </p>
                </div>

                <div className={`p-3 md:p-4 rounded-xl md:rounded-2xl text-[10px] md:text-sm font-black uppercase tracking-widest ${selectedTheme?.category === 'Islamic' ? 'bg-amber-100/50 text-amber-700' : 'bg-blue-100/50 text-blue-700'
                  }`}>
                  TIPS: Use this naturally.
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ShadowingModule;
