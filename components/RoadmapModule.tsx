// Fix: Added missing React and hooks imports
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Level, CurriculumUnit, CurriculumStep, AppView, ModuleProps, ModuleContext, ThematicBridgeContent } from '../types';
import { MASTER_CURRICULUM } from '../data/curriculum';
import { THEMATIC_BRIDGES } from '../data/thematicBridges';
import { getRoadmapProgress, completeRoadmapUnit } from '../services/storage';
import { LEVELS } from '../constants';
import { audioService } from '../services/audioService';

interface RoadmapModuleProps extends ModuleProps {
  onNavigateToModule: (view: AppView, context: ModuleContext) => void;
}

const RoadmapModule: React.FC<RoadmapModuleProps> = ({ onNavigateToModule }) => {
  const [progress, setProgress] = useState<string[]>([]);
  const [selectedUnit, setSelectedUnit] = useState<CurriculumUnit | null>(null);
  const [activeLevelFilter, setActiveLevelFilter] = useState<Level | 'ALL'>('ALL');
  const [viewMode, setViewMode] = useState<'ROADMAP' | 'LIBRARY'>('ROADMAP');
  const [activeBridge, setActiveBridge] = useState<ThematicBridgeContent | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setProgress(getRoadmapProgress());
  }, []);

  const isUnitCompleted = (unitId: string) => progress.includes(unitId);
  const isStepCompleted = (stepId: string) => progress.includes(stepId);

  const handleUnitClick = (unit: CurriculumUnit) => {
    audioService.play('tap');
    setSelectedUnit(unit);
  };

  const startStep = (step: CurriculumStep) => {
    audioService.play('nav');
    if (step.type === 'context_bridge') {
      const bridgeId = `${step.id}`; // Matches keys in thematicBridges.ts
      if (THEMATIC_BRIDGES[bridgeId]) {
        setActiveBridge(THEMATIC_BRIDGES[bridgeId]);
        // Also mark as completed if it's the first time
        if (!isStepCompleted(step.id)) {
            completeRoadmapUnit(step.id);
            setProgress(getRoadmapProgress());
        }
      }
      return;
    }

    if (!selectedUnit) return;
    
    const context: ModuleContext = {
      unitId: selectedUnit.id,
      stepId: step.id,
      type: 'unit',
      autoStart: true,
      level: selectedUnit.level,
      title: step.title,
      desc: step.description,
      grammarFocus: selectedUnit.grammarFocus,
      vocabTheme: selectedUnit.vocabTheme,
      targetLessonId: step.targetId,
      promptContext: step.promptContext
    };

    onNavigateToModule(step.moduleView, context);
  };

  const filteredCurriculum = useMemo(() => {
    if (activeLevelFilter === 'ALL') return MASTER_CURRICULUM;
    return MASTER_CURRICULUM.filter(lc => lc.level === activeLevelFilter);
  }, [activeLevelFilter]);

  // --- LIBRARY VIEW RENDERER ---
  const renderLibrary = () => {
    const bridgeEntries = Object.values(THEMATIC_BRIDGES).filter(b => 
        activeLevelFilter === 'ALL' ? true : b.level === activeLevelFilter
    );

    return (
      <div className="space-y-8 md:space-y-12 animate-fade-in px-4">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
          {bridgeEntries.map(bridge => {
            const completed = isUnitCompleted(bridge.id);
            return (
              <button 
                key={bridge.id} 
                onClick={() => {
                  audioService.play('tap');
                  setActiveBridge(bridge);
                }}
                className={`bg-white dark:bg-gray-800 p-4 md:p-6 rounded-2xl md:rounded-3xl border text-left hover:shadow-xl hover:-translate-y-1 transition-all group flex flex-col h-full relative overflow-hidden ${completed ? 'border-green-500' : 'border-gray-100 dark:border-gray-700'}`}
              >
                {completed && (
                  <div className="absolute top-2 right-2 md:top-4 md:right-4 w-5 h-5 md:w-8 md:h-8 rounded-full bg-green-500 text-white flex items-center justify-center text-[8px] md:text-sm shadow-lg">
                    <i className="fas fa-check"></i>
                  </div>
                )}
                <div className={`w-9 h-9 md:w-12 md:h-12 rounded-xl flex items-center justify-center mb-3 md:mb-4 group-hover:scale-110 transition shrink-0 ${completed ? 'bg-green-50 text-green-600' : 'bg-purple-50 dark:bg-purple-900/30 text-purple-600'}`}>
                  <i className={`fas ${completed ? 'fa-check-double' : 'fa-bookmark'} text-xs md:text-base`}></i>
                </div>
                <span className="text-[7px] md:text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">{bridge.level} Material</span>
                <h4 className="text-[11px] md:text-xl font-bold text-gray-800 dark:text-white leading-tight mb-1 md:mb-2 line-clamp-2">{bridge.unitTitle}</h4>
                <p className="text-[9px] md:text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-3 md:mb-4 flex-1">{bridge.introduction}</p>
                <div className={`mt-auto pt-2 md:pt-4 border-t flex justify-between items-center text-[7px] md:text-[10px] font-black uppercase tracking-wider ${completed ? 'text-green-600 border-green-50' : 'text-purple-500 border-gray-50 dark:border-gray-700'}`}>
                  <span>{completed ? 'Mastered' : 'Read Insight'}</span> <i className="fas fa-arrow-right"></i>
                </div>
              </button>
            );
          })}
          {bridgeEntries.length === 0 && (
            <div className="col-span-full py-20 text-center text-gray-400">
               <i className="fas fa-folder-open text-5xl mb-4 opacity-20"></i>
               <p className="font-bold">No library materials for this level yet.</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto pb-24 md:pb-32 animate-fade-in" ref={scrollContainerRef}>
      {/* Header Info */}
      <div className="text-center mb-6 md:mb-12 px-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-lovelya-50 dark:bg-lovelya-900/20 text-lovelya-600 dark:text-lovelya-400 text-[9px] md:text-xs font-black uppercase tracking-widest mb-3 md:mb-6">
           <i className="fas fa-route"></i> Master Learning Path
        </div>
        <h2 className="text-xl md:text-5xl font-black text-gray-900 dark:text-white mb-2 md:mb-4 tracking-tight">Curriculum Roadmap</h2>
        <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto font-medium text-[10px] md:text-lg leading-relaxed px-4">
          Choose your level and start learning freely. Explore the Thematic Library for deeper context.
        </p>

        {/* View Switcher */}
        <div className="flex justify-center mt-5 md:mt-10">
           <div className="bg-gray-100 dark:bg-gray-800 p-1 md:p-1.5 rounded-xl md:rounded-2xl flex gap-1">
             <button 
                onClick={() => setViewMode('ROADMAP')}
                className={`px-4 py-1.5 md:px-8 md:py-3 rounded-lg md:rounded-xl text-[10px] md:text-sm font-black transition-all flex items-center gap-1.5 md:gap-2 ${viewMode === 'ROADMAP' ? 'bg-white dark:bg-gray-700 text-lovelya-600 shadow-sm' : 'text-gray-400'}`}
             >
               <i className="fas fa-map-marked-alt"></i> Roadmap
             </button>
             <button 
                onClick={() => setViewMode('LIBRARY')}
                className={`px-4 py-1.5 md:px-8 md:py-3 rounded-lg md:rounded-xl text-[10px] md:text-sm font-black transition-all flex items-center gap-1.5 md:gap-2 ${viewMode === 'LIBRARY' ? 'bg-white dark:bg-gray-700 text-purple-600 shadow-sm' : 'text-gray-400'}`}
             >
               <i className="fas fa-archive"></i> Thematic Library
             </button>
           </div>
        </div>
      </div>

      {/* Level Selector Tabs */}
      <div className="sticky top-4 z-[40] px-4 mb-8 md:mb-12">
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl p-1 md:p-1.5 rounded-2xl md:rounded-[2rem] shadow-xl border border-lovelya-100 dark:border-gray-700 flex gap-1 overflow-x-auto no-scrollbar items-center">
          <div className="px-3 md:px-6 py-2 border-r border-gray-100 dark:border-gray-700 hidden md:flex flex-col items-center justify-center">
            <div className="text-[10px] font-black text-lovelya-600 uppercase tracking-widest leading-none mb-1">Overall</div>
            <div className="text-xl font-black text-gray-800 dark:text-white leading-none">{Math.min(100, Math.round((Object.keys(progress).length / 50) * 100))}%</div>
          </div>
          <button 
            onClick={() => setActiveLevelFilter('ALL')}
            className={`px-4 py-2 md:px-6 md:py-3 rounded-xl md:rounded-2xl text-[10px] md:text-sm font-black transition-all whitespace-nowrap ${activeLevelFilter === 'ALL' ? 'bg-lovelya-600 text-white shadow-lg' : 'text-gray-400 hover:text-lovelya-500'}`}
          >
            ALL LEVELS
          </button>
          {LEVELS.map(lvl => (
            <button 
              key={lvl}
              onClick={() => setActiveLevelFilter(lvl)}
              className={`px-5 py-2 md:px-8 md:py-3 rounded-xl md:rounded-2xl text-[10px] md:text-sm font-black transition-all whitespace-nowrap flex items-center gap-1.5 md:gap-2 ${activeLevelFilter === lvl ? 'bg-lovelya-600 text-white shadow-lg' : 'text-gray-400 hover:text-lovelya-500'}`}
            >
              {lvl}
              {MASTER_CURRICULUM.find(c => c.level === lvl)?.units.every(u => isUnitCompleted(u.id)) && (
                <i className="fas fa-check-circle text-[8px] md:text-[10px]"></i>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content View */}
      {viewMode === 'ROADMAP' ? (
        <div className="space-y-16 md:space-y-24 px-4">
            {filteredCurriculum.map((levelData) => (
            <section key={levelData.level} className="animate-slide-up">
                {/* Level Label */}
                <div className="flex items-center gap-3 md:gap-6 mb-5 md:mb-12">
                    <div className="w-10 h-10 md:w-20 md:h-20 rounded-xl md:rounded-3xl bg-gradient-to-br from-lovelya-600 to-indigo-600 flex items-center justify-center text-base md:text-3xl font-black text-white shadow-xl rotate-3 shrink-0">
                        {levelData.level}
                    </div>
                    <div>
                        <h3 className="text-sm md:text-3xl font-black text-gray-900 dark:text-white uppercase tracking-wider">Level {levelData.level}</h3>
                        <p className="text-[8px] md:text-sm text-gray-400 font-bold uppercase tracking-widest">{levelData.units.length} Guided Units Available</p>
                    </div>
                    <div className="flex-1 h-px bg-gray-100 dark:bg-gray-800 ml-2 md:ml-4"></div>
                </div>

                {/* Units Grid - Stack on mobile for better readability */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
                {levelData.units.map((unit) => {
                    const completed = isUnitCompleted(unit.id);
                    const stepsCompleted = unit.steps.filter(s => isStepCompleted(s.id)).length;
                    const totalSteps = unit.steps.length;
                    const progPct = (stepsCompleted / totalSteps) * 100;

                    return (
                    <button 
                        key={unit.id}
                        onClick={() => handleUnitClick(unit)}
                        className="group relative bg-white dark:bg-gray-800 p-5 md:p-8 rounded-3xl md:rounded-[3rem] border border-gray-100 dark:border-gray-700 text-left hover:border-lovelya-400 hover:shadow-2xl transition-all duration-500 flex flex-col h-full overflow-hidden"
                    >
                        {/* Background Progress Bar (Subtle) */}
                        <div className="absolute bottom-0 left-0 h-1 md:h-1.5 bg-lovelya-500 transition-all duration-1000 ease-out" style={{ width: `${progPct}%` }}></div>

                        <div className="flex justify-between items-start mb-3 md:mb-6">
                            <div className={`w-8 h-8 md:w-12 md:h-12 rounded-xl flex items-center justify-center text-xs md:text-xl shadow-sm shrink-0 ${completed ? 'bg-green-500 text-white' : 'bg-lovelya-50 dark:bg-gray-700 text-lovelya-600'}`}>
                                {completed ? <i className="fas fa-check"></i> : <span className="font-black italic text-sm md:text-xl">{unit.unitNumber}</span>}
                            </div>
                            {completed ? (
                                <span className="bg-green-100 text-green-700 px-2 py-0.5 md:px-3 md:py-1 rounded-full text-[8px] md:text-[10px] font-black uppercase tracking-widest">Mastered</span>
                            ) : stepsCompleted > 0 ? (
                                <span className="bg-lovelya-50 text-lovelya-600 px-2 py-0.5 md:px-3 md:py-1 rounded-full text-[8px] md:text-[10px] font-black uppercase tracking-widest">In Progress</span>
                            ) : (
                                <span className="bg-gray-100 dark:bg-gray-700 text-gray-500 px-2 py-0.5 md:px-3 md:py-1 rounded-full text-[8px] md:text-[10px] font-black uppercase tracking-widest">Available</span>
                            )}
                        </div>

                        <h4 className="text-sm md:text-2xl font-black text-gray-800 dark:text-white mb-1.5 md:mb-3 leading-tight group-hover:text-lovelya-600 transition-colors">
                            {unit.title}
                        </h4>
                        <p className="text-[10px] md:text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-4 md:mb-8 flex-1 line-clamp-2 md:line-clamp-3">
                            {unit.description}
                        </p>

                        <div className="flex items-center justify-between pt-2 md:pt-6 border-t border-gray-50 dark:border-gray-700">
                            <div className="flex -space-x-1 md:-space-x-2">
                                {unit.steps.slice(0, 3).map((step, i) => (
                                    <div key={i} className={`w-5 h-5 md:w-8 md:h-8 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center text-[7px] md:text-[10px] shadow-sm shrink-0 ${isStepCompleted(step.id) ? 'bg-green-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-400'}`}>
                                        <i className={`fas ${
                                            step.type === 'context_bridge' ? 'fa-bookmark' :
                                            step.moduleView === AppView.GRAMMAR ? 'fa-spell-check' :
                                            step.moduleView === AppView.READING ? 'fa-book-open' :
                                            step.moduleView === AppView.LISTENING ? 'fa-headphones' :
                                            'fa-microphone-alt'
                                        }`}></i>
                                    </div>
                                ))}
                            </div>
                            <div className="text-[7px] md:text-xs font-black text-lovelya-500 uppercase tracking-widest group-hover:translate-x-1 transition-transform">
                                <span className="hidden md:inline">Details</span> <i className="fas fa-arrow-right ml-0.5 md:ml-1"></i>
                            </div>
                        </div>
                    </button>
                    );
                })}
                </div>
            </section>
            ))}
        </div>
      ) : renderLibrary()}

      {/* Context Bridge Reader Modal */}
      {activeBridge && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center bg-gray-900/90 backdrop-blur-sm p-4 md:p-8 animate-fade-in overflow-hidden">
             <div className="bg-white dark:bg-gray-800 w-full max-w-4xl max-h-[92vh] rounded-[2.5rem] shadow-2xl relative overflow-hidden flex flex-col animate-slide-up">
                {/* Close Button */}
                <button 
                  onClick={() => setActiveBridge(null)}
                  className="absolute top-4 right-4 md:top-6 md:right-6 w-10 h-10 md:w-12 md:h-12 rounded-full bg-gray-100/80 dark:bg-gray-700/80 backdrop-blur-md flex items-center justify-center text-gray-500 hover:text-red-500 z-[120] shadow-sm transition"
                >
                  <i className="fas fa-times text-lg"></i>
                </button>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-12">
                   <div className="max-w-[70ch] mx-auto space-y-8 md:space-y-12">
                      {/* Header Section */}
                      <div className="text-center pt-4">
                         <span className="inline-block bg-purple-50 dark:bg-purple-900/30 text-purple-600 px-3 md:px-4 py-1 rounded-full text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] mb-3 md:mb-4">Thematic Insight</span>
                         <h2 className="text-2xl md:text-5xl font-black text-gray-900 dark:text-white leading-tight px-4">{activeBridge.unitTitle}</h2>
                         <div className="w-12 md:w-16 h-1 bg-lovelya-500 mx-auto mt-4 md:mt-8 rounded-full"></div>
                      </div>

                      {/* Introduction */}
                      <section className="bg-gray-50 dark:bg-gray-900/50 p-6 md:p-8 rounded-3xl border-l-4 border-purple-400">
                         <p className="text-[11px] md:text-sm font-serif italic text-gray-700 dark:text-gray-300 leading-relaxed">
                            "{activeBridge.introduction}"
                         </p>
                      </section>

                      {/* Meaty Insight (75%) */}
                      <section className="space-y-4 md:space-y-6">
                         <h3 className="text-sm md:text-lg font-black text-gray-800 dark:text-white flex items-center gap-3">
                            <span className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-lovelya-500 text-white flex items-center justify-center text-sm"><i className="fas fa-lightbulb"></i></span>
                            Topic Exploration
                         </h3>
                         <p className="text-[10px] md:text-sm text-gray-600 dark:text-gray-300 leading-[1.7] md:leading-[1.8] font-medium">
                            {activeBridge.thematicInsight}
                         </p>
                      </section>

                      {/* Grammar Bridge (25%) */}
                      <section className="bg-lovelya-50 dark:bg-lovelya-900/10 p-6 md:p-8 rounded-3xl border border-lovelya-100 dark:border-lovelya-900">
                         <h3 className="text-xs md:text-sm font-black text-lovelya-700 dark:text-lovelya-400 mb-4 uppercase tracking-widest flex items-center gap-2">
                           <i className="fas fa-link"></i> Grammar Connection
                         </h3>
                         <p className="text-[10px] md:text-sm text-lovelya-800 dark:text-lovelya-200 leading-relaxed font-bold">
                            {activeBridge.grammarConnection}
                         </p>
                      </section>

                      {/* CEFR Focus & Pro Tips (New) */}
                      {(activeBridge.cefrFocus || activeBridge.proTips) && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           {activeBridge.cefrFocus && (
                              <section className="bg-gray-50 dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700">
                                 <h3 className="text-[9px] md:text-[10px] font-black text-gray-700 dark:text-gray-400 mb-3 uppercase tracking-widest flex items-center gap-2">
                                    <i className="fas fa-certificate"></i> CEFR Competency
                                 </h3>
                                 <p className="text-[10px] md:text-sm text-gray-800 dark:text-gray-200 leading-relaxed font-medium">
                                    {activeBridge.cefrFocus}
                                 </p>
                              </section>
                           )}
                           {activeBridge.proTips && activeBridge.proTips.length > 0 && (
                              <section className="bg-indigo-50 dark:bg-indigo-900/10 p-6 rounded-3xl border border-indigo-100 dark:border-indigo-900/30">
                                 <h3 className="text-[9px] md:text-[10px] font-black text-indigo-700 dark:text-indigo-400 mb-3 uppercase tracking-widest flex items-center gap-2">
                                    <i className="fas fa-star"></i> International Pro Tips
                                 </h3>
                                 <ul className="space-y-2">
                                    {activeBridge.proTips.map((tip, i) => (
                                       <li key={i} className="text-[10px] md:text-xs text-indigo-800 dark:text-indigo-200 flex gap-2">
                                          <span className="text-indigo-400">•</span>
                                          <span>{tip}</span>
                                       </li>
                                    ))}
                                 </ul>
                              </section>
                           )}
                        </div>
                      )}

                      {/* Detailed Explanation (New) */}
                      {activeBridge.detailedExplanation && (
                        <section className="bg-gray-50 dark:bg-gray-800 p-6 md:p-8 rounded-3xl border border-gray-100 dark:border-gray-700">
                           <h3 className="text-sm md:text-lg font-black text-gray-700 dark:text-gray-400 mb-4 uppercase tracking-widest flex items-center gap-2">
                              <i className="fas fa-book-open"></i> Mastery Insights
                           </h3>
                           <div className="prose dark:prose-invert max-w-none text-gray-900 dark:text-gray-100 whitespace-pre-line leading-relaxed text-[10px] md:text-sm">
                              {activeBridge.detailedExplanation}
                           </div>
                        </section>
                      )}

                      {/* Concrete Scenario */}
                      <section className="space-y-4 md:space-y-6">
                         <h3 className="text-sm md:text-lg font-black text-gray-800 dark:text-white flex items-center gap-3">
                            <span className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-lovelya-500 text-white flex items-center justify-center text-sm"><i className="fas fa-comments"></i></span>
                            Contextual Scenario
                         </h3>
                         <div className="bg-white dark:bg-gray-900 rounded-[1.5rem] md:rounded-[2rem] border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm">
                            <div className="bg-gray-50 dark:bg-gray-800 px-5 md:px-6 py-3 md:py-4 border-b border-gray-100 dark:border-gray-700">
                               <span className="text-[10px] md:text-xs font-bold text-gray-600 uppercase tracking-widest">{activeBridge.scenarioTitle}</span>
                            </div>
                            <div className="p-5 md:p-6 space-y-4">
                               {activeBridge.scenarioDialogue.map((line, idx) => (
                                 <div key={idx} className="flex flex-col sm:flex-row gap-1 sm:gap-4">
                                    <span className="font-black text-lovelya-600 dark:text-lovelya-400 min-w-[80px] text-[10px] md:text-xs uppercase">{line.speaker}:</span>
                                    <span className="text-gray-700 dark:text-gray-300 text-[10px] md:text-sm">{line.text}</span>
                                 </div>
                               ))}
                            </div>
                         </div>
                      </section>

                      {/* Footer / Takeaway */}
                      <div className="pt-6 md:pt-10 border-t border-gray-100 dark:border-gray-700 text-center pb-6">
                         <p className="text-[11px] md:text-sm font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Key Takeaway</p>
                         <p className="text-xl md:text-2xl font-bold text-lovelya-600 dark:text-lovelya-400">{activeBridge.keyTakeaway}</p>
                         <button 
                           onClick={() => setActiveBridge(null)}
                           className="mt-8 md:mt-12 w-full sm:w-auto px-12 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-2xl font-black shadow-xl hover:scale-105 transition transform active:scale-95"
                         >
                            I Understand
                         </button>
                      </div>
                   </div>
                </div>
             </div>
          </div>
      )}

      {/* Unit Detail Modal */}
      {selectedUnit && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-xl p-4 animate-fade-in">
          <div className="bg-white dark:bg-gray-800 w-full max-w-2xl max-h-[95vh] md:max-h-[92vh] rounded-[2.5rem] md:rounded-[3.5rem] shadow-2xl overflow-hidden animate-slide-up border border-white/20 dark:border-gray-700 flex flex-col">
             <div className="bg-gradient-to-br from-lovelya-700 via-lovelya-600 to-indigo-700 p-4 md:p-7 text-white relative shrink-0">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
                
                <div className="relative z-10">
                    <div className="flex justify-between items-start mb-2 md:mb-4">
                        <span className="bg-white/20 backdrop-blur-md px-2 md:px-4 py-1 md:py-1.5 rounded-full text-[7px] md:text-[10px] font-black uppercase tracking-widest border border-white/30">
                            Level {selectedUnit.level} • Unit {selectedUnit.unitNumber}
                        </span>
                        <button onClick={() => setSelectedUnit(null)} className="w-7 h-7 md:w-10 md:h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/40 transition-all transform hover:rotate-90">
                            <i className="fas fa-times text-sm md:text-lg"></i>
                        </button>
                    </div>
                    <h2 className="text-lg md:text-2xl font-black mb-1 md:mb-2 leading-tight">{selectedUnit.title}</h2>
                    <p className="text-lovelya-100 text-[10px] md:text-sm font-medium leading-relaxed max-w-lg line-clamp-2 md:line-clamp-none">{selectedUnit.description}</p>
                </div>
             </div>

             <div className="p-4 md:p-8 flex-1 overflow-hidden flex flex-col">
                <div className="mb-2 md:mb-4 flex items-center justify-between shrink-0">
                    <h4 className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Learning Sequence</h4>
                </div>

                <div className="space-y-2 md:space-y-4 overflow-y-auto custom-scrollbar pr-2 flex-1 pb-4">
                   {selectedUnit.steps.map((step, sIdx) => {
                      const stepCompleted = isStepCompleted(step.id);
                      
                      return (
                        <div key={step.id} className="relative">
                            {/* Vertical line between steps */}
                            {sIdx < selectedUnit.steps.length - 1 && (
                                <div className={`absolute left-5 md:left-7 top-10 md:top-12 bottom-0 w-1 -mb-3 md:-mb-4 z-0 ${stepCompleted ? 'bg-green-200 dark:bg-green-900/30' : 'bg-gray-100 dark:bg-gray-700'}`}></div>
                            )}

                            <button 
                                onClick={() => startStep(step)}
                                className={`
                                    relative z-10 w-full flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-xl md:rounded-2xl border-2 transition-all duration-300 group/btn
                                    ${stepCompleted ? 'bg-green-50/30 border-green-100 dark:bg-green-900/5 dark:border-green-900/30' : 'bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 hover:border-lovelya-400 hover:shadow-lg hover:-translate-x-1'}
                                `}
                            >
                                <div className={`
                                    w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl flex items-center justify-center text-lg md:text-xl shrink-0 shadow-sm transition-all
                                    ${stepCompleted ? 'bg-green-500 text-white' : 'bg-lovelya-100 dark:bg-lovelya-900/30 text-lovelya-600 group-hover/btn:scale-110'}
                                `}>
                                    {stepCompleted ? <i className="fas fa-check text-xs md:text-sm"></i> : 
                                     step.type === 'context_bridge' ? <i className="fas fa-bookmark text-xs md:text-sm"></i> :
                                     step.moduleView === AppView.GRAMMAR ? <i className="fas fa-spell-check text-xs md:text-sm"></i> :
                                     step.moduleView === AppView.READING ? <i className="fas fa-book-open text-xs md:text-sm"></i> :
                                     step.moduleView === AppView.LISTENING ? <i className="fas fa-headphones text-xs md:text-sm"></i> :
                                     <i className="fas fa-microphone-alt text-xs md:text-sm"></i>}
                                </div>

                                <div className="text-left flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-0.5">
                                        <span className="text-[8px] md:text-[9px] font-black text-gray-400 uppercase tracking-widest">Step {sIdx + 1}</span>
                                        {!stepCompleted && <span className="w-1 h-1 rounded-full bg-lovelya-500 animate-pulse"></span>}
                                    </div>
                                    <h5 className={`font-black text-sm md:text-base leading-tight truncate ${stepCompleted ? 'text-green-700 dark:text-green-400' : 'text-gray-800 dark:text-white'}`}>
                                        {step.title}
                                    </h5>
                                    <p className="text-[9px] md:text-[10px] text-gray-500 dark:text-gray-400 font-medium mt-0.5 line-clamp-1">{step.goal}</p>
                                </div>

                                {!stepCompleted && (
                                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-lovelya-600 text-white flex items-center justify-center shadow-md group-hover/btn:scale-110 transition shrink-0">
                                        <i className="fas fa-play text-[8px] pl-0.5"></i>
                                    </div>
                                )}
                            </button>
                        </div>
                      );
                   })}
                </div>
             </div>
             
             <div className="p-4 md:p-8 pt-0 flex gap-2 md:gap-4 shrink-0">
                <button 
                    onClick={() => setSelectedUnit(null)}
                    className="flex-1 py-2.5 md:py-4 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-black rounded-xl md:rounded-2xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all text-[9px] md:text-xs uppercase tracking-widest"
                >
                    Close
                </button>
                {!isUnitCompleted(selectedUnit.id) && (
                    <button 
                        onClick={() => {
                            completeRoadmapUnit(selectedUnit.id);
                            setProgress(getRoadmapProgress());
                            setSelectedUnit(null);
                        }}
                        className="flex-[2] py-2.5 md:py-4 bg-green-600 text-white font-black rounded-xl md:rounded-2xl shadow-xl hover:bg-green-700 transition transform active:scale-95 text-[9px] md:text-xs uppercase tracking-widest flex items-center justify-center gap-1.5 md:gap-3"
                    >
                        <i className="fas fa-medal"></i> Mark Mastered
                    </button>
                )}
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoadmapModule;