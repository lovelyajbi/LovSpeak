
import React, { useState, useEffect, useRef } from 'react';
import { GrammarLesson, ModuleProps, GrammarResult, AppView, ModuleContext, QuizQuestion } from '../types';
import { GRAMMAR_LESSONS } from '../data/grammarLessons';
import { audioService } from '../services/audioService';
import { analyzeGrammar, generateGrammarTask, generateGrammarQuiz } from '../services/gemini';
import { logActivity, completeRoadmapUnit } from '../services/storage';
import MindMapRenderer from './MindMapRenderer';

const GrammarModule: React.FC<ModuleProps> = ({ onComplete, initialContext, onNavigate }) => {
  const [selectedLesson, setSelectedLesson] = useState<GrammarLesson | null>(null);
  const [activeTab, setActiveTab] = useState<'explanation' | 'practice' | 'mindmap' | 'quiz'>('explanation');
  const [userInput, setUserInput] = useState('');
  const [result, setResult] = useState<GrammarResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingTask, setLoadingTask] = useState(false);
  const [grammarTask, setGrammarTask] = useState('');
  const [filterLevel, setFilterLevel] = useState<string | 'All'>('All');
  const [errorMessage, setErrorMessage] = useState('');
  
  // Pagination for Lessons
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Quiz State
  const [currentQuiz, setCurrentQuiz] = useState<QuizQuestion[]>([]);
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizLoading, setQuizLoading] = useState(false);

  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    if (initialContext?.autoStart && initialContext.type === 'unit') {
        const lesson = GRAMMAR_LESSONS.find(l => l.id === initialContext.targetLessonId);
        if (lesson) {
            handleSelectLesson(lesson);
        } else {
            setGrammarTask(initialContext.desc || `Write 3-5 sentences using ${initialContext.grammarFocus}.`);
            setStep('custom_task');
        }
    }
  }, [initialContext]);

  const [step, setStep] = useState<'list' | 'lesson' | 'custom_task'>('list');

  const handleSelectLesson = (lesson: GrammarLesson) => {
    audioService.play('nav');
    setSelectedLesson(lesson);
    setStep('lesson');
    setActiveTab('explanation');
    setResult(null);
    setUserInput('');
    setErrorMessage('');
    setQuizSubmitted(false);
    setQuizAnswers([]);
    setCurrentQuiz([]);
    startTimeRef.current = Date.now();
    
    // Auto-generate task on lesson select
    refreshTask(lesson.title);

    // Check if quiz already exists in data
    if (lesson.quiz && lesson.quiz.length > 0) {
        setCurrentQuiz(lesson.quiz);
    }
  };

  const refreshTask = async (title: string) => {
    setLoadingTask(true);
    try {
        const task = await generateGrammarTask(title);
        setGrammarTask(task);
    } catch (e) {
        setGrammarTask(`Write 3-5 sentences to practice ${title}.`);
    } finally {
        setLoadingTask(false);
    }
  };

  const handleGenerateLessonQuiz = async () => {
    if (!selectedLesson) return;
    setQuizLoading(true);
    try {
      const contentString = selectedLesson.sections.map(s => `${s.heading}: ${s.content}`).join('\n');
      const generated = await generateGrammarQuiz(selectedLesson.title, contentString, selectedLesson.level);
      setCurrentQuiz(generated);
      setQuizAnswers(new Array(generated.length).fill(-1));
      setQuizSubmitted(false);
    } catch (e: any) {
      setErrorMessage("Failed to generate quiz. Please try again.");
    } finally {
      setQuizLoading(false);
    }
  };

  const handleQuizSubmit = () => {
    if (quizAnswers.includes(-1)) {
        alert("Please answer all questions before submitting.");
        return;
    }
    let correct = 0;
    currentQuiz.forEach((q, idx) => {
        if (quizAnswers[idx] === q.correctIndex) correct++;
    });
    const finalScore = Math.round((correct / currentQuiz.length) * 100);
    setQuizScore(finalScore);
    setQuizSubmitted(true);

    logActivity({
        type: AppView.GRAMMAR,
        date: new Date().toISOString(),
        durationSeconds: Math.round((Date.now() - startTimeRef.current) / 1000),
        score: finalScore,
        accuracy: finalScore,
        details: `Quiz: ${selectedLesson?.title}`
    });

    if (initialContext?.stepId && finalScore >= 70) {
        completeRoadmapUnit(initialContext.stepId);
    }
  };

  const handleCheckGrammar = async () => {
    if (!userInput.trim()) return;
    audioService.play('tap');
    setLoading(true);
    setErrorMessage('');
    try {
      const evaluation = await analyzeGrammar(userInput, grammarTask);
      setResult(evaluation);
      
      logActivity({
        type: AppView.GRAMMAR,
        date: new Date().toISOString(),
        durationSeconds: Math.round((Date.now() - startTimeRef.current) / 1000),
        score: evaluation.score,
        accuracy: evaluation.score,
        details: `Practice: ${selectedLesson?.title || 'Custom Writing'}`
      });

      if (initialContext?.stepId && evaluation.score >= 70) {
          completeRoadmapUnit(initialContext.stepId);
      }

      if (onComplete && evaluation.score >= 70) onComplete();
    } catch (e: any) {
      setErrorMessage(e.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredLessons = filterLevel === 'All' 
    ? GRAMMAR_LESSONS 
    : GRAMMAR_LESSONS.filter(l => l.level === filterLevel);

  const totalPages = Math.ceil(filteredLessons.length / itemsPerPage);
  const paginatedLessons = filteredLessons.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  if (step === 'lesson' && selectedLesson) {
    return (
      <div className="max-w-5xl mx-auto animate-fade-in space-y-6 pb-20">
        <div className="flex items-center justify-between bg-white/80 dark:bg-gray-800/80 backdrop-blur-md p-3 md:p-4 rounded-2xl md:rounded-3xl shadow-sm border border-lovelya-100 dark:border-gray-700 sticky top-0 z-30">
           <button onClick={() => setStep('list')} className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-500 hover:text-gray-800 transition"><i className="fas fa-arrow-left text-sm md:text-base"></i></button>
           <div className="flex bg-gray-100 dark:bg-gray-700 p-1 rounded-xl md:rounded-2xl overflow-x-auto no-scrollbar max-w-[200px] sm:max-w-none">
              <button onClick={() => setActiveTab('explanation')} className={`px-3 py-1.5 md:px-5 md:py-2 rounded-lg md:rounded-xl text-[10px] md:text-xs font-black uppercase transition whitespace-nowrap ${activeTab === 'explanation' ? 'bg-white dark:bg-gray-600 text-lovelya-600 shadow-sm' : 'text-gray-500'}`}>Study</button>
              {selectedLesson.mindmap && <button onClick={() => setActiveTab('mindmap')} className={`px-3 py-1.5 md:px-5 md:py-2 rounded-lg md:rounded-xl text-[10px] md:text-xs font-black uppercase transition whitespace-nowrap ${activeTab === 'mindmap' ? 'bg-white dark:bg-gray-600 text-lovelya-600 shadow-sm' : 'text-gray-500'}`}>Map</button>}
              <button onClick={() => setActiveTab('practice')} className={`px-3 py-1.5 md:px-5 md:py-2 rounded-lg md:rounded-xl text-[10px] md:text-xs font-black uppercase transition whitespace-nowrap ${activeTab === 'practice' ? 'bg-white dark:bg-gray-600 text-lovelya-600 shadow-sm' : 'text-gray-500'}`}>Practice</button>
              <button onClick={() => setActiveTab('quiz')} className={`px-3 py-1.5 md:px-5 md:py-2 rounded-lg md:rounded-xl text-[10px] md:text-xs font-black uppercase transition whitespace-nowrap ${activeTab === 'quiz' ? 'bg-white dark:bg-gray-600 text-lovelya-600 shadow-sm' : 'text-gray-500'}`}>Quiz</button>
           </div>
           <div className="w-8 md:w-10"></div>
        </div>

        {activeTab === 'explanation' && (
          <div className="space-y-6 md:space-y-8 animate-slide-up">
            <div className="bg-gradient-to-r from-lovelya-600 to-indigo-600 p-6 md:p-10 rounded-2xl md:rounded-[3rem] text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10"><i className={`fas ${selectedLesson.icon} text-5xl md:text-9xl`}></i></div>
                <span className="bg-white/20 backdrop-blur-md px-2.5 md:px-4 py-1 md:py-1.5 rounded-full text-[9px] md:text-xs font-bold uppercase tracking-widest mb-2 md:mb-4 inline-block">{selectedLesson.level} Lesson</span>
                <h1 className="text-xl md:text-4xl font-black mb-1 md:mb-2 leading-tight">{selectedLesson.title}</h1>
                <p className="text-lovelya-100 text-xs md:text-lg font-medium max-w-2xl leading-relaxed">{selectedLesson.description}</p>
            </div>
            <div className="grid grid-cols-1 gap-4 md:gap-8">
               {selectedLesson.sections.map((section, idx) => (
                 <div key={idx} className="bg-white dark:bg-gray-800 p-5 md:p-12 rounded-2xl md:rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-700">
                    <h2 className="text-base md:text-2xl font-black text-gray-800 dark:text-white mb-3 md:mb-6 flex items-center gap-2 md:gap-3"><span className="w-5 h-5 md:w-8 md:h-8 rounded-lg bg-lovelya-50 dark:bg-gray-700 text-lovelya-500 flex items-center justify-center text-[9px] md:text-sm">{idx + 1}</span>{section.heading}</h2>
                    <div className="prose dark:prose-invert max-w-none text-xs md:text-base text-gray-600 dark:text-gray-300 leading-relaxed mb-4 md:mb-8 whitespace-pre-wrap">{section.content}</div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
                       {section.examples.map((ex, i) => (
                         <div key={i} className={`p-3 md:p-5 rounded-xl md:rounded-2xl border-2 flex gap-2.5 md:gap-4 ${ex.isCorrect ? 'bg-green-50/50 border-green-100' : 'bg-red-50/50 border-red-100'}`}><div className={`w-7 h-7 md:w-10 md:h-10 rounded-lg md:rounded-xl flex items-center justify-center shrink-0 ${ex.isCorrect ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}><i className={`fas ${ex.isCorrect ? 'fa-check' : 'fa-times'} text-[10px] md:text-base`}></i></div><div><p className={`text-xs md:text-base font-bold ${ex.isCorrect ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'}`}>{ex.text}</p>{ex.note && <p className="text-[9px] md:text-xs mt-0.5 md:mt-1 opacity-70">{ex.note}</p>}</div></div>
                       ))}
                    </div>
                 </div>
               ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 px-2 md:px-0">
                <button onClick={() => setActiveTab('practice')} className="flex-1 py-3.5 md:py-6 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl md:rounded-[2rem] font-black text-sm md:text-xl shadow-xl hover:scale-[1.02] transition active:scale-95">Practice Mission</button>
                <button onClick={() => setActiveTab('quiz')} className="flex-1 py-3.5 md:py-6 bg-lovelya-600 text-white rounded-xl md:rounded-[2rem] font-black text-sm md:text-xl shadow-xl hover:scale-[1.02] transition active:scale-95">Take Quiz</button>
            </div>
          </div>
        )}

        {activeTab === 'mindmap' && selectedLesson.mindmap && (
          <div className="bg-white dark:bg-gray-800 p-8 rounded-[3rem] shadow-sm border border-gray-100 dark:border-gray-700 min-h-[600px] animate-fade-in overflow-hidden relative"><MindMapRenderer data={selectedLesson.mindmap} /></div>
        )}

        {activeTab === 'practice' && (
          <div className="space-y-6 animate-slide-up max-w-3xl mx-auto">
             <div className="bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 text-purple-600 flex items-center justify-center">
                            <i className="fas fa-pen-nib"></i>
                        </div>
                        <h3 className="text-xl font-black text-gray-800 dark:text-white">Writing Challenge</h3>
                    </div>
                    <button 
                        onClick={() => refreshTask(selectedLesson.title)} 
                        disabled={loadingTask}
                        className="p-2.5 rounded-xl bg-lovelya-50 dark:bg-lovelya-900/20 text-lovelya-600 dark:text-lovelya-400 hover:bg-lovelya-100 transition flex items-center gap-2 text-xs font-bold uppercase tracking-widest disabled:opacity-50"
                    >
                        <i className={`fas fa-magic ${loadingTask ? 'fa-spin' : ''}`}></i>
                        {loadingTask ? 'Regenerating...' : 'Regenerate Task'}
                    </button>
                </div>

                <div className={`p-6 rounded-2xl border-l-4 border-purple-400 transition-all duration-500 ${loadingTask ? 'bg-gray-100 dark:bg-gray-700 animate-pulse' : 'bg-gray-50 dark:bg-gray-900'}`}>
                    <p className={`text-gray-700 dark:text-gray-300 font-bold leading-relaxed ${loadingTask ? 'opacity-30' : 'opacity-100'}`}>
                        {loadingTask ? 'AI is crafting a unique prompt for this lesson...' : (grammarTask || "Failed to generate task. Please click regenerate.")}
                    </p>
                </div>

                <div className="mt-8 space-y-4">
                    <textarea 
                        value={userInput} 
                        onChange={e => setUserInput(e.target.value)} 
                        placeholder="Start writing here..." 
                        disabled={loadingTask}
                        className="w-full h-48 p-6 rounded-2xl border-2 border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-lovelya-500 outline-none transition-all text-lg leading-relaxed disabled:opacity-50" 
                    />
                    {errorMessage && <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-bold border border-red-100">{errorMessage}</div>}
                    <button onClick={handleCheckGrammar} disabled={loading || loadingTask || !userInput.trim()} className="w-full py-4 bg-lovelya-600 text-white rounded-2xl font-black text-lg shadow-lg hover:bg-lovelya-700 transition disabled:opacity-50">{loading ? <><i className="fas fa-circle-notch fa-spin mr-2"></i> Analyzing...</> : 'Check Grammar'}</button>
                </div>
             </div>
             {result && (
               <div className="bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] shadow-xl border border-lovelya-100 animate-bounce-in space-y-8">
                  <div className="flex justify-between items-center pb-6 border-b border-gray-100 dark:border-gray-700"><div className="flex items-center gap-4"><div className="text-5xl font-black text-lovelya-600">{result.score}</div><div><div className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Quality Score</div><div className="text-sm font-bold text-gray-600 dark:text-gray-400">{result.score >= 80 ? 'Excellent!' : result.score >= 60 ? 'Good Progress' : 'Keep Practicing'}</div></div></div><i className="fas fa-award text-4xl text-yellow-400"></i></div>
                  <div className="space-y-4"><h4 className="text-sm font-black uppercase text-gray-400 tracking-widest">Corrected Text</h4><div className="p-6 bg-green-50 dark:bg-green-900/10 rounded-2xl text-green-800 dark:text-green-200 leading-relaxed font-medium">{result.correctedText}</div></div>
                  {result.errors.length > 0 && (<div className="space-y-4"><h4 className="text-sm font-black uppercase text-gray-400 tracking-widest">Error Analysis</h4><div className="space-y-3">{result.errors.map((err, i) => (<div key={i} className="p-5 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-700"><div className="flex items-center gap-2 text-red-500 mb-1"><i className="fas fa-times-circle text-xs"></i><span className="text-xs font-black uppercase tracking-wider">Mistake</span></div><p className="line-through text-gray-400 mb-3">{err.mistake}</p><div className="flex items-center gap-2 text-green-500 mb-1"><i className="fas fa-check-circle text-xs"></i><span className="text-xs font-black uppercase tracking-wider">Correction</span></div><p className="font-bold text-gray-800 dark:text-white mb-3">{err.correction}</p><p className="text-sm text-gray-500 italic">{err.explanation}</p></div>))}</div></div>)}
                  <div className="p-6 bg-lovelya-50 dark:bg-lovelya-900/20 rounded-2xl"><span className="text-xs font-black uppercase text-lovelya-600 tracking-widest block mb-2">Teacher Feedback</span><p className="text-gray-700 dark:text-gray-200 font-medium">{result.generalFeedback}</p></div>
               </div>
             )}
          </div>
        )}

        {activeTab === 'quiz' && (
          <div className="space-y-8 animate-slide-up max-w-3xl mx-auto pb-20">
            {currentQuiz.length === 0 && !quizLoading ? (
              <div className="bg-white dark:bg-gray-800 p-12 rounded-[3rem] shadow-sm border border-gray-100 dark:border-gray-700 text-center space-y-6">
                <div className="w-20 h-20 bg-lovelya-50 dark:bg-gray-700 rounded-full flex items-center justify-center text-3xl text-lovelya-500 mx-auto">
                    <i className="fas fa-clipboard-question"></i>
                </div>
                <div>
                    <h3 className="text-2xl font-black text-gray-800 dark:text-white">Ready for a Quiz?</h3>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">Generate 10 multiple-choice questions based on this lesson.</p>
                </div>
                <button 
                    onClick={handleGenerateLessonQuiz}
                    className="px-10 py-4 bg-lovelya-600 text-white rounded-2xl font-black text-lg shadow-lg hover:bg-lovelya-700 transition transform hover:scale-105 active:scale-95"
                >
                    <i className="fas fa-magic mr-2"></i> Generate Quiz
                </button>
              </div>
            ) : quizLoading ? (
                <div className="py-20 text-center space-y-4">
                    <i className="fas fa-circle-notch fa-spin text-5xl text-lovelya-500"></i>
                    <p className="font-black text-gray-400 uppercase tracking-widest">AI is crafting your quiz...</p>
                </div>
            ) : (
                <div className="space-y-8">
                    {/* Quiz Results Summary */}
                    {quizSubmitted && (
                        <div className="bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] shadow-xl border border-lovelya-100 dark:border-gray-700 animate-bounce-in text-center space-y-4">
                            <div className="flex justify-center gap-2">
                                {[...Array(3)].map((_, i) => (
                                    <i key={i} className={`fas fa-star text-3xl ${i < Math.round(quizScore/33) ? 'text-yellow-400' : 'text-gray-200'}`}></i>
                                ))}
                            </div>
                            <h2 className="text-5xl font-black text-lovelya-600">{quizScore}%</h2>
                            <p className="text-gray-500 font-bold uppercase tracking-widest">Quiz Completed!</p>
                            <button 
                                onClick={handleGenerateLessonQuiz}
                                className="text-xs font-bold text-lovelya-500 hover:underline"
                            >
                                <i className="fas fa-rotate mr-1"></i> Try different questions
                            </button>
                        </div>
                    )}

                    <div className="space-y-6">
                        {currentQuiz.map((q, qIdx) => (
                            <div key={qIdx} className={`bg-white dark:bg-gray-800 p-8 rounded-[2rem] shadow-sm border ${quizSubmitted && quizAnswers[qIdx] !== q.correctIndex ? 'border-red-200' : 'border-gray-100 dark:border-gray-700'}`}>
                                <div className="flex items-start gap-4 mb-6">
                                    <span className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-500 flex items-center justify-center font-black text-sm shrink-0">{qIdx + 1}</span>
                                    <p className="text-lg font-bold text-gray-800 dark:text-white leading-tight">{q.question}</p>
                                </div>
                                
                                <div className="grid grid-cols-1 gap-3 ml-12">
                                    {q.options.map((opt, oIdx) => {
                                        let btnClass = "p-4 rounded-xl text-left transition-all border-2 flex items-center justify-between group ";
                                        const isSelected = quizAnswers[qIdx] === oIdx;
                                        const isCorrect = oIdx === q.correctIndex;
                                        
                                        if (!quizSubmitted) {
                                            btnClass += isSelected 
                                                ? "border-lovelya-500 bg-lovelya-50 dark:bg-lovelya-900/20 text-lovelya-700 font-bold" 
                                                : "border-gray-100 dark:border-gray-700 hover:border-lovelya-200 dark:hover:border-gray-600";
                                        } else {
                                            if (isCorrect) btnClass += "border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 font-bold";
                                            else if (isSelected) btnClass += "border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 font-bold";
                                            else btnClass += "border-gray-100 dark:border-gray-700 opacity-50";
                                        }

                                        return (
                                            <button 
                                                key={oIdx} 
                                                disabled={quizSubmitted}
                                                onClick={() => {
                                                    const newAns = [...quizAnswers];
                                                    newAns[qIdx] = oIdx;
                                                    setQuizAnswers(newAns);
                                                }}
                                                className={btnClass}
                                            >
                                                <span>{opt}</span>
                                                {quizSubmitted && isCorrect && <i className="fas fa-check-circle text-green-500"></i>}
                                                {quizSubmitted && isSelected && !isCorrect && <i className="fas fa-times-circle text-red-500"></i>}
                                            </button>
                                        );
                                    })}
                                </div>

                                {quizSubmitted && (
                                    <div className="mt-6 ml-12 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl border-l-4 border-lovelya-400">
                                        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed italic">
                                            <i className="fas fa-info-circle mr-2 text-lovelya-500"></i>
                                            {q.explanation}
                                        </p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {!quizSubmitted && (
                        <button 
                            onClick={handleQuizSubmit}
                            disabled={quizAnswers.includes(-1)}
                            className="w-full py-5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-[2rem] font-black text-xl shadow-xl hover:scale-[1.02] transition disabled:opacity-30 disabled:hover:scale-100"
                        >
                            Submit Quiz
                        </button>
                    )}
                </div>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-10 animate-fade-in pb-20">
      <div className="max-w-2xl mx-auto px-4">
        <button onClick={() => onNavigate?.(AppView.HOME)} className="mb-4 md:mb-6 text-gray-400 hover:text-gray-600 font-bold transition flex items-center gap-2 uppercase text-[10px] md:text-xs tracking-widest">
          <i className="fas fa-arrow-left"></i> Back to Home
        </button>
        <div className="text-center">
          <h2 className="text-2xl md:text-4xl font-black text-gray-800 dark:text-white mb-2 md:mb-4">Grammar Academy</h2>
          <p className="text-xs md:text-base text-gray-500 font-medium mb-6 md:mb-8">Master English structures from A1 up to native-level C2 Mastery.</p>
          <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-md p-1 md:p-1.5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex gap-1 overflow-x-auto no-scrollbar">
             {['All', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map(lvl => (
               <button key={lvl} onClick={() => { setFilterLevel(lvl); setCurrentPage(1); }} className={`px-4 py-2 md:px-6 md:py-2.5 rounded-xl text-[10px] md:text-sm font-black transition-all whitespace-nowrap ${filterLevel === lvl ? 'bg-lovelya-600 text-white shadow-lg' : 'text-gray-500 hover:text-gray-800 dark:hover:text-white'}`}>{lvl}</button>
             ))}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 px-4">
         {paginatedLessons.map((lesson) => (
           <button key={lesson.id} onClick={() => handleSelectLesson(lesson)} className="bg-white dark:bg-gray-800 p-3.5 md:p-8 rounded-2xl md:rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-700 hover:border-lovelya-400 hover:shadow-xl hover:-translate-y-1 transition-all text-left flex flex-col h-full group">
              <div className="w-8 h-8 md:w-14 md:h-14 rounded-lg md:rounded-2xl bg-lovelya-50 dark:bg-lovelya-900/30 text-lovelya-500 flex items-center justify-center text-sm md:text-2xl mb-2 md:mb-6 group-hover:rotate-6 transition-transform"><i className={`fas ${lesson.icon}`}></i></div>
              <span className="text-[7px] md:text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] mb-1 md:mb-2">{lesson.level} Lesson</span>
              <h3 className="text-[11px] md:text-xl font-black text-gray-800 dark:text-white mb-1 md:mb-3 leading-tight group-hover:text-lovelya-600 transition-colors line-clamp-2">{lesson.title}</h3>
              <p className="text-[9px] md:text-sm text-gray-500 dark:text-gray-400 leading-tight md:leading-relaxed mb-3 md:mb-6 flex-1 line-clamp-2 md:line-clamp-3">{lesson.description}</p>
              <div className="flex items-center gap-1 md:gap-2 text-[7px] md:text-xs font-black uppercase tracking-widest text-lovelya-500">Study <span className="hidden md:inline">Lesson</span> <i className="fas fa-arrow-right"></i></div>
           </button>
         ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-8">
          <button 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => prev - 1)}
            className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-center text-gray-500 disabled:opacity-30 transition-all active:scale-90"
          >
            <i className="fas fa-chevron-left"></i>
          </button>
          <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Page {currentPage} of {totalPages}</span>
          <button 
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => prev + 1)}
            className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-center text-gray-500 disabled:opacity-30 transition-all active:scale-90"
          >
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
      )}
    </div>
  );
};

export default GrammarModule;
