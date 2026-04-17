
import React, { useState, useEffect, useMemo } from 'react';
import { VocabItem, ModuleProps, AppView } from '../types';
import { 
  getVocab, saveVocab, updateVocab, deleteVocab, 
  getFavorites, toggleFavorite, 
  getCustomCategories, saveCustomCategory, CustomCategory 
} from '../services/storage';
import { audioService } from '../services/audioService';
import { VOCAB_CATEGORIES } from '../constants';
import { STATIC_VOCAB } from '../data/vocabData';

const DEFAULT_ICONS: Record<string, string> = {
  'Adab & Akhlak': 'fa-hand-holding-heart',
  'Islamic Terms': 'fa-star-and-crescent',
  'Family & Relationships': 'fa-users',
  'Home & Daily Routine': 'fa-home',
  'School & Education': 'fa-graduation-cap',
  'Work & Career': 'fa-briefcase',
  'Food & Dining': 'fa-utensils',
  'Travel & Transportation': 'fa-plane',
  'Health & Body': 'fa-heartbeat',
  'Emotions & Feelings': 'fa-smile',
  'Nature & Environment': 'fa-leaf',
  'Weather & Climate': 'fa-cloud-sun',
  'Clothing & Fashion': 'fa-tshirt',
  'Shopping & Money': 'fa-shopping-bag',
  'Hobbies & Leisure': 'fa-guitar',
  'Sports & Fitness': 'fa-running',
  'Technology & Media': 'fa-laptop',
  'Time & Numbers': 'fa-clock',
  'Places & Buildings': 'fa-building',
  'Animals & Pets': 'fa-paw',
  'User Added': 'fa-pen-fancy'
};

const ICON_OPTIONS = [
  'fa-star', 'fa-heart', 'fa-lightbulb', 'fa-book', 'fa-comment', 
  'fa-gem', 'fa-crown', 'fa-music', 'fa-gamepad', 'fa-car',
  'fa-bicycle', 'fa-coffee', 'fa-pizza-slice', 'fa-tree', 'fa-moon',
  'fa-sun', 'fa-cloud', 'fa-umbrella', 'fa-bolt', 'fa-snowflake'
];

const VocabularyModule: React.FC<ModuleProps> = ({ onComplete, onNavigate }) => {
  const [userItems, setUserItems] = useState<VocabItem[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [customCategories, setCustomCategories] = useState<CustomCategory[]>([]);
  
  const [filter, setFilter] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<VocabItem | null>(null);
  
  const [newWord, setNewWord] = useState('');
  const [newTrans, setNewTrans] = useState('');
  const [selectedCat, setSelectedCat] = useState('');
  
  const [isCreatingCat, setIsCreatingCat] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatIcon, setNewCatIcon] = useState('fa-star');

  // Pagination for Word List
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  // --- PERSISTENCE LOGIC ---
  useEffect(() => {
    const savedState = localStorage.getItem('lovspeak_state_vocab');
    if (savedState) {
      try {
        const state = JSON.parse(savedState);
        setFilter(state.filter || '');
        setActiveCategory(state.activeCategory || null);
        setSortOrder(state.sortOrder || 'asc');
        setCurrentPage(state.currentPage || 1);
      } catch (e) {
        console.error("Failed to load vocab state", e);
      }
    }
  }, []);

  useEffect(() => {
    const stateToSave = { filter, activeCategory, sortOrder, currentPage };
    localStorage.setItem('lovspeak_state_vocab', JSON.stringify(stateToSave));
  }, [filter, activeCategory, sortOrder, currentPage]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setUserItems(getVocab());
    setFavorites(getFavorites());
    setCustomCategories(getCustomCategories());
  };

  const allItems = useMemo(() => [...STATIC_VOCAB, ...userItems], [userItems]);

  const categoryIcons = useMemo(() => {
    const icons = { ...DEFAULT_ICONS };
    customCategories.forEach(c => {
      icons[c.name] = c.icon;
    });
    return icons;
  }, [customCategories]);

  const allCategoryNames = useMemo(() => {
    const customNames = customCategories.map(c => c.name);
    return [...VOCAB_CATEGORIES, ...customNames];
  }, [customCategories]);

  const groupedVocab = useMemo(() => {
    const groups: Record<string, VocabItem[]> = {};
    allCategoryNames.forEach(cat => groups[cat] = []);
    groups['Favorites'] = [];

    allItems.forEach(item => {
      if (!groups[item.category]) groups[item.category] = [];
      groups[item.category].push(item);
      if (favorites.includes(item.id)) {
        groups['Favorites'].push(item);
      }
    });
    return groups;
  }, [allItems, favorites, allCategoryNames]);

  const isSearching = filter.length > 0;
  
  const displayedItems = useMemo(() => {
    let items = [];
    if (isSearching) {
      items = allItems.filter(i => 
        i.english.toLowerCase().includes(filter.toLowerCase()) || 
        i.indonesian.toLowerCase().includes(filter.toLowerCase())
      );
    } else if (activeCategory) {
      items = groupedVocab[activeCategory] || [];
    }

    return [...items].sort((a, b) => {
      const valA = a.english.toLowerCase();
      const valB = b.english.toLowerCase();
      if (sortOrder === 'asc') return valA.localeCompare(valB);
      return valB.localeCompare(valA);
    });
  }, [isSearching, filter, activeCategory, groupedVocab, allItems, sortOrder]);

  const totalPages = Math.ceil(displayedItems.length / itemsPerPage);
  const paginatedItems = displayedItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleFavoriteToggle = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    audioService.play('tap');
    const newFavs = toggleFavorite(id);
    setFavorites(newFavs);
  };

  const openAddModal = () => {
    setEditingItem(null);
    setNewWord('');
    setNewTrans('');
    if (activeCategory && activeCategory !== 'Favorites' && allCategoryNames.includes(activeCategory)) {
        setSelectedCat(activeCategory);
    } else {
        setSelectedCat(allCategoryNames[0]);
    }
    setIsCreatingCat(false);
    setShowModal(true);
  };

  const openEditModal = (item: VocabItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingItem(item);
    setNewWord(item.english);
    setNewTrans(item.indonesian);
    setSelectedCat(item.category);
    setIsCreatingCat(false);
    setShowModal(true);
  };

  const handleSave = () => {
    audioService.play('success');
    let finalCategory = selectedCat;
    if (isCreatingCat) {
      if (!newCatName.trim()) return;
      const newCustomCat: CustomCategory = { name: newCatName, icon: newCatIcon };
      saveCustomCategory(newCustomCat);
      finalCategory = newCatName;
    }

    if (editingItem) {
      const updated: VocabItem = {
        ...editingItem,
        english: newWord,
        indonesian: newTrans,
        category: finalCategory
      };
      updateVocab(updated);
    } else {
      if (!newWord.trim() && !newTrans.trim()) {
          setShowModal(false);
          return;
      }
      const item: VocabItem = {
        id: `user-${Date.now()}`,
        english: newWord,
        indonesian: newTrans,
        category: finalCategory,
        isUserGenerated: true
      };
      saveVocab(item);
    }
    
    loadData();
    setShowModal(false);
    if (onComplete) onComplete();
  };

  const playPronunciation = (text: string) => {
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'en-US';
    window.speechSynthesis.speak(utter);
  };

  return (
    <div className="space-y-4 md:space-y-6 h-full flex flex-col">
      <div className="mx-4">
        <button onClick={() => onNavigate?.(AppView.HOME)} className="mb-2 text-gray-400 hover:text-gray-600 font-bold transition flex items-center gap-2 uppercase text-[10px] md:text-xs tracking-widest">
          <i className="fas fa-arrow-left"></i> Back to Home
        </button>
      </div>
      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-3 md:p-4 rounded-2xl md:rounded-3xl shadow-sm border border-lovelya-100 dark:border-gray-700 relative mx-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 md:gap-4">
            <div>
                <h2 className="text-sm md:text-lg font-extrabold text-gray-800 dark:text-white flex items-center">
                    <i className="fas fa-book-reader text-lovelya-500 mr-2 md:mr-3"></i>
                    Vocabulary
                </h2>
                <p className="text-[8px] md:text-[10px] text-gray-500 dark:text-gray-400 mt-0.5 md:mt-1 uppercase tracking-widest font-bold">
                    {isSearching 
                    ? `Ditemukan ${displayedItems.length} kata` 
                    : activeCategory 
                        ? `Folder: ${activeCategory}` 
                        : 'Kelola koleksi kosa kata Anda'}
                </p>
            </div>
            
            <div className="flex items-center gap-2 w-full md:w-auto">
                <div className="relative flex-1 md:w-48">
                    <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-[8px] md:text-[10px]"></i>
                    <input 
                    type="text"
                    placeholder="Search words..."
                    value={filter}
                    onChange={e => { setFilter(e.target.value); setCurrentPage(1); }}
                    className="pl-8 pr-3 py-1.5 md:py-2 w-full rounded-lg md:rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 outline-none focus:ring-2 focus:ring-lovelya-300 transition-all text-[10px] md:text-sm"
                    />
                </div>
                
                <button 
                    onClick={openAddModal}
                    className="w-8 h-8 md:w-9 md:h-9 bg-lovelya-500 text-white rounded-lg md:rounded-xl shadow-lg shadow-lovelya-200/50 hover:bg-lovelya-600 transition flex items-center justify-center shrink-0"
                >
                    <i className="fas fa-plus text-xs md:text-sm"></i>
                </button>

                {(activeCategory || isSearching) && (
                    <button 
                        onClick={() => { setActiveCategory(null); setFilter(''); setCurrentPage(1); }}
                        className="w-9 h-9 md:w-10 md:h-10 border border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-300 rounded-lg md:rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition flex items-center justify-center shrink-0"
                    >
                        <i className="fas fa-arrow-left text-sm md:text-base"></i>
                    </button>
                )}
            </div>
        </div>
      </div>

      <div className="flex-1 min-h-[350px] md:min-h-[500px]">
        {!isSearching && !activeCategory && (
          <div className="animate-fade-in px-4">
              <div className="mb-4 md:mb-5">
                <button 
                  onClick={() => { setActiveCategory('Favorites'); setCurrentPage(1); }}
                  className="w-full md:w-auto flex items-center justify-center p-3 md:p-4 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-2xl border border-red-100 dark:border-red-900 shadow-sm hover:shadow-lg hover:scale-[1.01] transition-all duration-300 group"
                >
                  <div className="w-8 h-8 md:w-11 md:h-11 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center mr-3 md:mr-4 text-red-500 shadow-sm group-hover:scale-110 transition">
                    <i className="fas fa-heart text-sm md:text-xl"></i>
                  </div>
                  <div className="text-left mr-4 md:mr-8">
                    <h3 className="font-bold text-gray-800 dark:text-gray-100 text-[10px] md:text-sm leading-tight">Favorites</h3>
                    <p className="text-[7px] md:text-[11px] text-gray-500">{groupedVocab['Favorites']?.length || 0} words</p>
                  </div>
                  <div className="w-5 h-5 md:w-7 md:h-7 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center text-red-400 group-hover:bg-red-500 group-hover:text-white transition ml-auto">
                     <i className="fas fa-chevron-right text-[8px]"></i>
                  </div>
                </button>
             </div>

             <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4 pb-6">
               {allCategoryNames.map(cat => {
                 const count = groupedVocab[cat]?.length || 0;
                 if (count === 0 && !VOCAB_CATEGORIES.includes(cat)) return null; // Sembunyikan folder custom kosong

                 return (
                   <div key={cat} className="relative group h-full">
                     <button 
                       onClick={() => { setActiveCategory(cat); setCurrentPage(1); }}
                       className="w-full flex flex-col items-center justify-center p-2.5 md:p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-soft hover:border-lovelya-200 transition-all duration-300 text-center h-full relative overflow-hidden"
                     >
                       <div className="absolute top-0 right-0 p-1 opacity-5">
                          <i className={`fas ${categoryIcons[cat] || 'fa-folder'} text-3xl md:text-5xl`}></i>
                       </div>
                       <div className="w-8 h-8 md:w-12 md:h-12 bg-lovelya-50 dark:bg-gray-700 rounded-xl md:rounded-2xl flex items-center justify-center mb-1.5 md:mb-3 text-base md:text-xl group-hover:scale-110 transition duration-300 z-10 text-lovelya-500 shadow-inner">
                          <i className={`fas ${categoryIcons[cat] || 'fa-folder'}`}></i>
                       </div>
                       <h3 className="font-bold text-gray-800 dark:text-gray-200 text-[10px] md:text-xs mb-0.5 md:mb-1 group-hover:text-lovelya-600 w-full z-10 line-clamp-1">
                         {cat}
                       </h3>
                       <span className="text-[7px] md:text-[10px] text-gray-400 bg-gray-50 dark:bg-gray-700 px-1.5 py-0.5 rounded-full mt-auto z-10 font-medium">
                         {count} words
                       </span>
                     </button>
                   </div>
                 )
               })}
             </div>
          </div>
        )}

        {(isSearching || activeCategory) && (
           <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl md:rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col h-[calc(100vh-240px)] md:h-[calc(100vh-220px)] animate-slide-up mx-4">
              <div className="p-2 md:p-3 border-b border-gray-100 dark:border-gray-700 bg-lovelya-50/50 dark:bg-gray-900/50 flex items-center justify-between">
                   <div className="flex items-center gap-2 text-[9px] md:text-xs">
                     <span className="text-gray-400 hidden md:inline">Folder:</span>
                           <span className="text-gray-400 font-bold text-lovelya-600 dark:text-lovelya-400 flex items-center gap-1 bg-white dark:bg-gray-700 px-2 py-0.5 rounded-lg border border-gray-100 dark:border-gray-600 shadow-sm">
                              <i className={`fas ${activeCategory === 'Favorites' ? 'fa-heart text-red-500' : (categoryIcons[activeCategory || ''] || 'fa-folder-open')}`}></i>
                              {activeCategory || 'Hasil Pencarian'}
                           </span>
                   </div>
                   
                   <button 
                     onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                     className="text-gray-500 hover:text-lovelya-600 text-[9px] md:text-xs font-black uppercase tracking-wider flex items-center gap-1"
                   >
                     <i className={`fas fa-sort-alpha-${sortOrder === 'asc' ? 'down' : 'up'}`}></i> <span className="hidden md:inline">Urutkan</span>
                   </button>
              </div>

              <div className="flex-1 overflow-auto custom-scrollbar">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-gray-50 dark:bg-gray-900/50 sticky top-0 z-10 backdrop-blur-sm">
                    <tr className="text-gray-400 dark:text-gray-500 text-[6px] md:text-[9px] uppercase tracking-wider font-extrabold">
                      <th className="p-2 md:p-2.5 border-b border-gray-100 dark:border-gray-700 w-7 md:w-10 text-center">#</th>
                      <th className="p-2 md:p-2.5 border-b border-gray-100 dark:border-gray-700">English</th>
                      <th className="p-2 md:p-2.5 border-b border-gray-100 dark:border-gray-700">Indonesian</th>
                      <th className="p-2 md:p-2.5 border-b border-gray-100 dark:border-gray-700 text-center w-12 md:w-20">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                    {paginatedItems.map((item, idx) => {
                      const isFav = favorites.includes(item.id);
                      const displayIdx = (currentPage - 1) * itemsPerPage + idx + 1;
                      return (
                        <tr key={item.id} className="hover:bg-lovelya-50/50 dark:hover:bg-gray-700/30 transition-colors group">
                          <td className="p-1.5 md:p-2 text-gray-400 text-[8px] font-mono text-center">{displayIdx}</td>
                          <td className="p-1.5 md:p-2">
                            <div className="flex flex-col">
                              <span className="font-bold text-gray-800 dark:text-gray-100 text-[10px] md:text-[13px]">{item.english}</span>
                              {item.sentence && (
                                <span className="text-[7px] md:text-[9px] text-gray-400 font-medium italic mt-0.5 line-clamp-1 group-hover:line-clamp-none transition-all">
                                  "{item.sentence}"
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="p-1.5 md:p-2">
                            <span className="text-gray-600 dark:text-gray-300 italic text-[9px] md:text-[12px]">{item.indonesian}</span>
                          </td>
                          <td className="p-1.5 md:p-2 text-center">
                            <div className="flex items-center justify-center gap-1 opacity-50 group-hover:opacity-100 transition-opacity">
                              <button 
                                onClick={() => playPronunciation(item.english)}
                                className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-lovelya-500 hover:bg-lovelya-500 hover:text-white transition flex items-center justify-center shadow-sm"
                                title="Listen"
                              >
                                <i className="fas fa-volume-up text-[7px] md:text-[9px]"></i>
                              </button>
                              
                              <button 
                                onClick={(e) => handleFavoriteToggle(item.id, e)}
                                className={`w-5 h-5 md:w-6 md:h-6 rounded-full border transition flex items-center justify-center shadow-sm ${
                                  isFav 
                                  ? 'bg-red-50 border-red-200 text-red-500 hover:bg-red-100' 
                                  : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-gray-300 hover:text-red-400'
                                }`}
                              >
                                <i className={`${isFav ? 'fas' : 'far'} fa-heart text-[7px] md:text-[9px]`}></i>
                              </button>

                              {item.isUserGenerated && (
                                <button 
                                  onClick={(e) => openEditModal(item, e)}
                                  className="w-6 h-6 md:w-7 md:h-7 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-blue-500 hover:bg-blue-500 hover:text-white transition flex items-center justify-center shadow-sm"
                                  title="Edit"
                                >
                                  <i className="fas fa-pen text-[8px] md:text-[9px]"></i>
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {totalPages > 1 && (
                <div className="p-2.5 md:p-3 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 flex items-center justify-center gap-4">
                  <button 
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => prev - 1)}
                    className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-center text-gray-500 disabled:opacity-30 transition-all active:scale-90"
                  >
                    <i className="fas fa-chevron-left text-[10px]"></i>
                  </button>
                  <span className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest">Hal {currentPage} / {totalPages}</span>
                  <button 
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => prev + 1)}
                    className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-center text-gray-500 disabled:opacity-30 transition-all active:scale-90"
                  >
                    <i className="fas fa-chevron-right text-[10px]"></i>
                  </button>
                </div>
              )}
           </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-fade-in">
           <div className="bg-white dark:bg-gray-800 w-full max-w-lg rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden animate-bounce-in max-h-[90vh] overflow-y-auto">
              <div className="bg-lovelya-500 p-4 md:p-5 flex justify-between items-center text-white sticky top-0 z-10">
                 <h3 className="font-bold text-base md:text-lg flex items-center gap-2">
                   <i className={`fas ${editingItem ? 'fa-edit' : 'fa-plus-circle'}`}></i> 
                   {editingItem ? 'Edit Kata' : 'Tambah Kosa Kata'}
                 </h3>
                 <button onClick={() => setShowModal(false)} className="hover:opacity-75 transition bg-white/20 rounded-full w-7 h-7 md:w-8 md:h-8 flex items-center justify-center"><i className="fas fa-times text-sm"></i></button>
              </div>
              
              <div className="p-5 md:p-6 space-y-5 md:space-y-6">
                 <div className="bg-gray-50 dark:bg-gray-700/50 p-4 md:p-5 rounded-xl md:rounded-2xl border border-gray-100 dark:border-gray-600">
                    <label className="block text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 md:mb-3">Folder / Kategori</label>
                    
                    {!isCreatingCat ? (
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <select 
                            value={selectedCat}
                            onChange={e => setSelectedCat(e.target.value)}
                            className="w-full p-3 md:p-3.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-lovelya-500 outline-none appearance-none transition text-xs md:text-sm font-medium"
                          >
                            {allCategoryNames.map(c => <option key={c} value={c}>{c}</option>)}
                          </select>
                          <i className="fas fa-chevron-down absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none text-xs"></i>
                        </div>
                        <button 
                          onClick={() => setIsCreatingCat(true)}
                          className="px-3 md:px-4 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl hover:bg-lovelya-50 dark:hover:bg-gray-600 text-lovelya-600 transition"
                          title="Buat Folder Baru"
                        >
                          <i className="fas fa-folder-plus text-lg md:text-xl"></i>
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-3 md:space-y-4 animate-fade-in">
                        <div className="flex justify-between items-center mb-1">
                           <span className="text-[10px] text-lovelya-600 font-bold uppercase">Folder Baru</span>
                           <button onClick={() => setIsCreatingCat(false)} className="text-[10px] text-gray-400 underline">Batal</button>
                        </div>
                        <input 
                          placeholder="Nama Folder"
                          value={newCatName}
                          onChange={e => setNewCatName(e.target.value)}
                          className="w-full p-3 md:p-3.5 rounded-xl border-2 border-lovelya-100 dark:border-gray-600 bg-white dark:bg-gray-700 outline-none text-xs md:text-sm"
                        />
                        <div className="grid grid-cols-5 gap-2">
                            {ICON_OPTIONS.map(icon => (
                                <button key={icon} onClick={() => setNewCatIcon(icon)} className={`p-2 rounded-lg text-center transition ${newCatIcon === icon ? 'bg-lovelya-500 text-white shadow-md' : 'bg-white dark:bg-gray-600 text-gray-500 hover:bg-gray-100'}`}><i className={`fas ${icon} text-sm`}></i></button>
                            ))}
                        </div>
                      </div>
                    )}
                 </div>

                 <div className="space-y-4">
                    <div>
                        <label className="block text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5 md:mb-2">Kata Inggris</label>
                        <input 
                        placeholder="Contoh: Resilience" 
                        value={newWord}
                        onChange={e => setNewWord(e.target.value)}
                        className="w-full p-3 md:p-3.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-lovelya-500 outline-none transition text-base md:text-lg font-bold text-gray-800 dark:text-white"
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5 md:mb-2">Terjemahan Indonesia</label>
                        <input 
                        placeholder="Contoh: Ketangguhan" 
                        value={newTrans}
                        onChange={e => setNewTrans(e.target.value)}
                        className="w-full p-3 md:p-3.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-lovelya-500 outline-none transition text-base md:text-lg"
                        />
                    </div>
                    <div className="p-2.5 md:p-3 bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-900 flex items-center gap-2 md:gap-3">
                        <i className="fas fa-info-circle text-blue-500 text-xs"></i>
                        <p className="text-[9px] md:text-[10px] text-blue-700 dark:text-blue-300 font-bold uppercase tracking-widest leading-tight">Tip: Kosongkan kedua kolom di atas lalu simpan untuk menghapus kata ini. Folder akan otomatis terhapus jika tidak ada lagi isinya.</p>
                    </div>
                 </div>
                 
                 <div className="pt-5 md:pt-6 flex justify-end gap-2 md:gap-3 border-t border-gray-100 dark:border-gray-700">
                    <button onClick={() => setShowModal(false)} className="px-5 md:px-6 py-2.5 md:py-3 rounded-xl text-gray-600 dark:text-gray-300 font-bold text-xs md:text-sm">Batal</button>
                    <button onClick={handleSave} className="px-6 md:px-8 py-2.5 md:py-3 rounded-xl bg-lovelya-500 text-white font-bold hover:bg-lovelya-600 shadow-lg shadow-lovelya-200/50 transition text-xs md:text-sm">
                      {isCreatingCat ? 'Buat & Simpan' : 'Simpan'}
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default VocabularyModule;
