
import React, { useState, useEffect } from 'react';
import { ModuleProps, AppView } from '../types';
import { 
  getGeminiApiKey, saveGeminiApiKey, 
  getThemeColor, saveThemeColor, 
  getFontSize, saveFontSize, FontSize,
  exportFullSystemBackup, importFullSystemBackup,
  getSoundEnabled, setSoundEnabled,
  getAppLanguage, setAppLanguage,
  resetAllProgress
} from '../services/storage';
import { audioService } from '../services/audioService';

const SettingsModule: React.FC<ModuleProps> = () => {
  const [apiKey, setApiKey] = useState(getGeminiApiKey() || '');
  const [themeColor, setThemeColor] = useState(getThemeColor());
  const [fontSize, setFontSize] = useState<FontSize>(getFontSize());
  const [soundEnabled, setSoundEnabledState] = useState(getSoundEnabled());
  const [appLanguage, setAppLanguageState] = useState(getAppLanguage());
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const handleSaveApiKey = () => {
    audioService.play('success');
    saveGeminiApiKey(apiKey);
    triggerToast('API Key saved successfully!');
  };

  const handleThemeChange = (color: string) => {
    audioService.play('tap');
    setThemeColor(color);
    saveThemeColor(color);
    const shades = generateShades(color);
    const root = document.documentElement;
    Object.keys(shades).forEach(key => {
      root.style.setProperty(`--color-lovelya-${key}`, (shades as any)[key]);
    });
  };

  const handleFontSizeChange = (size: FontSize) => {
    audioService.play('tap');
    setFontSize(size);
    saveFontSize(size);
    updateGlobalFontSize(size);
  };

  const handleSoundToggle = () => {
    const newVal = !soundEnabled;
    setSoundEnabledState(newVal);
    setSoundEnabled(newVal);
    audioService.play('toggle');
    triggerToast(`Sound ${newVal ? 'Enabled' : 'Disabled'}`);
  };

  const handleLanguageChange = (lang: 'id' | 'en') => {
    audioService.play('tap');
    setAppLanguageState(lang);
    setAppLanguage(lang);
    triggerToast(`Language set to ${lang === 'id' ? 'Indonesian' : 'English'}`);
  };

  const handleResetProgress = async () => {
    audioService.play('error');
    await resetAllProgress();
    triggerToast('All progress has been reset.');
    setTimeout(() => window.location.reload(), 1500);
  };

  const updateGlobalFontSize = (size: FontSize) => {
    try {
      const root = document.documentElement;
      let baseSize = '16px';
      if (size === 'medium') baseSize = '18px';
      if (size === 'large') baseSize = '20px';
      root.style.fontSize = baseSize;
      // Force a repaint
      root.style.display = 'none';
      root.offsetHeight; 
      root.style.display = '';
    } catch (e) {
      console.error("Failed to update font size", e);
    }
  };

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // Helper to generate shades (copied from Layout for consistency)
  function generateShades(hexColor: string) {
    let r = 0, g = 0, b = 0;
    if (hexColor.length === 4) {
      r = parseInt("0x" + hexColor[1] + hexColor[1]);
      g = parseInt("0x" + hexColor[2] + hexColor[2]);
      b = parseInt("0x" + hexColor[3] + hexColor[3]);
    } else if (hexColor.length === 7) {
      r = parseInt("0x" + hexColor[1] + hexColor[2]);
      g = parseInt("0x" + hexColor[3] + hexColor[4]);
      b = parseInt("0x" + hexColor[5] + hexColor[6]);
    }
    const mix = (r:number, g:number, b:number, percent:number, isDark:boolean) => {
       const t = isDark ? 0 : 255;
       const newR = Math.round(r + (t - r) * percent);
       const newG = Math.round(g + (t - g) * percent);
       const newB = Math.round(b + (t - b) * percent);
       return `rgb(${newR}, ${newG}, ${newB})`;
    };
    return {
      50: mix(r, g, b, 0.95, false),
      100: mix(r, g, b, 0.9, false),
      200: mix(r, g, b, 0.75, false),
      300: mix(r, g, b, 0.6, false),
      400: mix(r, g, b, 0.3, false),
      500: `rgb(${r}, ${g}, ${b})`,
      600: mix(r, g, b, 0.1, true),
      700: mix(r, g, b, 0.3, true),
      800: mix(r, g, b, 0.5, true),
      900: mix(r, g, b, 0.7, true),
    };
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-20">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
        <h2 className="text-2xl font-black text-gray-800 dark:text-white mb-6 flex items-center gap-3">
          <i className="fas fa-cog text-lovelya-500"></i> Settings
        </h2>

        <div className="space-y-8">
          {/* Theme Color */}
          <section>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Theme Color</label>
            <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-700">
              <div 
                className="w-12 h-12 rounded-xl shadow-inner border-2 border-white dark:border-gray-700"
                style={{ backgroundColor: themeColor }}
              ></div>
              <div className="flex-1">
                <input 
                  type="color" 
                  value={themeColor} 
                  onChange={(e) => handleThemeChange(e.target.value)}
                  className="w-full h-10 rounded-lg cursor-pointer bg-transparent"
                />
              </div>
            </div>
          </section>

          {/* Font Size */}
          <section>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">App Font Size</label>
            <div className="grid grid-cols-3 gap-2 p-1 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-700">
              {(['normal', 'medium', 'large'] as FontSize[]).map(size => (
                <button
                  key={size}
                  onClick={() => handleFontSizeChange(size)}
                  className={`py-2.5 rounded-xl font-bold text-xs capitalize transition-all ${fontSize === size ? 'bg-white dark:bg-gray-700 text-lovelya-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  {size}
                </button>
              ))}
            </div>
          </section>

          {/* Language Preference */}
          <section>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">AI Feedback Language</label>
            <div className="grid grid-cols-2 gap-2 p-1 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-700">
              <button
                onClick={() => handleLanguageChange('id')}
                className={`py-2.5 rounded-xl font-bold text-xs transition-all ${appLanguage === 'id' ? 'bg-white dark:bg-gray-700 text-lovelya-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Indonesian
              </button>
              <button
                onClick={() => handleLanguageChange('en')}
                className={`py-2.5 rounded-xl font-bold text-xs transition-all ${appLanguage === 'en' ? 'bg-white dark:bg-gray-700 text-lovelya-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                English
              </button>
            </div>
          </section>

          {/* API Key */}
          <section>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Gemini API Key</label>
            <div className="space-y-4">
              <div className="relative">
                <i className="fas fa-key absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                <input 
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter your Gemini API Key..."
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 outline-none focus:ring-2 focus:ring-lovelya-500 transition text-sm font-mono"
                />
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <button 
                  onClick={handleSaveApiKey}
                  className="flex-1 py-3.5 bg-lovelya-600 text-white rounded-2xl font-bold shadow-lg hover:bg-lovelya-700 transition active:scale-95 flex items-center justify-center gap-2"
                >
                  <i className="fas fa-save"></i> Save API Key
                </button>
                
                {getGeminiApiKey() && (
                  <button 
                    onClick={() => {
                      if (window.confirm('Are you sure you want to remove your API Key? AI features will stop working.')) {
                        saveGeminiApiKey('');
                        setApiKey('');
                        triggerToast('API Key removed.');
                      }
                    }}
                    className="px-6 py-3.5 border-2 border-red-100 dark:border-red-900/30 text-red-500 rounded-2xl font-bold hover:bg-red-50 dark:hover:bg-red-900/10 transition"
                  >
                    Clear
                  </button>
                )}
              </div>

              <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-900/30 flex items-start gap-3">
                <i className="fas fa-info-circle text-blue-500 mt-0.5"></i>
                <div className="space-y-1">
                  <p className="text-[10px] text-blue-700 dark:text-blue-300 font-medium">
                    Don't have an API Key? You can get one for free from Google AI Studio.
                  </p>
                  <a 
                    href="https://aistudio.google.com/app/apikey" 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-wider hover:underline flex items-center gap-1"
                  >
                    Get Free API Key <i className="fas fa-external-link-alt text-[8px]"></i>
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* Backup & Restore */}
          <section className="pt-4 border-t border-gray-100 dark:border-gray-700">
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Data Management</label>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => {
                  const data = exportFullSystemBackup();
                  const blob = new Blob([data], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `LovSpeak_Backup_${new Date().toISOString().split('T')[0]}.json`;
                  a.click();
                  triggerToast('Backup downloaded!');
                }}
                className="flex flex-col items-center justify-center p-4 bg-blue-50 dark:bg-blue-900/10 text-blue-600 dark:text-blue-400 rounded-2xl border border-blue-100 dark:border-blue-900 hover:bg-blue-100 transition"
              >
                <i className="fas fa-download text-xl mb-2"></i>
                <span className="text-[10px] font-bold uppercase">Export Backup</span>
              </button>
              <label className="flex flex-col items-center justify-center p-4 bg-purple-50 dark:bg-purple-900/10 text-purple-600 dark:text-purple-400 rounded-2xl border border-purple-100 dark:border-purple-900 hover:bg-purple-100 transition cursor-pointer">
                <i className="fas fa-upload text-xl mb-2"></i>
                <span className="text-[10px] font-bold uppercase">Import Backup</span>
                <input 
                  type="file" 
                  className="hidden" 
                  accept=".json"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (re) => {
                        const res = importFullSystemBackup(re.target?.result as string);
                        if (res.success) {
                          triggerToast(res.message);
                          setTimeout(() => window.location.reload(), 1500);
                        } else {
                          triggerToast(res.message);
                        }
                      };
                      reader.readAsText(file);
                    }
                  }}
                />
              </label>
            </div>
          </section>

          {/* Danger Zone */}
          <section className="pt-6 border-t border-red-100 dark:border-red-900/30">
            <label className="block text-[10px] font-black text-red-500 uppercase tracking-widest mb-4">Danger Zone</label>
            {!showResetConfirm ? (
              <button 
                onClick={() => setShowResetConfirm(true)}
                className="w-full py-3.5 border-2 border-red-100 dark:border-red-900/30 text-red-500 rounded-2xl font-bold hover:bg-red-50 dark:hover:bg-red-900/10 transition"
              >
                Reset All Progress
              </button>
            ) : (
              <div className="space-y-3 animate-pulse">
                <p className="text-[10px] text-red-500 font-bold text-center">Are you absolutely sure? This cannot be undone.</p>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => setShowResetConfirm(false)}
                    className="py-3 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-xl font-bold"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleResetProgress}
                    className="py-3 bg-red-600 text-white rounded-xl font-bold shadow-lg shadow-red-200"
                  >
                    Yes, Reset
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>

      {showToast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 px-6 py-3 bg-gray-900 text-white rounded-full shadow-2xl text-xs font-bold animate-slide-up z-[100]">
          {toastMsg}
        </div>
      )}
    </div>
  );
};

export default SettingsModule;
