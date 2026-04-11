
import React, { useState, useEffect, useRef } from 'react';
import { DiaryEntry, ModuleProps, GrammarResult, AppView } from '../types';
import { getDiaryEntries, saveDiaryEntry, updateDiaryEntry, deleteDiaryEntry, getUserProfile, logActivity } from '../services/storage';
import { audioService } from '../services/audioService';
import { analyzeDiaryEntry } from '../services/gemini';

const DiaryModule: React.FC<ModuleProps> = ({ onComplete, onNavigate }) => {
    const [entries, setEntries] = useState<DiaryEntry[]>([]);
    const [view, setView] = useState<'list' | 'editor'>('list');
    const [activeEntry, setActiveEntry] = useState<DiaryEntry | null>(null);
    const [feedback, setFeedback] = useState<GrammarResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const userProfile = getUserProfile();

    // --- PERSISTENCE LOGIC ---
    useEffect(() => {
        const savedState = localStorage.getItem('lovspeak_state_diary');
        if (savedState) {
            try {
                const state = JSON.parse(savedState);
                setView(state.view || 'list');
                setActiveEntry(state.activeEntry || null);
                setFeedback(state.feedback || null);
            } catch (e) {
                console.error("Failed to load diary state", e);
            }
        }
    }, []);

    useEffect(() => {
        const stateToSave = { view, activeEntry, feedback };
        localStorage.setItem('lovspeak_state_diary', JSON.stringify(stateToSave));
    }, [view, activeEntry, feedback]);

    useEffect(() => {
        refreshEntries();
    }, []);

    const refreshEntries = () => {
        setEntries(getDiaryEntries());
    };

    const handleNewEntry = () => {
        const newEntry: DiaryEntry = {
            id: `diary-${Date.now()}`,
            date: new Date().toISOString(),
            title: '',
            content: ''
        };
        setActiveEntry(newEntry);
        setFeedback(null);
        setView('editor');
    };

    const handleSelectEntry = (entry: DiaryEntry) => {
        audioService.play('nav');
        setActiveEntry(entry);
        setFeedback(null);
        setView('editor');
    };

    const handleSave = () => {
        if (!activeEntry) return;
        audioService.play('success');
        setIsSaving(true);
        
        // Logika hapus otomatis jika kosong ditangani di storage service
        updateDiaryEntry(activeEntry);
        
        // Jika teks kosong, kembali ke list karena file terhapus
        if (!activeEntry.title.trim() && !activeEntry.content.trim()) {
            setView('list');
        }
        
        refreshEntries();
        setTimeout(() => setIsSaving(false), 500);
    };

    const handleCheck = async () => {
        if (!activeEntry || !activeEntry.content.trim()) return;
        setIsLoading(true);
        setFeedback(null);
        try {
            const result = await analyzeDiaryEntry(activeEntry.content, userProfile.level);
            setFeedback(result);
            
            logActivity({
                type: AppView.DIARY,
                date: new Date().toISOString(),
                durationSeconds: 300, 
                score: result.score,
                accuracy: result.score,
                details: `Reviewed Diary: ${activeEntry.title || 'Untitled'}`
            });

            if (onComplete && result.score >= 70) onComplete();
        } catch (e) {
            alert("Gagal menganalisis teks. Coba lagi.");
        } finally {
            setIsLoading(false);
        }
    };

    if (view === 'list') {
        return (
            <div className="max-w-4xl mx-auto animate-fade-in px-2 md:px-0">
                <button onClick={() => onNavigate?.(AppView.HOME)} className="mb-4 md:mb-6 text-gray-400 hover:text-gray-600 font-bold transition flex items-center gap-2 uppercase text-[10px] md:text-xs tracking-widest">
                    <i className="fas fa-arrow-left"></i> Back to Home
                </button>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 gap-4">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-black text-gray-800 dark:text-white">My Spiritual Diary</h2>
                        <p className="text-sm md:text-base text-gray-500 font-medium">Record your daily journey and perfect your English.</p>
                    </div>
                    <button 
                        onClick={handleNewEntry}
                        className="w-full md:w-auto bg-lovelya-600 text-white px-6 py-3 rounded-2xl font-black shadow-lg hover:bg-lovelya-700 transition transform hover:-translate-y-1 flex items-center justify-center gap-2 text-sm md:text-base"
                    >
                        <i className="fas fa-plus"></i> New Entry
                    </button>
                </div>

                {/* BACKUP REMINDER */}
                <div className="bg-lovelya-50 dark:bg-lovelya-900/20 border border-lovelya-200 dark:border-lovelya-800 p-3 md:p-4 rounded-2xl mb-6 md:mb-8 flex items-center gap-3 md:gap-4">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-lovelya-100 dark:bg-lovelya-800 text-lovelya-600 flex items-center justify-center shrink-0 text-sm md:text-base">
                        <i className="fas fa-cloud-upload-alt"></i>
                    </div>
                    <p className="text-[10px] md:text-sm text-lovelya-800 dark:text-lovelya-300 font-bold leading-relaxed">
                        Penting: Selalu backup data Anda secara berkala di menu <span className="underline">Profil</span> agar catatan dapat dipulihkan jika aplikasi terhapus.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                    {entries.map(entry => (
                        <div 
                            key={entry.id}
                            onClick={() => handleSelectEntry(entry)}
                            className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-2xl md:rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-xl hover:border-lovelya-300 transition-all group cursor-pointer"
                        >
                            <div className="flex justify-between items-start mb-3 md:mb-4">
                                <div className="text-[8px] md:text-[10px] font-black text-lovelya-500 uppercase tracking-[0.1em] md:tracking-[0.2em] bg-lovelya-50 dark:bg-lovelya-900/30 px-2.5 py-1 rounded-full">
                                    {new Date(entry.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                                </div>
                            </div>
                            <h3 className="text-lg md:text-xl font-bold text-gray-800 dark:text-white mb-1 md:mb-2 line-clamp-1">{entry.title || 'Untitled Entry'}</h3>
                            <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">{entry.content || 'Belum ada isi...'}</p>
                        </div>
                    ))}
                    {entries.length === 0 && (
                        <div className="col-span-full py-12 md:py-20 text-center bg-white dark:bg-gray-800 rounded-2xl md:rounded-[3rem] border-2 border-dashed border-gray-200 dark:border-gray-700">
                             <i className="fas fa-book-open text-4xl md:text-5xl text-gray-200 mb-3 md:mb-4"></i>
                             <p className="text-sm md:text-base text-gray-400 font-bold">Diary kosong. Mulailah menulis halaman pertama Anda.</p>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="h-[calc(100vh-120px)] md:h-[calc(100vh-140px)] flex flex-col md:flex-row gap-4 md:gap-6 animate-fade-in overflow-hidden px-2 md:px-0">
            <div className={`flex-1 flex flex-col transition-all duration-500 ${feedback ? 'md:w-3/5' : 'w-full'} min-h-0`}>
                <div className="bg-white dark:bg-gray-800 rounded-2xl md:rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-gray-700 flex-1 flex flex-col overflow-hidden">
                    <div className="p-3 md:p-6 border-b border-gray-50 dark:border-gray-700 flex justify-between items-center">
                        <button onClick={() => setView('list')} className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-gray-50 dark:bg-gray-700 flex items-center justify-center text-gray-400 hover:text-gray-800 transition text-sm md:text-base">
                            <i className="fas fa-arrow-left text-xs md:text-base"></i>
                        </button>
                        <div className="flex-1 flex flex-col mx-2 md:mx-4">
                            <input 
                                value={activeEntry?.title}
                                onChange={(e) => setActiveEntry(prev => prev ? {...prev, title: e.target.value} : null)}
                                placeholder="Judul Catatan (Opsional)"
                                className="bg-transparent text-base md:text-xl font-black text-gray-800 dark:text-white outline-none placeholder-gray-300"
                            />
                            <span className="text-[7px] md:text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Tip: Kosongkan teks & judul lalu Simpan untuk menghapus</span>
                        </div>
                        <button 
                            onClick={handleSave}
                            disabled={isSaving}
                            className={`px-2 py-1 md:px-4 md:py-2 rounded-lg md:rounded-xl text-[9px] md:text-xs font-black uppercase transition ${isSaving ? 'text-green-500' : 'text-lovelya-500 hover:bg-lovelya-50'}`}
                        >
                            {isSaving ? <><i className="fas fa-check mr-1"></i> Tersimpan</> : 'Simpan'}
                        </button>
                    </div>
                    <textarea 
                        value={activeEntry?.content}
                        onChange={(e) => setActiveEntry(prev => prev ? {...prev, content: e.target.value} : null)}
                        placeholder="Tulis ceritamu di sini... (Dalam Bahasa Inggris)"
                        className="flex-1 p-6 md:p-10 text-base md:text-lg leading-relaxed outline-none resize-none bg-transparent dark:text-gray-200 custom-scrollbar"
                    />
                    <div className="p-3 md:p-6 bg-gray-50 dark:bg-gray-900/50 flex justify-between items-center">
                        <div className="text-[9px] md:text-xs font-bold text-gray-400 flex items-center gap-2">
                             <i className="fas fa-keyboard"></i>
                             {activeEntry?.content.split(/\s+/).filter(x => x).length} Kata
                        </div>
                        <button 
                            onClick={handleCheck}
                            disabled={isLoading || !activeEntry?.content.trim()}
                            className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-4 py-2 md:px-8 md:py-3 rounded-lg md:rounded-2xl text-[10px] md:text-sm font-black shadow-lg hover:scale-105 active:scale-95 transition flex items-center gap-2 md:gap-3 disabled:opacity-50"
                        >
                            {isLoading ? <i className="fas fa-circle-notch fa-spin"></i> : <i className="fas fa-wand-magic-sparkles"></i>}
                            AI CHECK
                        </button>
                    </div>
                </div>
            </div>

            {feedback && (
                <div className="w-full md:w-2/5 flex flex-col animate-slide-up h-full overflow-y-auto custom-scrollbar space-y-3 md:space-y-4 pb-6 md:pb-0">
                    <div className="bg-gradient-to-br from-lovelya-600 to-indigo-600 p-5 md:p-6 rounded-2xl md:rounded-[2rem] text-white shadow-lg">
                         <div className="flex justify-between items-center mb-3 md:mb-4">
                             <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest bg-white/20 px-2.5 py-1 rounded-full">Skor Akhir</span>
                             <button onClick={() => setFeedback(null)} className="text-white/60 hover:text-white"><i className="fas fa-times"></i></button>
                         </div>
                         <div className="text-5xl md:text-6xl font-black mb-1 md:mb-2">{feedback.score}</div>
                         <p className="text-xs md:text-sm text-lovelya-100 font-medium leading-relaxed">{feedback.generalFeedback}</p>
                    </div>

                    {feedback.islamicInsight && (
                        <div className="bg-lovelya-50 dark:bg-lovelya-900/20 p-5 md:p-6 rounded-2xl md:rounded-[2rem] border border-lovelya-100 dark:border-lovelya-800 shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-3 md:p-4 opacity-5 rotate-12"><i className="fas fa-moon text-5xl md:text-6xl"></i></div>
                            <h4 className="text-[8px] md:text-[10px] font-black uppercase text-lovelya-600 dark:text-lovelya-400 tracking-widest mb-2 md:mb-3 flex items-center gap-2">
                                <i className="fas fa-star-and-crescent"></i> Spiritual Insight
                            </h4>
                            <p className="text-lovelya-900 dark:text-lovelya-200 font-serif italic text-base md:text-lg leading-relaxed">"{feedback.islamicInsight}"</p>
                        </div>
                    )}

                    <div className="space-y-2 md:space-y-3">
                        <h4 className="text-[8px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest px-3 md:px-4">Koreksi ({feedback.errors.length})</h4>
                        {feedback.errors.map((err, idx) => (
                            <div key={idx} className="bg-white dark:bg-gray-800 p-4 md:p-5 rounded-2xl md:rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm space-y-2 md:space-y-3">
                                <div>
                                    <span className="text-[8px] md:text-[9px] font-black text-red-400 uppercase block mb-0.5 md:mb-1">Teks Anda</span>
                                    <p className="text-gray-400 line-through text-xs md:text-sm italic">"{err.mistake}"</p>
                                </div>
                                <div className="p-2.5 md:p-3 bg-green-50 dark:bg-green-900/10 rounded-xl md:rounded-2xl border border-green-100 dark:border-green-900/30">
                                    <span className="text-[8px] md:text-[9px] font-black text-green-600 uppercase block mb-0.5 md:mb-1">Rekomendasi</span>
                                    <p className="text-green-800 dark:text-green-300 font-bold text-xs md:text-sm">"{err.correction}"</p>
                                </div>
                                <p className="text-[10px] md:text-[11px] text-gray-500 leading-relaxed font-medium">
                                    <i className="fas fa-info-circle text-lovelya-400 mr-1"></i> {err.explanation}
                                </p>
                            </div>
                        ))}
                    </div>
                    
                    <div className="p-6 md:p-8 text-center text-gray-400 text-[10px] md:text-xs italic font-medium pb-8 md:pb-10">
                        Tulis ulang koreksi di atas dalam teks Anda agar lebih mudah diingat! 
                    </div>
                </div>
            )}
        </div>
    );
};

export default DiaryModule;
