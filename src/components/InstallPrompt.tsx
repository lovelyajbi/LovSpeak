
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const InstallPrompt: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [platform, setPlatform] = useState<'ios' | 'android' | 'other'>('other');
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    // Detect platform
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIos = /iphone|ipad|ipod/.test(userAgent) || (window.navigator.platform === 'MacIntel' && window.navigator.maxTouchPoints > 1);
    const isAndroid = /android/.test(userAgent);

    // Check if already installed (standalone mode)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;

    if (isStandalone) {
      setIsVisible(false);
      return;
    }

    if (isIos) {
      setPlatform('ios');
      // iOS doesn't have a specific event, so we show it after a comfortable delay
      const timer = setTimeout(() => setIsVisible(true), 3000);
      return () => clearTimeout(timer);
    } else {
      setPlatform(isAndroid ? 'android' : 'other');
      
      const handler = (e: any) => {
        // Prevent browser's default prompt from appearing automatically
        e.preventDefault();
        // Stash the event so it can be triggered later.
        setDeferredPrompt(e);
        // ONLY show the prompt visually when the system is actually ready
        setIsVisible(true);
      };

      window.addEventListener('beforeinstallprompt', handler);
      return () => window.removeEventListener('beforeinstallprompt', handler);
    }
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      // Native trigger - this will show the official system dialog
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsVisible(false);
      }
      setDeferredPrompt(null);
    }
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-24 inset-x-4 z-[60] md:bottom-8 md:right-8 md:left-auto md:w-80"
      >
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-lovelya-100 dark:border-gray-700 p-5 relative overflow-hidden">
          <button 
            onClick={() => setIsVisible(false)}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-400 hover:text-gray-600 transition"
          >
            <i className="fas fa-times"></i>
          </button>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-white dark:bg-gray-700 rounded-2xl flex items-center justify-center p-1 shadow-lg shrink-0 overflow-hidden border border-gray-100 dark:border-gray-600">
              <img src="/logo.svg" alt="LovSpeak Logo" className="w-full h-full object-contain" />
            </div>
            <div className="flex-1 pr-6">
              <h4 className="font-black text-gray-900 dark:text-white text-sm mb-1">Install LovSpeak</h4>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                {platform === 'ios' 
                  ? "Tap the 'Share' icon below and select 'Add to Home Screen' for a full app experience."
                  : "Install LovSpeak on your home screen for faster access and a better experience."}
              </p>
            </div>
          </div>

          {(platform === 'android' || platform === 'other') && (
            <button
              onClick={handleInstallClick}
              className="w-full mt-4 py-3 bg-lovelya-600 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg hover:bg-lovelya-700 transition active:scale-95 flex items-center justify-center gap-2"
            >
              <i className="fas fa-download"></i>
              {deferredPrompt ? "Install Now" : "Install App"}
            </button>
          )}

          {platform === 'ios' && (
            <div className="mt-4 flex items-center justify-center gap-4 text-lovelya-600">
               <div className="flex flex-col items-center gap-1">
                  <i className="fas fa-share-square text-lg"></i>
                  <span className="text-[8px] font-black uppercase">Share</span>
               </div>
               <i className="fas fa-arrow-right text-xs opacity-30"></i>
               <div className="flex flex-col items-center gap-1">
                  <i className="far fa-plus-square text-lg"></i>
                  <span className="text-[8px] font-black uppercase">Add to Home</span>
               </div>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default InstallPrompt;
