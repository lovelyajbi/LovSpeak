
import React, { useState, useEffect, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AppView, LearningPlan, Level, DailyTask, UserProfile, AssessmentResult } from './types';
import { LEARNING_TARGETS, LEARNING_INTENSITIES, LEVEL_DEFINITIONS, LEVELS, ISLAMIC_QUOTES } from './constants';
import { getLearningPlan, saveLearningPlan, getUserProfile, saveUserProfile } from './services/storage';
import { generateDailyTasks, generateGoogleCalendarUrl } from './services/planner';
import Layout from './components/Layout';
import { useAuth } from './src/contexts/AuthContext';
import LandingPage from './src/components/LandingPage';
import { ActivationPage, ApiKeySetupPage } from './src/components/Onboarding';

// Lazy load modules for performance
const ReadingModule = lazy(() => import('./components/ReadingModule'));
const GrammarModule = lazy(() => import('./components/GrammarModule'));
const VocabularyModule = lazy(() => import('./components/VocabularyModule'));
const TranslateModule = lazy(() => import('./components/TranslateModule'));
const LivePracticeModule = lazy(() => import('./components/LivePracticeModule'));
const ListeningModule = lazy(() => import('./components/ListeningModule'));
const ProfileModule = lazy(() => import('./components/ProfileModule'));
const AssessmentModule = lazy(() => import('./components/AssessmentModule'));
const ChatModule = lazy(() => import('./components/ChatModule'));
const GameModule = lazy(() => import('./components/GameModule'));
const RoadmapModule = lazy(() => import('./components/RoadmapModule'));
const DiaryModule = lazy(() => import('./components/DiaryModule'));
const ShadowingModule = lazy(() => import('./components/ShadowingModule'));
const SettingsModule = lazy(() => import('./components/SettingsModule'));

import SplashScreen from './components/SplashScreen';
import InstallPrompt from './src/components/InstallPrompt';

const getWIBDateString = () => {
  const now = new Date();
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  const wibTime = new Date(utc + (3600000 * 7));
  return wibTime.toDateString();
};

const App: React.FC = () => {
  const { user, loading, isActive, hasApiKey, isSyncing = false } = useAuth();
  const [view, setView] = useState<AppView>(AppView.HOME);
  const [plan, setPlan] = useState<LearningPlan | null>(null);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [moduleContext, setModuleContext] = useState<any>(null);
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'info' } | null>(null);
  const [showWisdomModal, setShowWisdomModal] = useState(false);
  const [currentQuote, setCurrentQuote] = useState('');

  // Dashboard View State
  const [dashboardView, setDashboardView] = useState<'today' | 'week' | 'month'>('today');
  const [showModules, setShowModules] = useState(true);

  const [step, setStep] = useState(1);
  const [tempTargets, setTempTargets] = useState<string[]>([]);
  const [tempIntensity, setTempIntensity] = useState('');
  const [tempLevel, setTempLevel] = useState<Level>('A1');
  const [tempDays, setTempDays] = useState(3);

  useEffect(() => {
    const handlePopState = () => {
      if (view !== AppView.HOME) {
        setView(AppView.HOME);
      }
    };

    window.addEventListener('popstate', handlePopState);

    // When navigating away from HOME, push a state so the back button has something to pop
    if (view !== AppView.HOME) {
      window.history.pushState({ view }, '');
    } else {
      // If we are at HOME, we might want to clear the history or just leave it
      // Standard behavior: if user is at HOME and presses back, they leave the site.
    }

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [view]);

  useEffect(() => {
    const profile = getUserProfile();
    setUserProfile(profile);

    const storedPlan = getLearningPlan();
    if (storedPlan) {
      const todayWIB = getWIBDateString();
      if (storedPlan.lastGeneratedDate !== todayWIB) {
        const newTasks = generateDailyTasks(storedPlan.targetIds, storedPlan.intensityId, storedPlan.currentLevel);
        const refreshedPlan: LearningPlan = {
          ...storedPlan,
          dailyTasks: newTasks,
          lastGeneratedDate: todayWIB
        };
        saveLearningPlan(refreshedPlan);
        setPlan(refreshedPlan);
      } else {
        setPlan(storedPlan);
      }
    }
  }, [view]);

  useEffect(() => {
    if (user && isActive && hasApiKey) {
      const today = getWIBDateString();
      const storedDate = localStorage.getItem('lovelya_wisdom_date');
      const storedCount = parseInt(localStorage.getItem('lovelya_wisdom_count') || '0');

      if (storedDate !== today) {
        localStorage.setItem('lovelya_wisdom_date', today);
        localStorage.setItem('lovelya_wisdom_count', '1');
        const randomQuote = ISLAMIC_QUOTES[Math.floor(Math.random() * ISLAMIC_QUOTES.length)];
        setCurrentQuote(randomQuote);
        setShowWisdomModal(true);
      } else if (storedCount < 3) {
        localStorage.setItem('lovelya_wisdom_count', (storedCount + 1).toString());
        const randomQuote = ISLAMIC_QUOTES[Math.floor(Math.random() * ISLAMIC_QUOTES.length)];
        setCurrentQuote(randomQuote);
        setShowWisdomModal(true);
      }
    }
  }, [user, isActive, hasApiKey]);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleSavePlan = () => {
    if (tempTargets.length > 0 && tempIntensity && tempLevel) {
      const generatedTasks = generateDailyTasks(tempTargets, tempIntensity, tempLevel);
      const newPlan: LearningPlan = {
        targetIds: tempTargets,
        intensityId: tempIntensity,
        currentLevel: tempLevel,
        daysPerWeek: tempDays,
        dailyTasks: generatedTasks,
        lastGeneratedDate: getWIBDateString()
      };

      saveLearningPlan(newPlan);
      setPlan(newPlan);

      if (userProfile) {
        const updatedProfile = { ...userProfile, level: tempLevel };
        saveUserProfile(updatedProfile);
        setUserProfile(updatedProfile);
      }

      setToast({ message: "Plan Updated Successfully", type: 'success' });
      setShowPlanModal(false);
      setStep(1);
    }
  };

  const handleAddToCalendar = () => {
    const intensity = tempIntensity || plan?.intensityId;
    if (intensity) {
      const url = generateGoogleCalendarUrl(intensity);
      window.open(url, '_blank');
    }
  };

  const openPlanModal = () => {
    if (plan && plan.targetIds) {
      setTempTargets(plan.targetIds);
      setTempIntensity(plan.intensityId);
      setTempLevel(plan.currentLevel);
      setTempLevel(plan.currentLevel);
      setTempDays(plan.daysPerWeek);
    } else {
      setTempTargets([]);
      setTempIntensity(LEARNING_INTENSITIES[1].id);
      setTempLevel('A1');
      setTempDays(3);
    }
    setStep(1);
    setShowPlanModal(true);
  };

  const handleAssessmentResult = (result: AssessmentResult) => {
    if (userProfile) {
      const updatedProfile = { ...userProfile, level: result.detectedLevel };
      saveUserProfile(updatedProfile);
      setUserProfile(updatedProfile);
    }
    setTempLevel(result.detectedLevel);
    const recommendedIds = result.recommendedFocus
      .map(f => f.toLowerCase())
      .filter(f => LEARNING_TARGETS.some(t => t.id === f))
      .slice(0, 3);

    setTempTargets(recommendedIds);
    setTempIntensity(LEARNING_INTENSITIES[1].id);
    setTempDays(4);
    setStep(2);
    setShowPlanModal(true);
    setView(AppView.HOME);
    setToast({ message: "Level Updated! Review your plan.", type: 'success' });
  };

  const toggleTarget = (id: string) => {
    if (tempTargets.includes(id)) {
      setTempTargets(tempTargets.filter(t => t !== id));
    } else {
      if (tempTargets.length < 3) setTempTargets([...tempTargets, id]);
    }
  };

  const handleStartTask = (task: DailyTask) => {
    setActiveTaskId(task.id);
    setModuleContext({ title: task.title, desc: task.description });
    setView(task.moduleView);
  };

  const handleRoadmapNavigation = (targetView: AppView, context: any) => {
    setModuleContext(context);
    setView(targetView);
  };

  const completeActiveTask = () => {
    if (!userProfile) return;
    let isGoalTask = false;
    let currentTasks = (plan && Array.isArray(plan.dailyTasks)) ? [...plan.dailyTasks] : [];
    let taskIndex = -1;
    let xpGained = 0;

    if (activeTaskId && currentTasks.length > 0) {
      taskIndex = currentTasks.findIndex(t => t.id === activeTaskId);
    }
    if ((taskIndex === -1 || (currentTasks.length > 0 && currentTasks[taskIndex].isCompleted)) && currentTasks.length > 0) {
      taskIndex = currentTasks.findIndex(t => t.moduleView === view && !t.isCompleted);
    }

    if (taskIndex !== -1 && currentTasks.length > 0) {
      const task = currentTasks[taskIndex];
      if (!task.isCompleted) {
        currentTasks[taskIndex] = { ...task, isCompleted: true };
        isGoalTask = true;
        xpGained = 15;
      }
    }

    if (xpGained > 0) {
      const updatedProfile = {
        ...userProfile,
        xp: (userProfile.xp || 0) + xpGained
      };
      saveUserProfile(updatedProfile);
      setUserProfile(updatedProfile);
    } else {
      saveUserProfile(userProfile);
    }

    if (isGoalTask && plan) {
      const updatedPlan = { ...plan, dailyTasks: currentTasks };
      saveLearningPlan(updatedPlan);
      setPlan(updatedPlan);
    } else if (view === AppView.ASSESSMENT) {
      const newStoredPlan = getLearningPlan();
      if (newStoredPlan) setPlan(newStoredPlan);
      setView(AppView.HOME);
    }

    setToast({
      message: xpGained > 0 ? `Task Completed! +${xpGained} XP` : 'Task Updated!',
      type: 'success'
    });
    setActiveTaskId(null);
    setModuleContext(null); // Clear context when done
  };

  const getProjectedSchedule = (days: number) => {
    if (!plan) return [];
    const schedule = [];
    const today = new Date();

    for (let i = 1; i <= days; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const tasks = generateDailyTasks(plan.targetIds, plan.intensityId, plan.currentLevel);
      schedule.push({ date, tasks });
    }
    return schedule;
  };

  const renderContent = () => {
    const commonProps = {
      onComplete: completeActiveTask,
      onNavigate: setView,
      initialContext: moduleContext
    };

    return (
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 w-full transition-all duration-300">
        {(() => {
          switch (view) {
            case AppView.READING: return <ReadingModule {...commonProps} />;
            case AppView.LISTENING: return <ListeningModule {...commonProps} />;
            case AppView.GRAMMAR: return <GrammarModule {...commonProps} />;
            case AppView.VOCAB: return <VocabularyModule {...commonProps} />;
            case AppView.TRANSLATE: return <TranslateModule {...commonProps} />;
            case AppView.LIVE: return <LivePracticeModule {...commonProps} initialContext={moduleContext} />;
            case AppView.ASSESSMENT: return <AssessmentModule {...commonProps} onAssessmentResult={handleAssessmentResult} />;
            case AppView.CHAT: return <ChatModule {...commonProps} />;
            case AppView.GAMES: return <GameModule {...commonProps} />;
            case AppView.PROFILE: return <ProfileModule />;
            case AppView.ROADMAP: return <RoadmapModule onNavigateToModule={handleRoadmapNavigation} />;
            case AppView.DIARY: return <DiaryModule {...commonProps} />;
            case AppView.SHADOWING: return <ShadowingModule {...commonProps} />;
            case AppView.SETTINGS: return <SettingsModule />;
            case AppView.HOME:
            default:
              const activeTargetData = plan ? LEARNING_TARGETS.filter(t => plan.targetIds.includes(t.id)) : [];
              const currentLevel = userProfile?.level || 'A1';
              const tasks = plan?.dailyTasks || [];
              const completedTasks = tasks.filter(t => t.isCompleted).length;
              const progressPercent = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

              return (
                <div className="space-y-6 md:space-y-10 lg:space-y-14 animate-fade-in pb-10">
                  {/* 1. Hero / Greeting Widget - Optimized for all screens */}
                  <div className="relative overflow-hidden rounded-3xl md:rounded-[2.5rem] bg-gradient-to-br from-lovelya-600 to-lovelya-500 shadow-xl p-5 md:p-6 lg:p-10 text-white">
                    <div className="absolute top-0 right-0 -mt-6 -mr-6 w-24 h-24 md:w-48 md:h-48 lg:w-72 lg:h-72 bg-white opacity-10 rounded-full blur-2xl md:blur-3xl lg:blur-[80px]"></div>
                    <div className="absolute bottom-0 left-0 -mb-6 -ml-6 w-20 h-20 md:w-32 md:h-32 lg:w-48 lg:h-48 bg-purple-500 opacity-20 rounded-full blur-2xl md:blur-3xl lg:blur-[60px]"></div>

                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-8">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-2 md:mb-4">
                          <span className="bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-full text-[7px] md:text-[10px] lg:text-xs font-black uppercase tracking-wider">
                            {currentLevel} Level
                          </span>
                          <span className="bg-yellow-400/20 backdrop-blur-md px-2 py-0.5 rounded-full text-[7px] md:text-[10px] lg:text-xs font-black uppercase tracking-wider text-yellow-200">
                            {userProfile?.xp || 0} XP
                          </span>
                        </div>
                        <h1 className="text-xl md:text-2xl lg:text-4xl font-black tracking-tight mb-1 md:mb-2 leading-tight">
                          Welcome back, <span className="text-white">
                            {userProfile?.name ? userProfile.name.split(' ')[0] : 'Lovelies'}
                          </span>
                        </h1>
                        <p className="text-lovelya-100 text-[8px] md:text-xs lg:text-base font-medium max-w-2xl opacity-90 leading-relaxed md:leading-snug">
                          Ready to continue? {tasks.length - completedTasks} tasks left today. Keep up the great work!
                        </p>
                      </div>
                      <div className="flex flex-row md:flex-row gap-2 w-full md:w-auto self-stretch md:self-center">
                        <button
                          onClick={() => {
                            const randomQuote = ISLAMIC_QUOTES[Math.floor(Math.random() * ISLAMIC_QUOTES.length)];
                            setCurrentQuote(randomQuote);
                            setShowWisdomModal(true);
                          }}
                          className="flex-1 md:flex-none bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white px-3 py-2 lg:px-6 lg:py-3 rounded-xl lg:rounded-2xl font-bold transition active:scale-95 flex items-center justify-center gap-2 text-[8px] md:text-xs lg:text-sm shadow-sm"
                        >
                          <i className="fas fa-quote-left text-[7px] md:text-xs"></i> <span>Wisdom</span>
                        </button>
                        <button onClick={() => setView(AppView.ASSESSMENT)} className="flex-1 md:flex-none bg-white text-lovelya-600 px-3.5 py-2 lg:px-7 lg:py-3 rounded-xl lg:rounded-2xl font-bold shadow-lg hover:shadow-xl hover:bg-lovelya-50 transition active:scale-95 flex items-center justify-center gap-2 text-[8px] md:text-xs lg:text-sm">
                          <i className="fas fa-graduation-cap text-[7px] md:text-xs"></i> <span>Test</span>
                        </button>
                        <button onClick={openPlanModal} className="flex-1 md:flex-none bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white px-3 py-2 lg:px-6 lg:py-3 rounded-xl lg:rounded-2xl font-bold transition active:scale-95 flex items-center justify-center gap-2 text-[8px] md:text-xs lg:text-sm shadow-sm">
                          <i className="fas fa-sliders-h text-[7px] md:text-xs"></i> <span>Plan</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* 2. Categories Grid - Redesigned for Large Screens */}
                  <div className="pt-2 md:pt-4">
                    <div className="flex items-center justify-between mb-3 md:mb-6">
                      <div className="flex items-center gap-2 md:gap-3">
                        <div className="w-1.5 h-6 bg-lovelya-600 rounded-full"></div>
                        <h3 className="text-sm md:text-2xl lg:text-3xl font-black text-gray-800 dark:text-white tracking-tight">Learning Hub</h3>
                      </div>
                      <button
                        onClick={() => setShowModules(!showModules)}
                        className="flex items-center gap-2 px-3 py-1.5 lg:px-5 lg:py-2 bg-lovelya-50 dark:bg-lovelya-900/30 text-lovelya-600 dark:text-lovelya-400 rounded-full font-bold text-[8px] md:text-xs lg:text-sm hover:bg-lovelya-100 dark:hover:bg-lovelya-900/50 transition-all active:scale-95 shadow-sm"
                      >
                        <i className={`fas ${showModules ? 'fa-eye-slash' : 'fa-eye'} text-[7px] md:text-xs`}></i>
                        {showModules ? 'Hide Modules' : 'Show Modules'}
                      </button>
                    </div>

                    <AnimatePresence>
                      {showModules && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: 'easeInOut' }}
                          className="overflow-hidden"
                        >
                          <div className="grid grid-cols-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-9 gap-3 md:gap-5 lg:gap-6 pb-2">
                            {[
                              { id: AppView.READING, icon: 'fa-book-open', label: 'Reading', color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
                              { id: AppView.LISTENING, icon: 'fa-headphones', label: 'Listening', color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/20' },
                              { id: AppView.GRAMMAR, icon: 'fa-spell-check', label: 'Grammar', color: 'text-lovelya-500', bg: 'bg-lovelya-50 dark:bg-lovelya-900/20' },
                              { id: AppView.VOCAB, icon: 'fa-shapes', label: 'Vocab', color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-900/20' },
                              { id: AppView.LIVE, icon: 'fa-microphone-alt', label: 'Speaking', color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-900/20' },
                              { id: AppView.SHADOWING, icon: 'fa-wave-square', label: 'Shadow', color: 'text-lovelya-600', bg: 'bg-lovelya-50 dark:bg-lovelya-900/20' },
                              { id: AppView.DIARY, icon: 'fa-book-bookmark', label: 'Diary', color: 'text-indigo-500', bg: 'bg-indigo-50 dark:bg-indigo-900/20' },
                              { id: AppView.CHAT, icon: 'fa-robot', label: 'Tutor', color: 'text-cyan-500', bg: 'bg-cyan-50 dark:bg-cyan-900/20' },
                              { id: AppView.TRANSLATE, icon: 'fa-language', label: 'Translate', color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
                            ].map(item => (
                              <button
                                key={item.id}
                                onClick={() => setView(item.id as AppView)}
                                className="flex flex-col items-center justify-center p-3 lg:p-5 bg-white dark:bg-gray-800 rounded-2xl lg:rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-700 hover:border-lovelya-300 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group aspect-square lg:aspect-auto lg:h-32"
                              >
                                <div className={`w-8 h-8 md:w-12 md:h-12 lg:w-14 lg:h-14 rounded-xl lg:rounded-2xl ${item.bg} flex items-center justify-center text-sm md:text-xl lg:text-2xl ${item.color} mb-2 lg:mb-2 group-hover:scale-110 transition-transform shadow-sm`}>
                                  <i className={`fas ${item.icon}`}></i>
                                </div>
                                <span className="font-bold text-gray-600 dark:text-gray-300 text-[7px] md:text-[10px] lg:text-xs text-center leading-tight">{item.label}</span>
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* 4. Detailed Schedule & Stats - Responsive for all screens */}
                  <div className="block">
                    {!plan ? (
                      <div className="text-center py-10 md:py-24 lg:py-32 bg-white dark:bg-gray-800 rounded-3xl md:rounded-[3rem] border border-gray-100 dark:border-gray-700 shadow-sm px-6">
                        <div className="w-20 h-20 md:w-32 md:h-32 lg:w-40 lg:h-40 bg-lovelya-50 dark:bg-gray-700 rounded-full flex items-center justify-center text-3xl md:text-5xl lg:text-6xl text-lovelya-500 mx-auto mb-8 shadow-inner">
                          <i className="fas fa-rocket"></i>
                        </div>
                        <h3 className="text-xl md:text-3xl lg:text-4xl font-black text-gray-800 dark:text-white mb-3">No Active Plan</h3>
                        <p className="text-[10px] md:text-base lg:text-lg text-gray-500 max-w-lg mx-auto mb-10 leading-relaxed">Setup your personalized learning path to get daily tasks tailored to your needs and track your progress.</p>
                        <button onClick={openPlanModal} className="bg-lovelya-600 text-white px-8 py-3 md:px-10 md:py-4 rounded-2xl lg:rounded-2xl font-black text-sm md:text-lg lg:text-xl shadow-xl hover:bg-lovelya-700 hover:shadow-2xl transition-all active:scale-95">
                          Start Training Now
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-8 md:space-y-12">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                          <div className="flex items-center gap-3">
                            <div className="w-1.5 h-7 bg-lovelya-600 rounded-full"></div>
                            <h3 className="text-sm md:text-2xl lg:text-3xl font-black text-gray-800 dark:text-white tracking-tight">Daily Missions</h3>
                          </div>
                          <div className="flex flex-col items-center sm:items-end gap-2">
                            <div className="bg-gray-100 dark:bg-gray-700 p-1 rounded-2xl flex shrink-0 w-full sm:w-auto shadow-inner">
                              <button onClick={() => setDashboardView('today')} className={`flex-1 sm:flex-none px-4 py-2 lg:px-6 lg:py-2.5 text-[9px] md:text-xs lg:text-sm font-black uppercase tracking-wider rounded-xl transition-all ${dashboardView === 'today' ? 'bg-white dark:bg-gray-600 text-lovelya-600 dark:text-white shadow-md' : 'text-gray-500 hover:text-gray-700'}`}>Today</button>
                              <button onClick={() => setDashboardView('week')} className={`flex-1 sm:flex-none px-4 py-2 lg:px-6 lg:py-2.5 text-[9px] md:text-xs lg:text-sm font-black uppercase tracking-wider rounded-xl transition-all ${dashboardView === 'week' ? 'bg-white dark:bg-gray-600 text-lovelya-600 dark:text-white shadow-md' : 'text-gray-500 hover:text-gray-700'}`}>Next 7 Days</button>
                              <button onClick={() => setDashboardView('month')} className={`flex-1 sm:flex-none px-4 py-2 lg:px-6 lg:py-2.5 text-[9px] md:text-xs lg:text-sm font-black uppercase tracking-wider rounded-xl transition-all ${dashboardView === 'month' ? 'bg-white dark:bg-gray-600 text-lovelya-600 dark:text-white shadow-md' : 'text-gray-500 hover:text-gray-700'}`}>Calendar View</button>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
                          {/* Left: Progress & Focus Areas - Wider on Desktop */}
                          <div className="lg:col-span-4 space-y-8">
                            <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] lg:rounded-[3rem] p-6 lg:p-10 shadow-sm border border-gray-100 dark:border-gray-700 relative overflow-hidden group">
                              <div className="absolute top-0 right-0 w-32 h-32 lg:w-48 lg:h-48 bg-lovelya-50 dark:bg-lovelya-900/10 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-110"></div>
                              <h3 className="font-black text-gray-800 dark:text-white mb-6 lg:mb-10 flex items-center gap-3 relative z-10 text-xs md:text-lg lg:text-xl">
                                <i className="fas fa-bullseye text-lovelya-500"></i> Daily Goal
                              </h3>
                              <div className="relative w-32 h-32 md:w-48 md:h-48 lg:w-56 lg:h-56 mx-auto mb-6 lg:mb-10 flex items-center justify-center z-10 transition-transform group-hover:scale-105 duration-500">
                                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                                  <circle cx="50" cy="50" r="45" fill="none" stroke="#e5e7eb" strokeWidth="8" />
                                  <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" strokeDasharray="283" strokeDashoffset={283 - (283 * progressPercent) / 100} className="text-lovelya-500 transition-all duration-1000 ease-out" strokeLinecap="round" />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-800 dark:text-white">
                                  <span className="text-2xl md:text-4xl lg:text-5xl font-black">{progressPercent}%</span>
                                </div>
                              </div>
                              <div className="text-center relative z-10 bg-gray-50 dark:bg-gray-700/50 py-3 rounded-2xl">
                                <p className="text-gray-600 dark:text-gray-300 text-[9px] md:text-sm lg:text-base font-black uppercase tracking-widest">{completedTasks} of {tasks.length} missions done</p>
                              </div>
                            </div>

                            <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] lg:rounded-[3rem] p-6 lg:p-10 shadow-sm border border-gray-100 dark:border-gray-700">
                              <h3 className="font-black text-gray-800 dark:text-white mb-6 lg:mb-8 flex items-center gap-3 text-xs md:text-lg lg:text-xl">
                                <i className="fas fa-star text-purple-500"></i> Skill Focus
                              </h3>
                              <div className="grid grid-cols-2 lg:grid-cols-1 gap-3 lg:gap-5">
                                {activeTargetData.map(t => (
                                  <div key={t.id} className="flex items-center gap-3 lg:gap-5 p-3 lg:p-5 rounded-2xl lg:rounded-3xl bg-gray-50 dark:bg-gray-700/50 border border-transparent hover:border-lovelya-200 hover:bg-white dark:hover:bg-gray-700 transition-all duration-300">
                                    <div className={`w-9 h-9 md:w-14 md:h-14 rounded-xl lg:rounded-2xl flex items-center justify-center text-lg md:text-2xl lg:text-3xl ${t.color} bg-white dark:bg-gray-800 shadow-sm shrink-0`}>
                                      <i className={`fas ${t.icon}`}></i>
                                    </div>
                                    <div className="min-w-0">
                                      <div className="font-black text-[10px] md:text-base lg:text-lg text-gray-800 dark:text-white truncate">{t.name}</div>
                                      <div className="text-[8px] md:text-xs lg:text-sm text-gray-500 dark:text-gray-400 truncate leading-tight mt-1">{t.description}</div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Right: Task List / Schedule Views - Main Content Area */}
                          <div className="lg:col-span-8">
                            {dashboardView === 'today' && (
                              <div className="grid gap-5 lg:gap-6 animate-slide-up">
                                <div className="text-[10px] lg:text-sm font-black text-gray-400 uppercase tracking-[0.3em] mb-3 px-2 flex items-center justify-between">
                                  <span>Today's Strategy</span>
                                  <span className="text-lovelya-600 dark:text-lovelya-400">{getWIBDateString()}</span>
                                </div>
                                {tasks.map((task) => (
                                  <div
                                    key={task.id}
                                    className={`group relative overflow-hidden rounded-[2.5rem] lg:rounded-[3rem] border transition-all duration-500 hover:shadow-xl hover:-translate-y-1
                                                        ${task.isCompleted
                                        ? 'bg-gray-50 dark:bg-gray-800/50 border-gray-100 dark:border-gray-800 opacity-60'
                                        : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 hover:border-lovelya-300 shadow-sm'}
                                                    `}
                                  >
                                    <div className="p-4 md:p-8 flex items-center gap-4 md:gap-8">
                                      <div className={`w-12 h-12 md:w-20 md:h-20 rounded-2xl lg:rounded-3xl flex items-center justify-center text-xl md:text-4xl shrink-0 transition-all duration-500 shadow-sm
                                                            ${task.isCompleted ? 'bg-green-100 text-green-600' : 'bg-lovelya-50 text-lovelya-600 group-hover:bg-lovelya-500 group-hover:text-white'}
                                                        `}>
                                        {task.isCompleted ? <i className="fas fa-check"></i> : <i className={`fas ${task.icon}`}></i>}
                                      </div>

                                      <div className="flex-1 min-w-0">
                                        <div className="flex flex-wrap items-center gap-2 mb-1.5">
                                          <h4 className={`font-black text-sm md:text-xl lg:text-2xl leading-tight truncate ${task.isCompleted ? 'text-gray-500 line-through' : 'text-gray-800 dark:text-white'}`}>
                                            {task.title}
                                          </h4>
                                          {!task.isCompleted && <span className="bg-yellow-400 text-[8px] md:text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full text-black">New</span>}
                                        </div>
                                        <p className="text-[10px] md:text-sm lg:text-base text-gray-500 dark:text-gray-400 leading-relaxed max-w-2xl">{task.description}</p>
                                      </div>

                                      {!task.isCompleted && (
                                        <button
                                          onClick={() => handleStartTask(task)}
                                          className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-5 py-2.5 md:px-8 md:py-4 lg:px-8 lg:py-4 rounded-xl lg:rounded-2xl font-black text-[10px] md:text-sm lg:text-base hover:bg-lovelya-600 dark:hover:bg-lovelya-400 hover:text-white transition-all shadow-md hover:shadow-xl shrink-0 active:scale-95 whitespace-nowrap"
                                        >
                                          Start <span className="hidden sm:inline">Mission</span>
                                        </button>
                                      )}
                                    </div>
                                    {!task.isCompleted && <div className="absolute bottom-0 left-0 w-0 h-1.5 bg-lovelya-500 transition-all duration-1000 group-hover:w-full"></div>}
                                  </div>
                                ))}
                              </div>
                            )}

                            {dashboardView === 'week' && (
                              <div className="grid grid-cols-1 md:grid-cols-1 gap-6 lg:gap-8 animate-slide-up">
                                {getProjectedSchedule(7).map((day, idx) => (
                                  <div key={idx} className="bg-white dark:bg-gray-800 rounded-[2.5rem] lg:rounded-[3.5rem] border border-gray-100 dark:border-gray-700 p-6 lg:p-10 shadow-sm transition-all hover:shadow-xl group">
                                    <div className="flex items-center justify-between mb-6 lg:mb-10 pb-4 border-b border-gray-100 dark:border-gray-700">
                                      <div className="flex items-center gap-4">
                                        <div className="bg-lovelya-600 text-white font-black px-4 py-2 lg:px-6 lg:py-3 rounded-2xl text-xs md:text-base lg:text-lg uppercase tracking-wider shadow-lg">
                                          {day.date.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
                                        </div>
                                        <span className="text-[10px] lg:text-sm text-gray-400 font-black uppercase tracking-widest">{day.tasks.length} Critical Missions</span>
                                      </div>
                                      <i className="fas fa-calendar-check text-lovelya-200 text-3xl group-hover:text-lovelya-400 transition-colors"></i>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                                      {day.tasks.map((t, tIdx) => (
                                        <div key={tIdx} className="flex items-center gap-4 p-3 lg:p-5 rounded-2xl bg-gray-50 dark:bg-gray-700/50 hover:bg-white dark:hover:bg-gray-700 border border-transparent hover:border-lovelya-100 transition-all shadow-sm">
                                          <div className="w-10 h-10 lg:w-14 lg:h-14 rounded-xl lg:rounded-2xl bg-white dark:bg-gray-800 flex items-center justify-center text-sm md:text-xl text-lovelya-600 shadow-sm group-hover:scale-110 transition-transform">
                                            <i className={`fas ${t.icon}`}></i>
                                          </div>
                                          <div className="min-w-0">
                                            <span className="text-xs lg:text-base font-black text-gray-800 dark:text-white truncate block">{t.title}</span>
                                            <span className="text-[9px] lg:text-[11px] text-gray-500 uppercase font-bold tracking-tighter">Mission Ready</span>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}

                            {dashboardView === 'month' && (
                              <div className="bg-white dark:bg-gray-800 rounded-[3rem] p-8 lg:p-14 border border-gray-100 dark:border-gray-700 shadow-xl animate-slide-up overflow-x-auto">
                                <div className="min-w-[400px]">
                                  <div className="grid grid-cols-7 gap-3 lg:gap-6 mb-8 text-center bg-gray-50 dark:bg-gray-700/50 py-4 rounded-[2rem]">
                                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                                      <div key={d} className="text-[11px] lg:text-base font-black text-gray-500 uppercase tracking-widest">{d}</div>
                                    ))}
                                  </div>
                                  <div className="grid grid-cols-7 gap-3 lg:gap-6">
                                    {getProjectedSchedule(30).map((day, idx) => {
                                      const mainMod = day.tasks[0]?.moduleView;
                                      let dotColor = 'bg-gray-300';
                                      if (mainMod === AppView.READING) dotColor = 'bg-blue-400';
                                      if (mainMod === AppView.LIVE) dotColor = 'bg-red-400';
                                      if (mainMod === AppView.GRAMMAR) dotColor = 'bg-purple-400';

                                      return (
                                        <div key={idx} className="aspect-square bg-gray-50 dark:bg-gray-700/50 rounded-2xl lg:rounded-3xl flex flex-col items-center justify-center relative hover:bg-lovelya-600 transition-all duration-300 group cursor-default border border-transparent hover:border-lovelya-300 hover:scale-105 hover:shadow-xl hover:z-10 group/day">
                                          <span className="text-sm md:text-xl lg:text-2xl font-black text-gray-800 dark:text-gray-300 group-hover:text-white transition-colors">{day.date.getDate()}</span>
                                          <div className="flex gap-1 mt-2">
                                            {day.tasks.slice(0, 3).map((_, i) => (
                                              <div key={i} className={`w-1.5 h-1.5 lg:w-2 lg:h-2 rounded-full ${dotColor} group-hover:bg-white`}></div>
                                            ))}
                                          </div>
                                          <div className="absolute bottom-full mb-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-[11px] lg:text-sm font-bold p-3 lg:p-5 rounded-2xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 z-50 w-40 lg:w-56 text-center shadow-2xl scale-50 group-hover:scale-100">
                                            <div className="mb-2 pb-2 border-b border-gray-100/20">{day.tasks.length} Missions Scheduled</div>
                                            {day.tasks.slice(0, 3).map((t, i) => (
                                              <div key={i} className="text-[10px] lg:text-xs opacity-80 mb-1 flex items-center gap-2">
                                                <i className={`fas ${t.icon} w-3`}></i> {t.title}
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      )
                                    })}
                                  </div>
                                  <div className="mt-12 flex flex-wrap justify-center gap-6 lg:gap-10 text-[10px] lg:text-sm font-black text-gray-400 uppercase tracking-[0.2em] bg-gray-50 dark:bg-gray-700/50 py-5 rounded-[2rem]">
                                    <div className="flex items-center gap-3"><div className="w-3 h-3 rounded-full bg-blue-400 shadow-sm shadow-blue-400/50"></div> Reading</div>
                                    <div className="flex items-center gap-3"><div className="w-3 h-3 rounded-full bg-red-400 shadow-sm shadow-red-400/50"></div> Speaking</div>
                                    <div className="flex items-center gap-3"><div className="w-3 h-3 rounded-full bg-purple-400 shadow-sm shadow-purple-400/50"></div> Grammar</div>
                                    <div className="flex items-center gap-3"><div className="w-3 h-3 rounded-full bg-gray-300"></div> Electives</div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
          }
        })()}
      </div>
    );
  };
  if (loading) {
    return (
      <SplashScreen message="Initializing LovSpeak..." />
    );
  }

  if (!user) {
    return <LandingPage />;
  }

  // If user exists but sync is still happening, we might want to show a subtle loader 
  // but keep them on the landing page or a transition screen.
  // Actually, keeping them on LP is cleaner until we know their status.

  if (isSyncing && !isActive) {
    return (
      <SplashScreen message="Syncing your progress..." />
    );
  }

  if (!isActive) {
    return <ActivationPage />;
  }

  if (!hasApiKey) {
    return <ApiKeySetupPage />;
  }

  return (
    <Layout currentView={view} onNavigate={setView} userProfile={userProfile}>
      <Suspense fallback={
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-lovelya-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      }>
        {renderContent()}
      </Suspense>
      <InstallPrompt />

      {toast && (
        <div className={`fixed bottom-8 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-full shadow-2xl z-50 animate-bounce-in flex items-center gap-3 text-white font-bold text-sm backdrop-blur-md
            ${toast.type === 'success' ? 'bg-green-600/90' : 'bg-blue-600/90'}
        `}>
          {toast.type === 'success' && <i className="fas fa-check-circle text-lg"></i>}
          <span>{toast.message}</span>
        </div>
      )}

      {showWisdomModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-xl p-4 animate-fade-in">
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-900 w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden relative p-10 md:p-14 text-center border border-gray-200 dark:border-gray-800"
          >
            {/* Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-lovelya-200 via-lovelya-500 to-lovelya-200"></div>
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-lovelya-100/20 dark:bg-lovelya-900/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-gray-100/50 dark:bg-gray-800/20 rounded-full blur-3xl"></div>

            <div className="relative z-10 space-y-10">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-[2.5rem] bg-gray-900 dark:bg-lovelya-500/10 text-lovelya-500 shadow-2xl shadow-lovelya-500/20 mx-auto transform -rotate-6 hover:rotate-0 transition-transform duration-500">
                <i className="fas fa-quote-left text-3xl"></i>
              </div>

              <div className="space-y-3">
                <h3 className="text-[10px] font-black text-lovelya-600 dark:text-lovelya-400 uppercase tracking-[0.4em]">Daily Wisdom</h3>
                <div className="flex items-center justify-center gap-2">
                  <div className="h-[1px] w-8 bg-gray-200 dark:bg-gray-700"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-lovelya-500"></div>
                  <div className="h-[1px] w-8 bg-gray-200 dark:bg-gray-700"></div>
                </div>
              </div>

              <div className="relative px-4">
                <p className="text-2xl md:text-3xl font-serif text-gray-900 dark:text-white leading-tight tracking-tight">
                  {currentQuote.split(' (')[0]}
                </p>
              </div>

              {currentQuote.includes('(') && (
                <div className="flex items-center justify-center gap-3">
                  <div className="w-6 h-px bg-gray-100 dark:bg-gray-800"></div>
                  <p className="text-xs font-bold text-gray-400 dark:text-gray-500 italic tracking-wide">
                    {currentQuote.split(' (')[1].replace(')', '')}
                  </p>
                  <div className="w-6 h-px bg-gray-100 dark:bg-gray-800"></div>
                </div>
              )}

              <div className="pt-6">
                <button
                  onClick={() => setShowWisdomModal(false)}
                  className="group relative w-full py-5 bg-gray-900 dark:bg-lovelya-500 text-white dark:text-gray-950 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl transition-all duration-300 hover:scale-[1.02] active:scale-95 overflow-hidden"
                >
                  <span className="relative z-10">Enter LovSpeak</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-lovelya-400 to-lovelya-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
                <p className="mt-6 text-[9px] text-gray-400 font-bold uppercase tracking-[0.2em] opacity-60">
                  Excellence is a habit, not an act
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {showPlanModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white dark:bg-gray-800 w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden animate-slide-up max-h-[90vh] overflow-y-auto">
            <div className="bg-gray-50 dark:bg-gray-700 px-8 py-4 border-b border-gray-200 dark:border-gray-600 flex justify-between items-center">
              <div className="flex gap-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className={`h-1.5 w-8 rounded-full ${step >= i ? 'bg-lovelya-500' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                ))}
              </div>
              <button onClick={() => setShowPlanModal(false)} className="text-gray-400 hover:text-gray-600"><i className="fas fa-times"></i></button>
            </div>

            <div className="p-8">
              {step === 1 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-center">Select Proficiency Level</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {LEVEL_DEFINITIONS.map(lvl => (
                      <button
                        key={lvl.id}
                        onClick={() => setTempLevel(lvl.id as Level)}
                        className={`text-left p-5 rounded-2xl border-2 transition group hover:shadow-md ${tempLevel === lvl.id ? 'border-lovelya-500 bg-lovelya-50 dark:bg-lovelya-900/20' : 'border-gray-200 dark:border-gray-600'} ${step > 1 ? 'pointer-events-none opacity-50' : ''}`}
                      >
                        <div className="flex justify-between items-center">
                          <span className={`text-xl font-black ${tempLevel === lvl.id ? 'text-lovelya-600' : 'text-gray-400'}`}>{lvl.id}</span>
                          {tempLevel === lvl.id && <i className="fas fa-check-circle text-lovelya-500"></i>}
                        </div>
                        <div className="font-bold mt-1">{lvl.title}</div>
                        <div className="text-sm text-gray-500">{lvl.desc}</div>
                      </button>
                    ))}
                  </div>
                  <button onClick={() => setStep(2)} className="w-full py-4 bg-lovelya-600 text-white rounded-xl font-bold hover:bg-lovelya-700 transition">Next</button>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <div className="text-center space-y-2">
                    <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">Select Focus Areas</h2>
                    <p className="text-gray-500 text-sm font-medium">Choose up to 3 skills to prioritize in your daily plan.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[50vh] overflow-y-auto custom-scrollbar p-1">
                    {LEARNING_TARGETS.map(t => {
                      const isSelected = tempTargets.includes(t.id);
                      const isMax = tempTargets.length >= 3 && !isSelected;
                      return (
                        <button
                          key={t.id}
                          onClick={() => toggleTarget(t.id)}
                          disabled={isMax}
                          className={`
                                 relative p-4 rounded-2xl border-2 text-left transition-all duration-200 group flex items-start gap-4
                                 ${isSelected
                              ? 'border-lovelya-500 bg-lovelya-50 dark:bg-lovelya-900/20 shadow-md ring-1 ring-lovelya-200 dark:ring-lovelya-800'
                              : 'border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-lovelya-200 dark:hover:border-gray-500 hover:shadow-sm'}
                                 ${isMax ? 'opacity-40 cursor-not-allowed grayscale' : ''}
                               `}
                        >
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shrink-0 transition-colors ${isSelected ? 'bg-lovelya-500 text-white' : `${t.color} bg-gray-50 dark:bg-gray-700`}`}>
                            <i className={`fas ${t.icon}`}></i>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-bold text-gray-800 dark:text-white mb-1 flex items-center justify-between">
                              <span className="truncate">{t.name}</span>
                              {isSelected && <i className="fas fa-check-circle text-lovelya-500"></i>}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 font-medium leading-relaxed line-clamp-2">
                              {t.description}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
                    <button onClick={() => setStep(1)} className="flex-1 py-3.5 bg-gray-100 dark:bg-gray-700 rounded-xl font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition">Back</button>
                    <button
                      onClick={() => setStep(3)}
                      disabled={tempTargets.length === 0}
                      className="flex-1 py-3.5 bg-lovelya-600 text-white rounded-xl font-bold hover:bg-lovelya-700 disabled:opacity-50 shadow-lg shadow-lovelya-200/50 transition transform active:scale-[0.98]"
                    >
                      Continue ({tempTargets.length}/3)
                    </button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-center">Intensity</h2>
                  <div className="grid grid-cols-3 gap-3">
                    {LEARNING_INTENSITIES.map(i => (
                      <button key={i.id} onClick={() => setTempIntensity(i.id)} className={`p-4 rounded-xl border-2 text-center ${tempIntensity === i.id ? 'border-lovelya-500 bg-lovelya-50' : 'border-gray-200'}`}>
                        <div className="text-2xl mb-2"><i className={`fas ${i.icon}`}></i></div>
                        <div className="font-bold text-sm">{i.name}</div>
                        <div className="text-xs text-gray-500">{i.duration}</div>
                      </button>
                    ))}
                  </div>

                  <div className="flex gap-3">
                    <button onClick={() => setStep(2)} className="flex-1 py-3 bg-gray-100 rounded-xl font-bold text-gray-600">Back</button>
                    <button onClick={handleSavePlan} disabled={!tempIntensity} className="flex-1 py-3 bg-lovelya-600 text-white rounded-xl font-bold hover:bg-lovelya-700 disabled:opacity-50">Finish</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default App;
