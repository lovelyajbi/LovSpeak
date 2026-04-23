
import React, { useState, useEffect, useRef } from 'react';
import { ModuleProps, AppView } from '../types';
import { getUserProfile, logActivity, getGameProgress, unlockNextLevel } from '../services/storage';
import { generateGameData } from '../services/gemini';
import { audioService } from '../services/audioService';

type GameCategory = 'visual' | 'grammar_strike' | 'odd_one_out' | 'arcade' | 'scramble' | 'knowledge' | 'interpreter' | 'read_aloud';
type GameContext = 'islamic' | 'general';
type GameState = 'menu' | 'levels' | 'context' | 'playing' | 'result' | 'game_over';

interface GameConfig {
    id: GameCategory;
    label: string;
    icon: string;
    desc: string;
    color: string;
}

const GAME_CATEGORIES: GameConfig[] = [
    { id: 'visual', label: 'Emoji Quest', icon: 'fa-icons', desc: 'Guess words from emojis.', color: 'bg-purple-500' },
    { id: 'grammar_strike', label: 'Grammar Strike', icon: 'fa-spell-check', desc: 'Spot and fix errors.', color: 'bg-red-500' },
    { id: 'odd_one_out', label: 'Odd One Out', icon: 'fa-shapes', desc: 'Find the intruder word.', color: 'bg-teal-500' },
    { id: 'read_aloud', label: 'Read Aloud', icon: 'fa-microphone-lines', desc: 'Pronounce challenges.', color: 'bg-cyan-500' },
    { id: 'scramble', label: 'Sentence Builder', icon: 'fa-layer-group', desc: 'Arrange words.', color: 'bg-lovelya-500' },
    { id: 'arcade', label: 'Speed Definer', icon: 'fa-bolt', desc: 'Guess against the clock.', color: 'bg-orange-500' },
    { id: 'interpreter', label: 'The Interpreter', icon: 'fa-language', desc: 'Translate Indonesian to English.', color: 'bg-indigo-500' },
    { id: 'knowledge', label: 'Trivia Master', icon: 'fa-graduation-cap', desc: 'Test your knowledge.', color: 'bg-rose-500' },
];

const MAX_LIVES = 3;
const TIME_LIMIT = 35;
const TOTAL_LEVELS = 20;
const SIMILARITY_THRESHOLD = 0.75; // User requested 75% tolerance

// Helper for Fuzzy Matching (Levenshtein Distance)
const calculateSimilarity = (s1: string, s2: string): number => {
    const normalize = (s: string) => s.toLowerCase().trim().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "").replace(/\s{2,}/g, " ");
    const str1 = normalize(s1);
    const str2 = normalize(s2);

    if (str1 === str2) return 1.0;
    if (str1.length === 0 || str2.length === 0) return 0.0;

    const costs = new Array();
    for (let i = 0; i <= str1.length; i++) {
        let lastValue = i;
        for (let j = 0; j <= str2.length; j++) {
            if (i === 0) costs[j] = j;
            else {
                if (j > 0) {
                    let newValue = costs[j - 1];
                    if (str1.charAt(i - 1) !== str2.charAt(j - 1))
                        newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
                    costs[j - 1] = lastValue;
                    lastValue = newValue;
                }
            }
        }
        if (i > 0) costs[str2.length] = lastValue;
    }
    const distance = costs[str2.length];
    return 1.0 - distance / Math.max(str1.length, str2.length);
};

const isAnswerCorrect = (input: string, target: string, useFuzzy: boolean = false): boolean => {
    if (!input || !target) return false;
    if (useFuzzy) {
        return calculateSimilarity(input, target) >= SIMILARITY_THRESHOLD;
    }
    const normalize = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9]/g, '');
    return normalize(input) === normalize(target);
};

const useSpeechRecognition = () => {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const recognitionRef = useRef<any>(null);

    useEffect(() => {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (SpeechRecognition) {
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.lang = 'en-US';
            recognitionRef.current.continuous = true; // Set to true for toggle mode
            recognitionRef.current.interimResults = true;
            recognitionRef.current.onresult = (e: any) => {
                let current = '';
                for (let i = 0; i < e.results.length; i++) {
                    current += e.results[i][0].transcript;
                }
                setTranscript(current);
            };
            recognitionRef.current.onend = () => setIsListening(false);
            recognitionRef.current.onerror = () => setIsListening(false);
        }
    }, []);

    const startListening = () => {
        if (recognitionRef.current && !isListening) {
            setTranscript('');
            try {
                recognitionRef.current.start();
                setIsListening(true);
            } catch (e) { console.error("Mic start error", e); }
        }
    };
    const stopListening = () => {
        if (recognitionRef.current && isListening) {
            recognitionRef.current.stop();
            setIsListening(false);
        }
    };
    return { isListening, transcript, startListening, stopListening, setTranscript };
};

const GameModule: React.FC<ModuleProps> = ({ onComplete, onNavigate }) => {
    const [gameState, setGameState] = useState<GameState>('menu');
    const [selectedCategory, setSelectedCategory] = useState<GameCategory | null>(null);
    const [selectedLevel, setSelectedLevel] = useState<number>(1);
    const [unlockedLevel, setUnlockedLevel] = useState<number>(1);
    const [selectedContext, setSelectedContext] = useState<GameContext | null>(null);
    const [loading, setLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('AI is generating...');
    const [items, setItems] = useState<any[]>([]);
    const [score, setScore] = useState(0);
    const [currentRound, setCurrentRound] = useState(0);
    const [lives, setLives] = useState(MAX_LIVES);
    const [userInput, setUserInput] = useState('');
    const [feedback, setFeedback] = useState<string | null>(null);
    const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
    const [isCorrect, setIsCorrect] = useState(false);
    const [scrambledWords, setScrambledWords] = useState<string[]>([]);
    const [scrambleAnswer, setScrambleAnswer] = useState<string[]>([]);

    const { isListening, transcript, startListening, stopListening, setTranscript } = useSpeechRecognition();

    // Pagination for Levels
    const [currentLevelPage, setCurrentLevelPage] = useState(1);
    const levelsPerPage = 10;
    const totalLevelPages = Math.ceil(TOTAL_LEVELS / levelsPerPage);

    // --- PERSISTENCE LOGIC ---
    useEffect(() => {
        const savedState = localStorage.getItem('lovspeak_state_games');
        if (savedState) {
            try {
                const state = JSON.parse(savedState);
                // We only persist navigation states, not active gameplay for safety with timers
                if (state.gameState !== 'playing') {
                    setGameState(state.gameState || 'menu');
                } else {
                    setGameState('levels'); // Fallback to levels if they were playing
                }
                setSelectedCategory(state.selectedCategory || null);
                setSelectedLevel(state.selectedLevel || 1);
                setSelectedContext(state.selectedContext || null);
                setCurrentLevelPage(state.currentLevelPage || 1);
            } catch (e) {
                console.error("Failed to load games state", e);
            }
        }
    }, []);

    useEffect(() => {
        const stateToSave = {
            gameState: gameState === 'playing' ? 'levels' : gameState, // Don't save 'playing' state
            selectedCategory, selectedLevel, selectedContext, currentLevelPage
        };
        localStorage.setItem('lovspeak_state_games', JSON.stringify(stateToSave));
    }, [gameState, selectedCategory, selectedLevel, selectedContext, currentLevelPage]);

    // Keyboard shortcut for Spacebar
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.code === 'Space' && ['interpreter', 'read_aloud'].includes(selectedCategory || '') && gameState === 'playing' && !feedback) {
                e.preventDefault();
                if (isListening) stopListening();
                else startListening();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedCategory, gameState, isListening, feedback]);

    useEffect(() => {
        let timer: any;
        if (gameState === 'playing' && !feedback && timeLeft > 0) {
            timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
        } else if (gameState === 'playing' && !feedback && timeLeft === 0) {
            handleAnswer(false, "Time's up!");
        }
        return () => clearInterval(timer);
    }, [timeLeft, feedback, gameState]);

    useEffect(() => {
        if (['interpreter', 'read_aloud'].includes(selectedCategory || '') && transcript) {
            setUserInput(transcript);
            const currentItem = items[currentRound];
            if (!currentItem) return;
            const target = selectedCategory === 'interpreter' ? currentItem.english : currentItem.text;

            // Use fuzzy matching for voice categories with 75% threshold
            if (isAnswerCorrect(transcript, target, true)) {
                stopListening();
                handleAnswer(true);
            }
        }
    }, [transcript]);

    useEffect(() => {
        if (selectedCategory && selectedContext && gameState === 'levels') {
            setUnlockedLevel(getGameProgress(selectedCategory, selectedContext));
        }
    }, [selectedCategory, selectedContext, gameState]);

    const startGame = async (level: number) => {
        if (!selectedCategory || !selectedContext) return;

        const contextText = selectedContext === 'islamic' ? 'halal challenges' : 'general puzzles';
        setLoadingMessage(`Curating ${contextText} for Level ${level}...`);
        setLoading(true);
        setSelectedLevel(level);

        try {
            const messages = [
                `Connecting to Gemini...`,
                `Structuring vocabulary for Level ${level}...`,
                `AI is thinking deeply...`,
                `Synthesizing ${selectedContext === 'islamic' ? 'Islamic' : 'educational'} content...`,
                `Verifying linguistic accuracy...`,
                `Finalizing your custom challenge...`
            ];
            let msgIdx = 0;
            const msgInterval = setInterval(() => {
                msgIdx = (msgIdx + 1) % messages.length;
                setLoadingMessage(messages[msgIdx]);
            }, 2500);

            const data = await generateGameData(selectedCategory, selectedContext, level, 10);

            clearInterval(msgInterval);

            if (!data || data.length === 0) {
                throw new Error("No game data received");
            }

            setItems(data);
            setGameState('playing');
            setCurrentRound(0);
            setScore(0);
            setLives(MAX_LIVES);
            prepareRound(data, 0);
        } catch (e) {
            console.error("Game load error:", e);
            alert("Failed to load game data. Check your API connection and try again.");
            setGameState('levels');
        } finally {
            setLoading(false);
        }
    };

    const prepareRound = (gameItems: any[], roundIdx: number) => {
        const item = gameItems[roundIdx];
        if (!item) return;

        setTimeLeft(TIME_LIMIT);
        setFeedback(null);
        setUserInput('');
        setIsCorrect(false);
        setTranscript('');

        if (selectedCategory === 'scramble' && item.sentence) {
            const words = item.sentence.split(/\s+/);
            setScrambledWords([...words].sort(() => Math.random() - 0.5));
            setScrambleAnswer([]);
        }

        if (selectedCategory === 'knowledge' && item.options) {
            const targetAnswer = item.options[item.correctIndex];
            const newOptions = [...item.options].sort(() => Math.random() - 0.5);
            item.options = newOptions;
            item.correctIndex = newOptions.indexOf(targetAnswer);
        }

        if (selectedCategory === 'odd_one_out' && item.words) {
            const targetAnswer = item.words[item.intruder_index];
            const newWords = [...item.words].sort(() => Math.random() - 0.5);
            item.words = newWords;
            item.intruder_index = newWords.indexOf(targetAnswer);
        }
    };

    const handleAnswer = (correct: boolean, errorMsg: string = 'Incorrect!') => {
        if (feedback) return;
        if (correct) {
            setScore(s => s + 10 + timeLeft);
            setFeedback('Correct!');
            setIsCorrect(true);
        } else {
            const newLives = lives - 1;
            setLives(newLives);
            setFeedback(errorMsg);
            setIsCorrect(false);
            if (newLives <= 0) {
                setTimeout(() => setGameState('game_over'), 2000);
                return;
            }
        }
        setTimeout(() => nextRound(), 1500);
    };

    const nextRound = () => {
        if (currentRound < items.length - 1) {
            const nextIdx = currentRound + 1;
            setCurrentRound(nextIdx);
            prepareRound(items, nextIdx);
        } else {
            setGameState('result');
            if (lives >= 1 && selectedCategory && selectedContext) {
                unlockNextLevel(selectedCategory, selectedContext, selectedLevel);
            }
            logActivity({
                type: AppView.GAMES,
                date: new Date().toISOString(),
                durationSeconds: (10 - lives) * 30,
                score: score,
                accuracy: Math.round((score / (items.length * 40)) * 100),
                details: `Game: ${selectedCategory} | Level ${selectedLevel} (${selectedContext})`
            });
            if (onComplete) onComplete();
        }
    };

    const addScrambleWord = (word: string, idx: number) => {
        const newScramble = [...scrambledWords];
        newScramble.splice(idx, 1);
        setScrambledWords(newScramble);
        const newAns = [...scrambleAnswer, word];
        setScrambleAnswer(newAns);

        if (newScramble.length === 0) {
            const final = newAns.join(' ');
            handleAnswer(isAnswerCorrect(final, items[currentRound].sentence));
        }
    };

    const undoScramble = () => {
        if (scrambleAnswer.length === 0) return;
        const last = scrambleAnswer[scrambleAnswer.length - 1];
        setScrambleAnswer(scrambleAnswer.slice(0, -1));
        setScrambledWords([...scrambledWords, last]);
    };

    const toggleMic = () => {
        if (isListening) stopListening();
        else startListening();
    };

    const GameHeader = () => (
        <div className="flex justify-between items-center mb-6 bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-3">
                <button onClick={() => setGameState('levels')} className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-400 hover:text-red-500 transition flex items-center justify-center"><i className="fas fa-times"></i></button>
                <div className="text-left">
                    <div className="text-[9px] text-gray-400 uppercase font-black tracking-widest leading-none">Level {selectedLevel}</div>
                    <div className="font-black text-lg text-gray-800 dark:text-white leading-none mt-1">{currentRound + 1}/{items.length}</div>
                </div>
            </div>
            <div className="text-center">
                <div className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Score</div>
                <div className="font-black text-xl text-lovelya-600">{score}</div>
            </div>
            <div className="flex items-center gap-4">
                <div className={`font-black text-xl w-10 text-center ${timeLeft <= 5 ? 'text-red-500 animate-pulse' : 'text-gray-800 dark:text-white'}`}>{timeLeft}s</div>
                <div className="flex gap-1">
                    {[...Array(MAX_LIVES)].map((_, i) => <i key={i} className={`fas fa-heart text-lg ${i < lives ? 'text-red-500' : 'text-gray-200 dark:text-gray-700'}`}></i>)}
                </div>
            </div>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto min-h-[70vh] relative">
            {loading && (
                <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl animate-fade-in px-6">
                    <div className="relative">
                        <div className="w-40 h-40 rounded-full bg-lovelya-100 dark:bg-lovelya-900/40 flex items-center justify-center animate-pulse shadow-inner">
                            <i className="fas fa-wand-magic-sparkles text-6xl text-lovelya-600 drop-shadow-lg"></i>
                        </div>
                        <div className="absolute -inset-4 w-48 h-48 rounded-full border-4 border-t-lovelya-600 border-r-transparent border-b-lovelya-400 border-l-transparent animate-spin-slow"></div>
                    </div>

                    <div className="mt-12 text-center space-y-4 max-w-sm">
                        <h3 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight animate-bounce-in">{loadingMessage}</h3>
                        <p className="text-gray-500 dark:text-gray-400 font-medium italic">Our AI Tutor is crafting a personalized lesson just for you...</p>
                    </div>
                </div>
            )}

            {gameState === 'menu' && (
                <div className="animate-fade-in py-6 md:py-10">
                    <button onClick={() => onNavigate?.(AppView.HOME)} className="mb-4 md:mb-6 text-gray-400 hover:text-gray-600 font-bold transition flex items-center gap-2 mx-auto uppercase text-[10px] md:text-xs tracking-widest">
                        <i className="fas fa-arrow-left"></i> Back to Home
                    </button>
                    <h2 className="text-xl md:text-4xl font-black text-gray-900 dark:text-white mb-1 md:mb-2 text-center">Game Center</h2>
                    <p className="text-[10px] md:text-base text-gray-500 text-center mb-6 md:mb-10 font-medium px-4">Challenge yourself and unlock all levels!</p>
                    <div className="grid grid-cols-2 gap-2.5 md:gap-5 px-3 md:px-4">
                        {GAME_CATEGORIES.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => {
                                    audioService.play('tap');
                                    setSelectedCategory(cat.id);
                                    setGameState('context');
                                }}
                                className="bg-white dark:bg-gray-800 p-3.5 md:p-6 rounded-2xl md:rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-xl hover:scale-[1.02] transition-all group text-left flex flex-col h-full"
                            >
                                <div className={`w-9 h-9 md:w-14 md:h-14 rounded-xl md:rounded-2xl ${cat.color} flex items-center justify-center text-white text-base md:text-2xl mb-2.5 md:mb-5 shadow-lg group-hover:rotate-6 transition-transform shrink-0`}><i className={`fas ${cat.icon}`}></i></div>
                                <h3 className="text-[11px] md:text-xl font-bold text-gray-800 dark:text-white mb-0.5 md:mb-2 line-clamp-1">{cat.label}</h3>
                                <p className="text-[9px] md:text-sm text-gray-500 dark:text-gray-400 leading-tight md:leading-relaxed mb-1 md:mb-4 flex-1 line-clamp-2">{cat.desc}</p>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {gameState === 'context' && selectedCategory && (
                <div className="flex flex-col items-center justify-center min-h-[60vh] animate-slide-up text-center px-4">
                    <button onClick={() => setGameState('menu')} className="mb-4 md:mb-6 text-gray-400 hover:text-gray-600 font-bold transition flex items-center gap-2 mx-auto uppercase text-[10px] md:text-xs tracking-widest"><i className="fas fa-arrow-left"></i> Back to Games</button>
                    <h2 className="text-2xl md:text-3xl font-black mb-1.5 md:mb-2 text-gray-800 dark:text-white">{GAME_CATEGORIES.find(c => c.id === selectedCategory)?.label}</h2>
                    <p className="text-xs md:text-base text-gray-500 mb-8 md:mb-10">Choose your track to begin the journey.</p>
                    <div className="flex flex-col sm:flex-row gap-4 md:gap-6 w-full max-w-xl">
                        <button
                            onClick={() => {
                                audioService.play('tap');
                                setSelectedContext('islamic');
                                setGameState('levels');
                            }}
                            className="flex-1 p-6 md:p-10 bg-lovelya-50 dark:bg-lovelya-900/10 rounded-3xl md:rounded-[3rem] border-2 border-lovelya-100 dark:border-lovelya-800 hover:border-lovelya-500 transition-all group shadow-sm hover:shadow-xl"
                        >
                            <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-white dark:bg-gray-800 text-lovelya-500 flex items-center justify-center text-xl md:text-3xl mx-auto mb-3 md:mb-4 shadow-sm group-hover:scale-110 transition"><i className="fas fa-mosque"></i></div>
                            <span className="font-bold text-base md:text-xl text-lovelya-800 dark:text-lovelya-300">Islamic Track</span>
                            <p className="text-[10px] md:text-xs text-lovelya-600/60 mt-1 md:mt-2 font-medium">20 Levels of Faith-based Learning</p>
                        </button>
                        <button
                            onClick={() => {
                                audioService.play('tap');
                                setSelectedContext('general');
                                setGameState('levels');
                            }}
                            className="flex-1 p-6 md:p-10 bg-blue-50 dark:bg-blue-900/10 rounded-3xl md:rounded-[3rem] border-2 border-blue-100 dark:border-blue-800 hover:border-blue-500 transition-all group shadow-sm hover:shadow-xl"
                        >
                            <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-white dark:bg-gray-800 text-blue-500 flex items-center justify-center text-xl md:text-3xl mx-auto mb-3 md:mb-4 shadow-sm group-hover:scale-110 transition"><i className="fas fa-globe"></i></div>
                            <span className="font-bold text-base md:text-xl text-blue-800 dark:text-blue-300">General Track</span>
                            <p className="text-[10px] md:text-xs text-blue-600/60 mt-1 md:mt-2 font-medium">20 Levels of Everyday English</p>
                        </button>
                    </div>
                </div>
            )}

            {gameState === 'levels' && selectedCategory && selectedContext && (
                <div className="animate-fade-in py-6 md:py-10 text-center">
                    <button onClick={() => setGameState('context')} className="mb-4 md:mb-6 text-gray-400 hover:text-gray-600 font-bold transition flex items-center gap-2 mx-auto uppercase text-[10px] md:text-xs tracking-widest"><i className="fas fa-arrow-left"></i> Back to Theme Selection</button>
                    <div className="flex items-center justify-center gap-2 md:gap-3 mb-1.5 md:mb-2">
                        <i className={`fas ${selectedContext === 'islamic' ? 'fa-mosque text-lovelya-500' : 'fa-globe text-blue-500'} text-lg md:text-xl`}></i>
                        <h2 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white">
                            {GAME_CATEGORIES.find(c => c.id === selectedCategory)?.label}
                        </h2>
                    </div>
                    <p className="text-[10px] md:text-sm text-gray-500 mb-6 md:mb-8 font-medium capitalize">{selectedContext} Track Progression</p>

                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2.5 md:gap-3 max-w-2xl mx-auto px-4">
                        {[...Array(TOTAL_LEVELS)].slice((currentLevelPage - 1) * levelsPerPage, currentLevelPage * levelsPerPage).map((_, i) => {
                            const levelNum = ((currentLevelPage - 1) * levelsPerPage) + i + 1;
                            const isLocked = levelNum > unlockedLevel;
                            const isCompleted = levelNum < unlockedLevel;

                            return (
                                <button
                                    key={levelNum}
                                    disabled={isLocked}
                                    onClick={() => {
                                        audioService.play('tap');
                                        startGame(levelNum);
                                    }}
                                    className={`aspect-square relative flex flex-col items-center justify-center rounded-2xl md:rounded-3xl transition-all shadow-sm group overflow-hidden
                                ${isLocked ? 'bg-gray-100 dark:bg-gray-800 text-gray-300' :
                                            isCompleted ? 'bg-white dark:bg-gray-700 border-2 border-lovelya-200 dark:border-lovelya-800' :
                                                'bg-white dark:bg-gray-700 hover:scale-105 hover:shadow-xl border-2 border-transparent hover:border-lovelya-500'}
                            `}
                                >
                                    {isLocked ? (
                                        <i className="fas fa-lock text-xl md:text-2xl opacity-50"></i>
                                    ) : (
                                        <>
                                            <span className={`text-lg md:text-2xl font-black ${isCompleted ? 'text-lovelya-500' : 'text-gray-800 dark:text-white'}`}>{levelNum}</span>
                                            {isCompleted && (
                                                <div className="absolute top-2 right-2">
                                                    <i className="fas fa-check-circle text-lovelya-500 text-[8px] md:text-xs"></i>
                                                </div>
                                            )}
                                        </>
                                    )}

                                    {/* Reward Indicator */}
                                    {[5, 10, 20].includes(levelNum) && (
                                        <div className={`absolute bottom-2 text-[7px] md:text-[8px] font-black uppercase tracking-tighter ${isLocked ? 'text-gray-400' : 'text-lovelya-500'}`}>
                                            <i className="fas fa-medal mr-0.5 md:mr-1"></i> Reward
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {totalLevelPages > 1 && (
                        <div className="flex items-center justify-center gap-4 mt-6 md:mt-8">
                            <button
                                disabled={currentLevelPage === 1}
                                onClick={() => setCurrentLevelPage(prev => prev - 1)}
                                className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-center text-gray-500 disabled:opacity-30 transition-all active:scale-90"
                            >
                                <i className="fas fa-chevron-left text-sm"></i>
                            </button>
                            <span className="text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-widest">Page {currentLevelPage} of {totalLevelPages}</span>
                            <button
                                disabled={currentLevelPage === totalLevelPages}
                                onClick={() => setCurrentLevelPage(prev => prev + 1)}
                                className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-center text-gray-500 disabled:opacity-30 transition-all active:scale-90"
                            >
                                <i className="fas fa-chevron-right text-sm"></i>
                            </button>
                        </div>
                    )}
                </div>
            )}

            {gameState === 'playing' && items[currentRound] && (
                <div className="min-h-[70vh] flex flex-col py-6">
                    <GameHeader />
                    <div className="flex-1 flex flex-col items-center justify-center text-center w-full px-4">
                        {feedback ? (
                            <div className={`animate-bounce-in text-center space-y-4`}>
                                <div className={`text-6xl font-black ${isCorrect ? 'text-green-500' : 'text-red-500'}`}>
                                    {isCorrect ? <i className="fas fa-check-circle"></i> : <i className="fas fa-times-circle"></i>}
                                </div>
                                <div className={`text-3xl font-black ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>{feedback}</div>
                                {!isCorrect && (
                                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700">
                                        <p className="text-sm text-gray-500 uppercase font-black tracking-widest mb-1">Correct Answer</p>
                                        <p className="text-xl font-bold text-gray-800 dark:text-white">
                                            {selectedCategory === 'visual' ? items[currentRound].answer :
                                                selectedCategory === 'knowledge' ? items[currentRound].options[items[currentRound].correctIndex] :
                                                    selectedCategory === 'grammar_strike' ? items[currentRound].correction :
                                                        selectedCategory === 'odd_one_out' ? items[currentRound].words[items[currentRound].intruder_index] :
                                                            selectedCategory === 'arcade' ? items[currentRound].word :
                                                                selectedCategory === 'scramble' ? items[currentRound].sentence :
                                                                    selectedCategory === 'interpreter' ? items[currentRound].english :
                                                                        items[currentRound].text}
                                        </p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="w-full max-w-2xl animate-fade-in space-y-8">
                                {selectedCategory === 'visual' && (
                                    <>
                                        <div className="text-6xl md:text-8xl py-8 md:py-12 bg-white dark:bg-gray-800 rounded-2xl md:rounded-[3rem] shadow-sm border border-gray-100 dark:border-gray-700 w-full">{items[currentRound].emojis}</div>
                                        <p className="text-lovelya-500 font-bold italic text-xs md:text-base">Hint: {items[currentRound].clue}</p>
                                        <input autoFocus value={userInput} onChange={e => setUserInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAnswer(isAnswerCorrect(userInput, items[currentRound].answer))} className="w-full p-3.5 md:p-5 text-center text-xl md:text-3xl font-bold rounded-2xl md:rounded-3xl border-4 border-lovelya-100 focus:border-lovelya-500 outline-none transition-all dark:bg-gray-900" placeholder="Type answer..." />
                                    </>
                                )}

                                {selectedCategory === 'knowledge' && (
                                    <>
                                        <div className="p-4 md:p-6 bg-rose-50 dark:bg-rose-900/10 rounded-2xl md:rounded-[2.5rem] text-base md:text-xl font-bold text-rose-900 dark:text-rose-200 border border-rose-100 dark:border-rose-800">{items[currentRound].question}</div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 md:gap-4 w-full">
                                            {items[currentRound].options.map((opt: string, idx: number) => (
                                                <button key={idx} onClick={() => handleAnswer(idx === items[currentRound].correctIndex)} className="p-3 md:p-4 rounded-xl md:rounded-2xl font-bold border-2 border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-all text-xs md:text-base">{opt}</button>
                                            ))}
                                        </div>
                                    </>
                                )}

                                {selectedCategory === 'grammar_strike' && (
                                    <>
                                        <div className="p-4 md:p-6 bg-red-50 dark:bg-red-900/10 rounded-2xl md:rounded-[2.5rem] border border-red-100 dark:border-red-900">
                                            <p className="text-[8px] md:text-[10px] font-black uppercase text-red-400 mb-1.5 md:mb-2 tracking-widest">Find and fix the error</p>
                                            <p className="text-base md:text-xl font-bold text-gray-800 dark:text-white italic">"{items[currentRound].sentence_with_error}"</p>
                                        </div>
                                        <input autoFocus value={userInput} onChange={e => setUserInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAnswer(isAnswerCorrect(userInput, items[currentRound].correction))} className="w-full p-3 md:p-4 text-center text-base md:text-xl font-bold rounded-2xl md:rounded-3xl border-4 border-red-100 focus:border-red-500 outline-none transition-all dark:bg-gray-900" placeholder="Type the correct sentence..." />
                                    </>
                                )}

                                {selectedCategory === 'odd_one_out' && (
                                    <>
                                        <h3 className="text-xl md:text-2xl font-black text-gray-800 dark:text-white">Which one doesn't fit?</h3>
                                        <div className="grid grid-cols-2 gap-2.5 md:gap-4 w-full">
                                            {items[currentRound].words.map((word: string, idx: number) => (
                                                <button key={idx} onClick={() => handleAnswer(idx === items[currentRound].intruder_index)} className="aspect-square flex items-center justify-center p-3 md:p-4 rounded-2xl md:rounded-3xl bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 hover:border-teal-500 text-base md:text-xl font-bold shadow-sm transition-all">{word}</button>
                                            ))}
                                        </div>
                                    </>
                                )}

                                {selectedCategory === 'arcade' && (
                                    <>
                                        <div className="p-5 md:p-8 bg-orange-50 dark:bg-orange-900/10 rounded-2xl md:rounded-[3rem] border border-orange-100 dark:border-orange-800">
                                            <p className="text-lg md:text-xl font-bold text-orange-900 dark:text-orange-200 leading-relaxed">{items[currentRound].definition}</p>
                                        </div>
                                        <input autoFocus value={userInput} onChange={e => setUserInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAnswer(isAnswerCorrect(userInput, items[currentRound].word))} className="w-full p-3.5 md:p-5 text-center text-xl md:text-3xl font-black rounded-2xl md:rounded-3xl border-4 border-orange-100 focus:border-orange-500 outline-none transition-all dark:bg-gray-900" placeholder="The word is..." />
                                    </>
                                )}

                                {selectedCategory === 'scramble' && (
                                    <div className="space-y-10 w-full">
                                        <div className="min-h-[120px] flex flex-wrap justify-center gap-2 p-6 bg-gray-50 dark:bg-gray-800/50 rounded-[2.5rem] border-2 border-dashed border-gray-200 dark:border-gray-700 relative">
                                            {scrambleAnswer.map((word, idx) => (
                                                <div key={idx} className="bg-green-500 text-white px-4 py-2 rounded-xl font-bold shadow-md animate-bounce-in">{word}</div>
                                            ))}
                                            {scrambleAnswer.length > 0 && (
                                                <button onClick={undoScramble} className="absolute -bottom-4 right-6 w-8 h-8 rounded-full bg-white dark:bg-gray-700 shadow-md flex items-center justify-center text-gray-400 hover:text-red-500 transition"><i className="fas fa-undo text-xs"></i></button>
                                            )}
                                        </div>
                                        <div className="flex flex-wrap justify-center gap-3">
                                            {scrambledWords.map((word, idx) => (
                                                <button key={idx} onClick={() => addScrambleWord(word, idx)} className="px-5 py-3 rounded-2xl bg-white dark:bg-gray-700 border-2 border-gray-100 dark:border-gray-600 hover:border-lovelya-500 hover:scale-105 font-bold shadow-sm transition-all">{word}</button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {['interpreter', 'read_aloud'].includes(selectedCategory!) && (
                                    <>
                                        <div className="p-10 bg-indigo-50 dark:bg-indigo-900/10 rounded-[3rem] border border-indigo-100 dark:border-indigo-800 w-full">
                                            <p className="text-[10px] font-black uppercase text-indigo-400 mb-3 tracking-widest">{selectedCategory === 'interpreter' ? 'Translate to English' : 'Read Clearly'}</p>
                                            <p className="text-3xl font-black text-gray-800 dark:text-white leading-tight">
                                                {selectedCategory === 'interpreter' ? items[currentRound].indonesian : items[currentRound].text}
                                            </p>
                                        </div>

                                        <div className="flex flex-col items-center gap-6">
                                            <div className="relative">
                                                {isListening && <div className="absolute inset-0 rounded-full bg-indigo-500 animate-ping opacity-25"></div>}
                                                <button
                                                    onClick={toggleMic}
                                                    className={`w-24 h-24 rounded-full flex items-center justify-center text-3xl shadow-xl transition-all relative z-10 ${isListening ? 'bg-indigo-600 text-white ring-8 ring-indigo-500/20' : 'bg-white dark:bg-gray-800 text-indigo-500 border-2 border-indigo-100'}`}
                                                >
                                                    <i className={`fas ${isListening ? 'fa-stop' : 'fa-microphone'}`}></i>
                                                </button>
                                            </div>
                                            <div className="space-y-2">
                                                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">{isListening ? 'Listening (Click to Stop)' : 'Click or Press Space to Speak'}</p>
                                                <div className="min-h-[40px] px-6 py-3 bg-white dark:bg-gray-800 rounded-full border border-gray-100 dark:border-gray-700 text-lg font-bold text-indigo-600">
                                                    {userInput || '...'}
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}

                                {selectedCategory !== 'scramble' && !['interpreter', 'read_aloud'].includes(selectedCategory!) && (
                                    <button onClick={() => handleAnswer(isAnswerCorrect(userInput, selectedCategory === 'visual' ? items[currentRound].answer : items[currentRound].word || items[currentRound].correction))} className={`px-12 py-4 rounded-2xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-black shadow-xl hover:scale-105 transition-all ${!userInput.trim() ? 'opacity-20 pointer-events-none' : ''}`}>Submit Answer</button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )
            }

            {
                gameState === 'result' && (
                    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-bounce-in space-y-6">
                        <div className="text-9xl">🏆</div>
                        <h2 className="text-5xl font-black text-gray-900 dark:text-white mb-2">Victory!</h2>
                        <div className="bg-lovelya-50 dark:bg-lovelya-900/20 p-8 rounded-[3rem] border border-lovelya-100 dark:border-lovelya-800">
                            <p className="text-7xl font-black text-lovelya-600">{score}</p>
                        </div>
                        <button onClick={() => setGameState('menu')} className="px-8 py-5 bg-gray-100 dark:bg-gray-800 text-gray-600 rounded-3xl font-bold transition">All Games</button>
                    </div>
                )
            }

            {
                gameState === 'game_over' && (
                    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-bounce-in space-y-6">
                        <div className="text-9xl">💔</div>
                        <h2 className="text-5xl font-black text-red-600 mb-2">Game Over</h2>
                        <div className="flex gap-4">
                            <button onClick={() => setGameState('menu')} className="px-10 py-5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-3xl font-black text-lg transition">Main Menu</button>
                            <button onClick={() => startGame(selectedLevel)} className="px-10 py-5 bg-red-600 text-white rounded-3xl font-black text-lg shadow-xl hover:bg-red-700 transition transform hover:-translate-y-1">Try Again</button>
                        </div>
                    </div>
                )
            }
        </div >
    );
};
export default GameModule;
