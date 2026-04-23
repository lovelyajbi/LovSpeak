
import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';
import { checkActivationCode, activateUser, saveGeminiApiKey } from '../../services/storage';

export const ActivationPage: React.FC = () => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { refreshStatus, signout } = useAuth();

  const handleActivate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const isValid = await checkActivationCode(code.trim());
    if (isValid) {
      await activateUser();
      await refreshStatus();
    } else {
      setError('Invalid activation code. Please contact the administrator.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-mesh dark:bg-mesh-dark p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-gray-800 w-full max-w-md rounded-[2.5rem] shadow-2xl p-10 border border-gray-100 dark:border-gray-700 text-center"
      >
        <div className="w-24 h-24 bg-white dark:bg-gray-800 rounded-3xl flex items-center justify-center shadow-xl shadow-lovelya-200/20 mx-auto mb-8 overflow-hidden border border-gray-100 dark:border-gray-800">
          <img 
            src="/logo.svg?v=1.0.2" 
            alt="Lovelya Logo" 
            className="w-full h-full object-contain p-2" 
          />
        </div>
        <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-4">Activate Access</h2>
        <p className="text-gray-500 font-medium mb-8">Enter the master activation code to unlock your premium learning experience.</p>
        
        <form onSubmit={handleActivate} className="space-y-6">
          <div className="relative group">
            <input 
              type="text" 
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="LOVSPEAK-XXXX-XXXX"
              className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-900 border-2 border-transparent focus:border-lovelya-500 rounded-2xl font-bold text-center tracking-widest transition-all outline-none"
              required
            />
            <div className="mt-3">
              <a 
                href="https://lovelya-edu.myscalev.com/lovspeak1" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs font-bold text-lovelya-600 hover:text-lovelya-700 underline transition-colors"
              >
                Belum punya kode? Dapatkan kode akses di sini
              </a>
            </div>
            {error && <p className="text-rose-500 text-xs font-bold mt-2">{error}</p>}
          </div>
          
          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-lovelya-600 text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-lovelya-200 hover:bg-lovelya-700 transition active:scale-95 disabled:opacity-50"
          >
            {loading ? <i className="fas fa-spinner fa-spin"></i> : 'Activate Now'}
          </button>
        </form>
        
        <button 
          onClick={signout}
          className="mt-8 text-gray-400 hover:text-gray-600 font-bold text-sm transition"
        >
          Sign Out
        </button>
      </motion.div>
    </div>
  );
};

export const ApiKeySetupPage: React.FC = () => {
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { refreshStatus, signout } = useAuth();

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey) {
      setError('Silakan masukkan API Key Anda terlebih dahulu.');
      return;
    }
    if (apiKey.trim().length < 5) {
      setError('Format API Key sepertinya terlalu pendek atau tidak valid. Silakan cek kembali kuncinya.');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      console.log("Attempting to save API Key...");
      await saveGeminiApiKey(apiKey.trim());
      console.log("API Key saved. Refreshing status...");
      await refreshStatus();
      console.log("Status refreshed.");
    } catch (err: any) {
      console.error("Save API Key Error:", err);
      setError('Gagal menyimpan API Key: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-mesh dark:bg-mesh-dark p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-gray-800 w-full max-w-lg rounded-[2.5rem] shadow-2xl p-10 border border-gray-100 dark:border-gray-700"
      >
        <div className="text-center mb-10">
          <div className="w-24 h-24 bg-white dark:bg-gray-800 rounded-3xl flex items-center justify-center shadow-xl shadow-lovelya-200/20 mx-auto mb-6 overflow-hidden border border-gray-100 dark:border-gray-700">
            <img 
              src="/logo.svg?v=1.0.2" 
              alt="Lovelya Logo" 
              className="w-full h-full object-contain p-2" 
            />
          </div>
          <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-4">Connect AI</h2>
          <p className="text-gray-500 font-medium">To provide personalized feedback, LovSpeak uses your own AI API Key. Your key is stored locally on your device and never shared.</p>
        </div>
        
        <form onSubmit={handleSave} className="space-y-8">
          <div className="space-y-3">
            <label className="block text-sm font-black text-gray-400 uppercase tracking-widest px-1">AI API Key</label>
            <input 
              type="password" 
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Masukkan API Key Anda di sini..."
              className="w-full px-5 py-3 md:px-6 md:py-4 bg-gray-50 dark:bg-gray-900 border-2 border-transparent focus:border-lovelya-500 rounded-2xl font-bold transition-all outline-none text-sm md:text-base"
              required
            />
            <div className="flex items-center gap-2 p-3 md:p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-800">
              <i className="fas fa-info-circle text-blue-500 text-xs"></i>
              <p className="text-[9px] md:text-xs text-blue-700 dark:text-blue-300 font-bold leading-relaxed">
                Butuh kunci? <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="underline hover:text-blue-900">Dapatkan AI API Key gratis di sini</a>.
              </p>
            </div>
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-[10px] md:text-xs font-bold flex items-center gap-2"
              >
                <i className="fas fa-exclamation-triangle"></i>
                {error}
              </motion.div>
            )}
          </div>
          
          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-lovelya-600 text-white py-3.5 md:py-4 rounded-2xl font-black text-base md:text-lg shadow-xl shadow-lovelya-200 hover:bg-lovelya-700 transition active:scale-95 disabled:opacity-50"
          >
            {loading ? <i className="fas fa-spinner fa-spin"></i> : 'Connect & Start Learning'}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-gray-100 dark:border-gray-700 pt-6">
            <button 
                onClick={signout}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 font-bold text-sm transition flex items-center gap-2 mx-auto justify-center"
            >
                <i className="fas fa-sign-out-alt"></i> Sign Out
            </button>
        </div>
      </motion.div>
    </div>
  );
};
