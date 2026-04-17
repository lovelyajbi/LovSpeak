
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
    const preferredVoice = voices.find(v => v.name.includes('Google US English')) || voices.find(v => v.lang === 'en-US');
    if (preferredVoice) utterance.voice = preferredVoice;
    
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
    <div className="max-w-4xl mx-auto space-y-4 md:space-y-8 animate-fade-in">
      {/* Back button */}
      <button onClick={() => onNavigate?.(AppView.HOME)} className="text-gray-400 hover:text-gray-600 font-bold transition flex items-center gap-2 uppercase text-[10px] md:text-xs tracking-widest px-2 md:px-0">
        <i className="fas fa-arrow-left"></i> Back to Home
      </button>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <div>
          <h2 className="text-lg md:text-xl font-black text-gray-900 dark:text-white tracking-tight">Shadowing Lab</h2>
          <p className="text-[10px] md:text-xs text-gray-500 font-medium tracking-wide">Listen, repeat, and master your English fluency.</p>
        </div>
        <div className="flex gap-2">
          <div className="px-3 py-1.5 bg-lovelya-50 dark:bg-lovelya-900/20 text-lovelya-600 dark:text-lovelya-400 rounded-lg font-black text-[10px] uppercase tracking-widest border border-lovelya-100 dark:border-lovelya-800">
            <i className="fas fa-bolt mr-1.5"></i> Fluency Mode
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
                 ? "from-emerald-400 to-green-600 shadow-emerald-200" 
                 : "from-blue-500 to-purple-600 shadow-blue-200";

               return (
                <button
                  key={theme.id}
                  onClick={() => setSelectedTheme(theme)}
                  className="group p-3.5 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:border-lovelya-300 hover:shadow-md transition-all text-left relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <i className={`fas ${theme.icon} text-5xl`}></i>
                  </div>
                  <div className="flex items-center gap-3 mb-2.5">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-base text-white shadow-lg bg-gradient-to-br ${colorStyles}`}>
                      <i className={`fas ${theme.icon}`}></i>
                    </div>
                    <div>
                      <span className={`px-2 py-0.5 rounded-md text-[7px] font-black uppercase tracking-widest ${
                        isIslamic ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20' : 'bg-blue-50 text-blue-600 dark:bg-blue-900/20'
                      }`}>
                        {theme.category}
                      </span>
                      <h3 className="text-sm font-black text-gray-800 dark:text-white mt-0.5">{theme.title}</h3>
                    </div>
                  </div>
                  <p className="text-[10px] text-gray-500 font-medium leading-relaxed line-clamp-1">{theme.description}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">{theme.tasks.length} Lessons</span>
                    <div className="text-lovelya-600 font-black text-[9px] uppercase tracking-wider flex items-center gap-1 group-hover:gap-1.5 transition-all">
                      Start <i className="fas fa-play text-[7px]"></i>
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
                className="group p-5 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm hover:border-lovelya-300 hover:shadow-md transition-all text-left flex items-center gap-4"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm shrink-0 ${
                  task.difficulty === 'Easy' ? 'bg-green-50 text-green-600' : 
                  task.difficulty === 'Medium' ? 'bg-orange-50 text-orange-600' : 'bg-rose-50 text-rose-600'
                }`}>
                  <i className="fas fa-play"></i>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-black text-gray-800 dark:text-white truncate">{task.title}</h4>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={`text-[8px] font-black uppercase tracking-widest ${
                      task.difficulty === 'Easy' ? 'text-green-500' : 
                      task.difficulty === 'Medium' ? 'text-orange-500' : 'text-rose-500'
                    }`}>
                      {task.difficulty}
                    </span>
                    <span className="text-[8px] text-gray-300">•</span>
                    <span className="text-[8px] text-gray-400 font-bold uppercase tracking-widest truncate">{task.text}</span>
                  </div>
                </div>
                <i className="fas fa-chevron-right text-gray-200 group-hover:text-lovelya-400 transition-colors"></i>
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
          className="bg-white dark:bg-gray-800 rounded-[3rem] shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden"
        >
          <div className="p-5 md:p-12 space-y-8 md:space-y-10">
            {/* Task Info */}
            <div className="flex justify-between items-center">
              <button 
                onClick={() => { setSelectedTask(null); setFeedbackDetail(null); }}
                className="text-gray-400 hover:text-gray-600 font-bold flex items-center gap-2 transition"
              >
                <i className="fas fa-arrow-left"></i> Back to Lessons
              </button>
              <div className="text-right">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{selectedTheme.title}</span>
                <h4 className="text-sm md:text-base font-black text-gray-900 dark:text-white">{selectedTask.title}</h4>
              </div>
            </div>

            {/* Content Area */}
            <div className="space-y-5 md:space-y-6 text-center">
              <div className="p-6 md:p-8 bg-gray-50 dark:bg-gray-900/50 rounded-2xl md:rounded-[2.5rem] border border-dashed border-gray-200 dark:border-gray-700 relative group">
                <button 
                  onClick={playAudio}
                  className={`absolute -top-5 md:-top-6 left-1/2 -translate-x-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full shadow-lg flex items-center justify-center transition-all ${
                    isPlaying ? 'bg-lovelya-600 text-white scale-110' : 'bg-white dark:bg-gray-800 text-lovelya-600 hover:scale-110'
                  }`}
                >
                  <i className={`fas ${isPlaying ? 'fa-volume-up' : 'fa-play'}`}></i>
                </button>
                <p className="text-base md:text-xl font-black text-gray-800 dark:text-white leading-relaxed mb-3 md:mb-4">
                  {selectedTask.text.split(' ').map((word, i) => {
                    const cleanWord = word.replace(/[.,!?;]/g, '');
                    const isIncorrect = feedbackDetail?.incorrectWords.includes(cleanWord);
                    return (
                      <span 
                        key={i} 
                        className={`transition-colors ${isIncorrect ? 'text-rose-500 underline decoration-rose-300 underline-offset-4' : ''}`}
                      >
                        {word}{' '}
                      </span>
                    );
                  })}
                </p>
                <p className="text-gray-500 italic font-medium text-[10px] md:text-base">
                  {selectedTask.translation}
                </p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col items-center gap-6">
              {!feedbackDetail ? (
                <div className="flex flex-col items-center gap-4">
                  <button
                    onClick={toggleRecording}
                    className={`
                      w-24 h-24 rounded-full flex items-center justify-center text-3xl shadow-2xl transition-all duration-300
                      ${isRecording 
                        ? 'bg-rose-500 text-white scale-125 animate-pulse' 
                        : 'bg-lovelya-600 text-white hover:scale-110 shadow-lovelya-200'}
                    `}
                  >
                    <i className={`fas ${isRecording ? 'fa-stop' : 'fa-microphone-alt'}`}></i>
                  </button>
                  <p className="text-sm font-black text-gray-400 uppercase tracking-widest">
                    {isRecording ? `Recording... ${formatTime(recordingTime)}` : 'Click or Press Space to Record'}
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

                  <div className="flex flex-col sm:flex-row gap-4">
                    <button 
                      onClick={() => setFeedbackDetail(null)}
                      className="flex-1 py-4 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-2xl font-black hover:bg-gray-200 transition"
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
                      className="flex-1 py-4 bg-lovelya-600 text-white rounded-2xl font-black shadow-xl shadow-lovelya-200 hover:bg-lovelya-700 transition"
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
    </div>
  );
};

export default ShadowingModule;
