
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import Markdown from 'react-markdown';
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
  const [showHint, setShowHint] = useState(false);

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
    // Parse task and hint from AI response
    const parseTaskContent = (text: string) => {
      let taskPart = text;
      let hintPart = "";

      if (text.includes('[TASK]') && text.includes('[HINT]')) {
        const taskMatch = text.match(/\[TASK\]([\s\S]*?)\[HINT\]/);
        const hintMatch = text.match(/\[HINT\]([\s\S]*)/);
        if (taskMatch) taskPart = taskMatch[1].trim();
        if (hintMatch) hintPart = hintMatch[1].trim();
      } else if (text.includes('[TASK]')) {
        taskPart = text.replace('[TASK]', '').trim();
      } else if (text.includes('[HINT]')) {
        const parts = text.split('[HINT]');
        taskPart = parts[0].trim();
        hintPart = parts[1].trim();
      }

      return { task: taskPart, hint: hintPart };
    };

    const taskData = parseTaskContent(grammarTask);

    return (
      <div className="max-w-4xl mx-auto animate-fade-in space-y-4 pb-20">
        {/* Hint Modal */}
        {showHint && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-700 w-full max-w-sm overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
                    <i className="fas fa-lightbulb"></i>
                  </div>
                  <h3 className="text-lg font-black text-gray-800 dark:text-white">Lesson Hint</h3>
                </div>
                <div className="prose dark:prose-invert text-xs md:text-sm text-gray-600 dark:text-gray-400 font-medium leading-relaxed">
                  <Markdown>{taskData.hint || "Try looking back at the lesson content for examples. Keep your sentences simple and focus on the grammar point!"}</Markdown>
                </div>
                <button
                  onClick={() => setShowHint(false)}
                  className="w-full mt-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-black text-sm uppercase tracking-widest transition active:scale-95"
                >
                  Got it!
                </button>
              </div>
            </motion.div>
          </div>
        )}

        <div className="flex items-center justify-between bg-white/80 dark:bg-gray-800/80 backdrop-blur-md p-2 md:p-3 rounded-xl md:rounded-2xl shadow-sm border border-lovelya-100 dark:border-gray-700 sticky top-0 z-30">
          <button onClick={() => setStep('list')} className="w-7 h-7 md:w-9 md:h-9 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-500 hover:text-gray-800 transition"><i className="fas fa-arrow-left text-xs md:text-sm"></i></button>
          <div className="flex bg-gray-100 dark:bg-gray-700 p-0.5 rounded-xl overflow-x-auto no-scrollbar w-full sm:w-auto">
            <button onClick={() => setActiveTab('explanation')} className={`px-3 py-1.5 md:px-4 md:py-2 rounded-lg text-[9px] md:text-[10px] font-black uppercase transition whitespace-nowrap ${activeTab === 'explanation' ? 'bg-white dark:bg-gray-600 text-lovelya-600 shadow-sm' : 'text-gray-500'}`}>Study</button>
            {selectedLesson.mindmap && <button onClick={() => setActiveTab('mindmap')} className={`px-3 py-1.5 md:px-4 md:py-2 rounded-lg text-[9px] md:text-[10px] font-black uppercase transition whitespace-nowrap ${activeTab === 'mindmap' ? 'bg-white dark:bg-gray-600 text-lovelya-600 shadow-sm' : 'text-gray-500'}`}>Map</button>}
            <button onClick={() => setActiveTab('practice')} className={`px-3 py-1.5 md:px-4 md:py-2 rounded-lg text-[9px] md:text-[10px] font-black uppercase transition whitespace-nowrap ${activeTab === 'practice' ? 'bg-white dark:bg-gray-600 text-lovelya-600 shadow-sm' : 'text-gray-500'}`}>Practice</button>
            <button onClick={() => setActiveTab('quiz')} className={`px-3 py-1.5 md:px-4 md:py-2 rounded-lg text-[9px] md:text-[10px] font-black uppercase transition whitespace-nowrap ${activeTab === 'quiz' ? 'bg-white dark:bg-gray-600 text-lovelya-600 shadow-sm' : 'text-gray-500'}`}>Quiz</button>
          </div>
          <div className="hidden md:block w-9"></div>
        </div>

        {activeTab === 'explanation' && (
          <div className="space-y-4 md:space-y-6 animate-slide-up">
            <div className="bg-gradient-to-r from-lovelya-600 to-indigo-600 p-3.5 md:p-5 rounded-3xl text-white shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10"><i className={`fas ${selectedLesson.icon} text-3xl md:text-5xl`}></i></div>
              <span className="bg-white/20 backdrop-blur-md px-2 md:px-2.5 py-0.5 rounded-full text-[7px] md:text-[8px] font-black uppercase tracking-widest mb-1.5 inline-block">{selectedLesson.level} Grammar</span>
              <h1 className="text-sm md:text-lg font-black mb-0.5 leading-tight">{selectedLesson.title}</h1>
              <p className="text-lovelya-100 text-[9px] md:text-xs font-medium max-w-xl leading-relaxed">{selectedLesson.description}</p>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {selectedLesson.sections.map((section, idx) => (
                <div key={idx} className="bg-white dark:bg-gray-800 p-3.5 md:p-5 rounded-2xl md:rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
                  <h2 className="text-sm md:text-lg font-black text-gray-800 dark:text-white mb-3 flex items-center gap-2"><span className="w-5 h-5 md:w-6 md:h-6 rounded-md bg-lovelya-50 dark:bg-gray-700 text-lovelya-500 flex items-center justify-center text-[9px] md:text-[10px]">{idx + 1}</span>{section.heading}</h2>
                  <div className="prose dark:prose-invert max-w-none text-[10px] md:text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-4 whitespace-pre-wrap">{section.content}</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {section.examples.map((ex, i) => (
                      <div key={i} className={`p-2.5 md:p-3 rounded-xl border flex gap-3 ${ex.isCorrect ? 'bg-green-50/50 border-green-100' : 'bg-red-50/50 border-red-100'}`}><div className={`w-6 h-6 md:w-7 md:h-7 rounded-lg flex items-center justify-center shrink-0 ${ex.isCorrect ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}><i className={`fas ${ex.isCorrect ? 'fa-check' : 'fa-times'} text-[9px] md:text-xs`}></i></div><div><p className={`text-[10px] md:text-sm font-bold ${ex.isCorrect ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'}`}>{ex.text}</p>{ex.note && <p className="text-[8px] md:text-[10px] mt-0.5 opacity-60 font-medium italic">{ex.note}</p>}</div></div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-3 px-2 md:px-0">
              <button onClick={() => setActiveTab('practice')} className="flex-1 py-3 md:py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl md:rounded-2xl font-black text-xs md:text-base shadow-lg hover:translate-y-[-1px] transition active:scale-95 uppercase tracking-widest">Practice Missions</button>
              <button onClick={() => setActiveTab('quiz')} className="flex-1 py-3 md:py-4 bg-lovelya-600 text-white rounded-xl md:rounded-2xl font-black text-xs md:text-base shadow-lg hover:translate-y-[-1px] transition active:scale-95 uppercase tracking-widest">Take Final Quiz</button>
            </div>
          </div>
        )}

        {activeTab === 'mindmap' && selectedLesson.mindmap && (
          <div className="bg-white dark:bg-gray-800 p-8 rounded-[3rem] shadow-sm border border-gray-100 dark:border-gray-700 min-h-[600px] animate-fade-in overflow-hidden relative"><MindMapRenderer data={selectedLesson.mindmap} /></div>
        )}

        {activeTab === 'practice' && (
          <div className="space-y-6 animate-slide-up max-w-3xl mx-auto">
            <div className="bg-white dark:bg-gray-800 p-5 md:p-7 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 text-purple-600 flex items-center justify-center">
                    <i className="fas fa-pen-nib"></i>
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-gray-800 dark:text-white">Writing Challenge</h3>
                    {taskData.hint && (
                      <button
                        onClick={() => setShowHint(true)}
                        className="text-[10px] font-black text-amber-600 flex items-center gap-1 uppercase tracking-widest hover:underline mt-0.5"
                      >
                        <i className="fas fa-lightbulb"></i> Need a Hint?
                      </button>
                    )}
                  </div>
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
                <div className={`text-gray-700 dark:text-gray-300 font-bold leading-relaxed text-[10px] md:text-sm prose-p:leading-relaxed prose-strong:text-lovelya-600 ${loadingTask ? 'opacity-30' : 'opacity-100'}`}>
                  {loadingTask ? 'AI is crafting a unique prompt for this lesson...' : <Markdown>{taskData.task || "Failed to generate task. Please click regenerate."}</Markdown>}
                </div>
              </div>

              <div className="mt-8 space-y-4">
                <textarea
                  value={userInput}
                  onChange={e => setUserInput(e.target.value)}
                  placeholder="Start writing here..."
                  disabled={loadingTask}
                  className="w-full h-48 p-6 rounded-2xl border-2 border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-lovelya-500 outline-none transition-all text-sm md:text-base leading-relaxed disabled:opacity-50"
                />
                {errorMessage && <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-bold border border-red-100">{errorMessage}</div>}
                <button onClick={handleCheckGrammar} disabled={loading || loadingTask || !userInput.trim()} className="w-full py-4 bg-lovelya-600 text-white rounded-2xl font-black text-lg shadow-lg hover:bg-lovelya-700 transition disabled:opacity-50">{loading ? <><i className="fas fa-circle-notch fa-spin mr-2"></i> Analyzing...</> : 'Check Grammar'}</button>
              </div>
            </div>
            {result && (
              <div className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-3xl shadow-xl border border-lovelya-100 animate-bounce-in space-y-8">
                <div className="flex justify-between items-center pb-6 border-b border-gray-100 dark:border-gray-700"><div className="flex items-center gap-4"><div className="text-5xl font-black text-lovelya-600">{result.score}</div><div><div className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Quality Score</div><div className="text-xs md:text-sm font-bold text-gray-600 dark:text-gray-400">{result.score >= 80 ? 'Excellent!' : result.score >= 60 ? 'Good Progress' : 'Keep Practicing'}</div></div></div><i className="fas fa-award text-4xl text-yellow-400"></i></div>
                <div className="space-y-4"><h4 className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Corrected Text</h4><div className="p-6 bg-green-50 dark:bg-green-900/10 rounded-2xl text-green-800 dark:text-green-200 leading-relaxed font-medium text-[10px] md:text-sm">{result.correctedText}</div></div>
                {result.errors.length > 0 && (<div className="space-y-4"><h4 className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Error Analysis</h4><div className="space-y-3">{result.errors.map((err, i) => (<div key={i} className="p-5 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-700"><div className="flex items-center gap-2 text-red-500 mb-1"><i className="fas fa-times-circle text-xs"></i><span className="text-[8px] md:text-[9px] font-black uppercase tracking-wider">Mistake</span></div><p className="line-through text-gray-400 mb-3 text-[10px] md:text-sm">{err.mistake}</p><div className="flex items-center gap-2 text-green-500 mb-1"><i className="fas fa-check-circle text-xs"></i><span className="text-[8px] md:text-[9px] font-black uppercase tracking-wider">Correction</span></div><p className="font-bold text-gray-800 dark:text-white mb-3 text-[10px] md:text-sm">{err.correction}</p><p className="text-[10px] md:text-sm text-gray-500 italic">{err.explanation}</p></div>))}</div></div>)}
                <div className="p-6 bg-lovelya-50 dark:bg-lovelya-900/20 rounded-2xl"><span className="text-[10px] font-black uppercase text-lovelya-600 tracking-widest block mb-2">Teacher Feedback</span><p className="text-gray-700 dark:text-gray-200 font-medium text-[10px] md:text-sm">{result.generalFeedback}</p></div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'quiz' && (
          <div className="space-y-8 animate-slide-up max-w-3xl mx-auto pb-20">
            {currentQuiz.length === 0 && !quizLoading ? (
              <div className="bg-white dark:bg-gray-800 p-8 md:p-10 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 text-center space-y-6">
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
                  <div className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-3xl shadow-xl border border-lovelya-100 dark:border-gray-700 animate-bounce-in text-center space-y-4">
                    <div className="flex justify-center gap-2">
                      {[...Array(3)].map((_, i) => (
                        <i key={i} className={`fas fa-star text-3xl ${i < Math.round(quizScore / 33) ? 'text-yellow-400' : 'text-gray-200'}`}></i>
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
                    <div key={qIdx} className={`bg-white dark:bg-gray-800 p-5 md:p-7 rounded-3xl shadow-sm border ${quizSubmitted && quizAnswers[qIdx] !== q.correctIndex ? 'border-red-200' : 'border-gray-100 dark:border-gray-700'}`}>
                      <div className="flex items-start gap-4 mb-6">
                        <span className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-500 flex items-center justify-center font-black text-sm shrink-0">{qIdx + 1}</span>
                        <p className="text-sm md:text-base font-bold text-gray-800 dark:text-white leading-tight text-[12px] md:text-[16px]">{q.question}</p>
                      </div>

                      <div className="grid grid-cols-1 gap-3 ml-0 md:ml-12">
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
                              <span className="text-[10px] md:text-sm">{opt}</span>
                              {quizSubmitted && isCorrect && <i className="fas fa-check-circle text-green-500"></i>}
                              {quizSubmitted && isSelected && !isCorrect && <i className="fas fa-times-circle text-red-500"></i>}
                            </button>
                          );
                        })}
                      </div>

                      {quizSubmitted && (
                        <div className="mt-6 ml-12 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl border-l-4 border-lovelya-400">
                          <p className="text-[10px] md:text-sm text-gray-600 dark:text-gray-300 leading-relaxed italic">
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
        <button onClick={() => onNavigate?.(AppView.HOME)} className="mb-4 md:mb-5 text-gray-400 hover:text-gray-600 font-bold transition flex items-center gap-2 uppercase text-[9px] md:text-[10px] tracking-widest">
          <i className="fas fa-arrow-left"></i> Back to Home
        </button>
        <div className="text-center">
          <h2 className="text-sm md:text-lg font-black text-gray-800 dark:text-white mb-1 tracking-tight">Grammar Academy</h2>
          <p className="text-[8px] md:text-[10px] text-gray-400 font-bold mb-4 uppercase tracking-widest">Master English structures with ease</p>
          <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-md p-0.5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex gap-1 overflow-x-auto no-scrollbar justify-center">
            {['All', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map(lvl => (
              <button key={lvl} onClick={() => { setFilterLevel(lvl); setCurrentPage(1); }} className={`px-3 py-1.5 md:px-5 md:py-2 rounded-lg text-[9px] md:text-[11px] font-black transition-all whitespace-nowrap ${filterLevel === lvl ? 'bg-lovelya-600 text-white shadow-md' : 'text-gray-400 hover:text-gray-600'}`}>{lvl}</button>
            ))}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 px-4">
        {paginatedLessons.map((lesson) => (
          <button key={lesson.id} onClick={() => handleSelectLesson(lesson)} className="bg-white dark:bg-gray-800 p-4 md:p-5 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 hover:border-lovelya-400 hover:shadow-lg hover:-translate-y-0.5 transition-all text-left flex flex-col h-full group">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-lovelya-50 dark:bg-lovelya-900/30 text-lovelya-500 flex items-center justify-center text-sm md:text-base mb-3 group-hover:rotate-6 transition-transform"><i className={`fas ${lesson.icon}`}></i></div>
            <span className="text-[8px] md:text-[9px] font-black uppercase text-gray-400 tracking-widest mb-1.5">{lesson.level} Lesson</span>
            <h3 className="text-[11px] md:text-sm font-black text-gray-800 dark:text-white mb-1.5 leading-tight group-hover:text-lovelya-600 transition-colors line-clamp-2">{lesson.title}</h3>
            <p className="text-[9px] md:text-xs text-gray-400 leading-relaxed mb-4 flex-1 line-clamp-2">{lesson.description}</p>
            <div className="flex items-center gap-1.5 text-[8px] md:text-[9px] font-black uppercase tracking-widest text-lovelya-500">Study Now <i className="fas fa-arrow-right"></i></div>
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
