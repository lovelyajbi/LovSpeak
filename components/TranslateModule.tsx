
import React, { useState, useEffect } from 'react';
import { translateText } from '../services/gemini';
import { audioService } from '../services/audioService';
import { saveVocab, saveCustomCategory, getCustomCategories, CustomCategory } from '../services/storage';
import { VOCAB_CATEGORIES } from '../constants';
import { ModuleProps } from '../types';

const ICON_OPTIONS = [
  'fa-star', 'fa-heart', 'fa-lightbulb', 'fa-book', 'fa-comment', 
  'fa-gem', 'fa-crown', 'fa-music', 'fa-gamepad', 'fa-car',
  'fa-bicycle', 'fa-coffee', 'fa-pizza-slice', 'fa-tree', 'fa-moon',
  'fa-sun', 'fa-cloud', 'fa-umbrella', 'fa-bolt', 'fa-snowflake'
];

const TranslateModule: React.FC<ModuleProps> = ({ onComplete }) => {
  // Translation State
  const [source, setSource] = useState('');
  const [target, setTarget] = useState('');
  const [direction, setDirection] = useState<'en-id' | 'id-en'>('en-id');
  const [loading, setLoading] = useState(false);

  // Selection & Modal State
  const [selection, setSelection] = useState('');
  const [showModal, setShowModal] = useState(false);
  
  // Form State
  const [englishWord, setEnglishWord] = useState('');
  const [indonesianWord, setIndonesianWord] = useState('');
  
  // Category State
  const [customCategories, setCustomCategories] = useState<CustomCategory[]>([]);
  const [selectedCat, setSelectedCat] = useState('');
  const [isCreatingCat, setIsCreatingCat] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatIcon, setNewCatIcon] = useState('fa-star');

  useEffect(() => {
    // Load custom categories on mount to populate dropdown
    setCustomCategories(getCustomCategories());
  }, []);

  const handleTranslate = async () => {
    if (!source.trim()) return;
    audioService.play('tap');
    setLoading(true);
    setSelection(''); // Clear previous selection
    try {
      const res = await translateText(source, direction);
      setTarget(res);
      // Completing the task immediately upon successful translation
      if (onComplete) onComplete(); 
    } catch (e) {
      console.error(e);
      setTarget('Error during translation.');
    } finally {
      setLoading(false);
    }
  };

  const swap = () => {
    setDirection(prev => prev === 'en-id' ? 'id-en' : 'en-id');
    setSource(target);
    setTarget(source);
    setSelection('');
  };

  const playAudio = (text: string, isSource: boolean) => {
    if (!text) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    
    // Determine language logic
    // If direction 'en-id': Source is EN, Target is ID
    // If direction 'id-en': Source is ID, Target is EN
    if (direction === 'en-id') {
        utter.lang = isSource ? 'en-US' : 'id-ID';
    } else {
        utter.lang = isSource ? 'id-ID' : 'en-US';
    }
    
    // Adjust rate for better clarity
    utter.rate = 0.9;
    
    window.speechSynthesis.speak(utter);
  };

  // Handle Text Selection in Target Box
  const handleTextSelect = () => {
    const text = window.getSelection()?.toString().trim();
    if (text && text.length > 0) {
      setSelection(text);
    }
  };

  const openSaveModal = () => {
    // Refresh categories
    const cats = getCustomCategories();
    setCustomCategories(cats);
    
    // Default category
    setSelectedCat(VOCAB_CATEGORIES[0]);
    setIsCreatingCat(false);
    
    // Pre-fill based on direction and selection
    if (direction === 'en-id') {
      // Source is English, Target is Indonesian
      // If user selected text in target, that's Indonesian
      setIndonesianWord(selection);
      // We try to guess the English word if the source was short, otherwise leave blank for user
      setEnglishWord(source.length < 50 ? source : ''); 
    } else {
      // Source is Indonesian, Target is English
      // If user selected text in target, that's English
      setEnglishWord(selection);
      setIndonesianWord(source.length < 50 ? source : '');
    }

    setShowModal(true);
  };

  const handleSave = () => {
    let finalCategory = selectedCat;

    // 1. Handle New Category
    if (isCreatingCat) {
      if (!newCatName.trim()) {
        alert("Please enter a folder name");
        return;
      }
      const newCustomCat: CustomCategory = { name: newCatName, icon: newCatIcon };
      saveCustomCategory(newCustomCat);
      setCustomCategories(prev => [...prev, newCustomCat]); // Update local state
      finalCategory = newCatName;
    }

    // 2. Validation
    if (!englishWord || !indonesianWord) {
      alert("Please ensure both English and Indonesian words are filled.");
      return;
    }

    // 3. Save Word
    saveVocab({
      id: `saved-${Date.now()}`,
      english: englishWord,
      indonesian: indonesianWord,
      category: finalCategory,
      isUserGenerated: true
    });

    // 4. Cleanup
    alert(`Saved "${englishWord}" to ${finalCategory}!`);
    setShowModal(false);
    setSelection('');
    window.getSelection()?.removeAllRanges();
    
    // Also trigger completion here as saving a word is a valid task activity
    if (onComplete) onComplete();
  };

  const allCategoryNames = [
    ...VOCAB_CATEGORIES, 
    ...customCategories.map(c => c.name)
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-lovelya-100 dark:border-gray-700 overflow-hidden">
        {/* Header / Language Switcher */}
        <div className="p-3 md:p-4 bg-lovelya-50 dark:bg-gray-700 flex justify-between items-center border-b border-lovelya-100 dark:border-gray-600">
          <span className="font-bold text-lovelya-800 dark:text-lovelya-200 w-1/3 text-center text-sm md:text-base">
            {direction === 'en-id' ? 'English' : 'Indonesian'}
          </span>
          <button onClick={swap} className="p-1.5 md:p-2 rounded-full hover:bg-white dark:hover:bg-gray-600 transition shadow-sm">
            <i className="fas fa-exchange-alt text-lovelya-500 text-sm md:text-base"></i>
          </button>
          <span className="font-bold text-lovelya-800 dark:text-lovelya-200 w-1/3 text-center text-sm md:text-base">
            {direction === 'en-id' ? 'Indonesian' : 'English'}
          </span>
        </div>

        {/* Translation Area */}
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-100 dark:divide-gray-600">
          <div className="relative">
            <textarea
              value={source}
              onChange={e => setSource(e.target.value)}
              placeholder="Type here..."
              className="w-full h-40 md:h-64 p-4 md:p-6 pr-12 resize-none outline-none bg-white text-gray-900 dark:bg-gray-800 dark:text-white text-base md:text-lg placeholder-gray-400 dark:placeholder-gray-500"
            ></textarea>
            {source && (
               <button 
                 onClick={() => playAudio(source, true)}
                 className="absolute top-3 right-3 md:top-4 md:right-4 text-gray-400 hover:text-lovelya-600 transition"
                 title="Listen to original"
               >
                 <i className="fas fa-volume-up text-lg md:text-xl"></i>
               </button>
            )}
          </div>
          
          <div className="relative w-full h-40 md:h-64">
            <textarea
                value={target}
                onChange={e => setTarget(e.target.value)}
                onMouseUp={handleTextSelect}
                placeholder="Translation will appear here..."
                className="w-full h-full p-4 md:p-6 pr-12 resize-none outline-none bg-gray-50 dark:bg-gray-800/50 text-gray-900 dark:text-gray-200 text-base md:text-lg placeholder-gray-400 dark:placeholder-gray-500"
            />
            
            {loading && (
               <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-gray-900/50 text-lovelya-500 z-10">
                 <i className="fas fa-spinner fa-spin text-xl md:text-2xl"></i>
               </div>
            )}
            
            {target && !loading && (
               <button 
                 onClick={() => playAudio(target, false)}
                 className="absolute top-3 right-3 md:top-4 md:right-4 text-gray-400 hover:text-lovelya-600 transition z-10"
                 title="Listen to translation"
               >
                 <i className="fas fa-volume-up text-lg md:text-xl"></i>
               </button>
            )}

            {/* Floating Save Button when text is selected */}
            {selection && !loading && (
              <div className="absolute bottom-3 right-3 md:bottom-4 md:right-4 animate-bounce-in z-20">
                <button 
                  onClick={openSaveModal}
                  className="bg-lovelya-600 text-white px-3 py-1.5 md:px-4 md:py-2 rounded-full shadow-lg text-xs md:text-sm font-black hover:bg-lovelya-700 transition flex items-center gap-2"
                >
                  <i className="fas fa-plus-circle"></i> Save <span className="hidden md:inline">Selection</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Action Bar */}
        <div className="p-2.5 md:p-4 bg-gray-50 dark:bg-gray-700 flex justify-between items-center">
          <span className="text-[9px] md:text-xs text-gray-500 dark:text-gray-400 max-w-[60%] leading-tight">
            {selection ? 'Tip: Click "Save" to add to vocabulary.' : 'Tip: Highlight text in translation to save it.'}
          </span>
          <button
            onClick={handleTranslate}
            disabled={loading || !source}
            className="px-3 py-1.5 md:px-6 md:py-2 bg-lovelya-600 text-white rounded-lg text-[10px] md:text-sm font-black hover:bg-lovelya-700 transition disabled:opacity-50"
          >
            {loading ? 'Translating...' : 'Translate'}
          </button>
        </div>
      </div>

      {/* Save to Vocab Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white dark:bg-gray-800 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-bounce-in max-h-[90vh] overflow-y-auto">
             <div className="bg-lovelya-600 p-4 flex justify-between items-center text-white sticky top-0 z-10">
                <h3 className="font-bold text-lg"><i className="fas fa-save mr-2"></i> Save to Vocabulary</h3>
                <button onClick={() => setShowModal(false)} className="hover:opacity-75 transition"><i className="fas fa-times"></i></button>
             </div>

             <div className="p-6 space-y-5">
                {/* Word Inputs */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                     <label className="block text-xs font-bold text-gray-500 uppercase mb-1">English</label>
                     <input 
                       value={englishWord} 
                       onChange={e => setEnglishWord(e.target.value)}
                       className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-lovelya-500 outline-none"
                     />
                  </div>
                  <div>
                     <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Indonesian</label>
                     <input 
                       value={indonesianWord} 
                       onChange={e => setIndonesianWord(e.target.value)}
                       className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-lovelya-500 outline-none"
                     />
                  </div>
                </div>

                {/* Folder Selection */}
                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl border border-gray-100 dark:border-gray-600">
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Save to Folder</label>
                    
                    {!isCreatingCat ? (
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <select 
                            value={selectedCat}
                            onChange={e => setSelectedCat(e.target.value)}
                            className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-lovelya-500 outline-none appearance-none transition"
                          >
                            {allCategoryNames.map(c => <option key={c} value={c}>{c}</option>)}
                          </select>
                          <i className="fas fa-chevron-down absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"></i>
                        </div>
                        <button 
                          onClick={() => setIsCreatingCat(true)}
                          className="px-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 text-lovelya-600"
                          title="Create New Folder"
                        >
                          <i className="fas fa-folder-plus text-xl"></i>
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-3 animate-fade-in">
                        <div className="flex justify-between items-center mb-1">
                           <span className="text-xs text-lovelya-600 font-bold uppercase">New Folder Details</span>
                           <button onClick={() => setIsCreatingCat(false)} className="text-xs text-gray-400 hover:text-gray-600 underline">Cancel</button>
                        </div>
                        <input 
                          placeholder="Folder Name (e.g. Travel Phrases)"
                          value={newCatName}
                          onChange={e => setNewCatName(e.target.value)}
                          className="w-full p-3 rounded-xl border-2 border-lovelya-100 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-lovelya-500 outline-none"
                        />
                        <div>
                          <label className="text-xs text-gray-500 block mb-2">Select Folder Icon</label>
                          <div className="grid grid-cols-5 gap-2">
                            {ICON_OPTIONS.map(icon => (
                              <button
                                key={icon}
                                onClick={() => setNewCatIcon(icon)}
                                className={`p-2 rounded-lg text-center transition ${newCatIcon === icon ? 'bg-lovelya-500 text-white shadow-md' : 'bg-white dark:bg-gray-600 text-gray-500 hover:bg-gray-100'}`}
                              >
                                <i className={`fas ${icon}`}></i>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                 </div>

                 <div className="pt-4 flex justify-end gap-3 border-t border-gray-100 dark:border-gray-700">
                    <button 
                      onClick={() => setShowModal(false)}
                      className="px-5 py-2 rounded-lg text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 font-medium transition"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleSave}
                      className="px-6 py-2 rounded-lg bg-lovelya-600 text-white font-bold hover:bg-lovelya-700 shadow-lg transition"
                    >
                      Save Word
                    </button>
                 </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TranslateModule;
