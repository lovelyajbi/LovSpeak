import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Chat } from "@google/genai";
import ReactMarkdown from 'react-markdown';
import { getUserProfile } from '../services/storage';
import { transcribeAudio } from '../services/gemini';
import { ModuleProps } from '../types';

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

const QUICK_ACTIONS = [
  { label: "Correct my grammar", prompt: "Please review my last message and correct any grammar mistakes, explaining why." },
  { label: "Suggest a topic", prompt: "Can you suggest an interesting topic for us to discuss in English?" },
  { label: "Roleplay: Doctor", prompt: "Let's roleplay. You are a doctor and I am a patient. Start the conversation." },
  { label: "Translate to English", prompt: "How do I say 'Saya ingin belajar bahasa Inggris dengan cepat' in English?" },
  { label: "Explain Islamic term", prompt: "Can you explain the meaning of 'Taqwa' in English?" },
];

const ChatModule: React.FC<ModuleProps> = ({ onComplete }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [playingMessageId, setPlayingMessageId] = useState<string | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const chatSessionRef = useRef<Chat | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const userProfile = getUserProfile();
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    const loadVoices = () => setVoices(window.speechSynthesis.getVoices());
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    return () => window.speechSynthesis.cancel();
  }, []);

  useEffect(() => {
    const initChat = async () => {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const systemInstruction = `You are Lovelya, a friendly English tutor. Your student is ${userProfile.name} (Level: ${userProfile.level}). 
      - Keep your responses concise and friendly.
      - Use clear formatting (bullet points, bold text) for better readability.
      - BASE ISLAMIC ANSWERS ON AUTHENTIC SOURCES ONLY.
      - Avoid using too many symbols like asterisks if not for bolding.`;
      
      chatSessionRef.current = ai.chats.create({
        model: 'gemini-3-flash-preview',
        config: { systemInstruction }
      });
      setMessages([{ id: 'init', role: 'model', text: `Hello ${userProfile.name}! I'm Lovelya. Ready to practice English?`, timestamp: new Date() }]);
    };
    initChat();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isTyping, isTranscribing]);

  const handleSend = async (textOverride?: string) => {
    const textToSend = textOverride || input;
    if (!textToSend.trim() || !chatSessionRef.current) return;
    
    const userMsg: Message = { id: `user-${Date.now()}`, role: 'user', text: textToSend, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);
    setIsTyping(true);

    const aiMsgId = `ai-${Date.now()}`;
    const aiMsg: Message = { id: aiMsgId, role: 'model', text: '', timestamp: new Date() };
    setMessages(prev => [...prev, aiMsg]);

    try {
      const stream = await chatSessionRef.current.sendMessageStream({ message: textToSend });
      let fullText = '';
      
      for await (const chunk of stream) {
        const chunkText = chunk.text || "";
        fullText += chunkText;
        setMessages(prev => prev.map(m => m.id === aiMsgId ? { ...m, text: fullText } : m));
      }

      if (fullText.length < 150) speakText(fullText, aiMsgId);
    } catch (error) {
      setMessages(prev => prev.map(m => m.id === aiMsgId ? { ...m, text: "Connection error. Try again." } : m));
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  const speakText = (text: string, msgId: string) => {
    window.speechSynthesis.cancel();
    if (playingMessageId === msgId) { setPlayingMessageId(null); return; }
    setPlayingMessageId(msgId);
    const utterance = new SpeechSynthesisUtterance(text);
    const preferredVoice = voices.find(v => v.name.includes('Google US English')) || voices.find(v => v.lang === 'en-US');
    if (preferredVoice) utterance.voice = preferredVoice;
    utterance.onend = () => setPlayingMessageId(null);
    window.speechSynthesis.speak(utterance);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      mediaRecorder.ondataavailable = (event) => { if (event.data.size > 0) audioChunksRef.current.push(event.data); };
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setIsTranscribing(true);
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
          const base64 = (reader.result as string).split(',')[1];
          const text = await transcribeAudio(base64, 'audio/webm');
          setIsTranscribing(false);
          if (text?.trim()) handleSend(text);
        };
        stream.getTracks().forEach(t => t.stop());
      };
      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) { alert("Mic denied"); }
  };

  const stopRecording = () => { if (mediaRecorderRef.current && isRecording) { mediaRecorderRef.current.stop(); setIsRecording(false); } };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] md:h-[calc(100vh-140px)] max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden animate-fade-in mx-2 md:mx-auto">
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md p-4 md:p-6 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between z-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-lovelya-400 to-rose-500 flex items-center justify-center text-white shadow-lg text-xl">
            <i className="fas fa-robot"></i>
          </div>
          <div>
            <h3 className="text-lg font-black text-gray-900 dark:text-white tracking-tight">Lovelya AI</h3>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest">Always Here</span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 no-scrollbar bg-gray-50/30 dark:bg-gray-900/10" ref={scrollRef}>
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up`}>
            <div className={`
              group relative p-4 md:p-6 rounded-[2rem] shadow-sm text-sm md:text-base max-w-[85%] md:max-w-[80%] leading-relaxed
              ${msg.role === 'user' 
                ? 'bg-lovelya-600 text-white rounded-tr-none shadow-lovelya-200' 
                : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-white rounded-tl-none border border-gray-100 dark:border-gray-600'}
            `}>
              <div className="prose dark:prose-invert prose-sm max-w-none">
                <ReactMarkdown>{msg.text}</ReactMarkdown>
              </div>
              
              {msg.role === 'model' && (
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-600/50 flex items-center justify-between">
                  <button 
                    onClick={() => speakText(msg.text, msg.id)} 
                    className={`
                      flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition
                      ${playingMessageId === msg.id 
                        ? 'bg-lovelya-100 text-lovelya-600 dark:bg-lovelya-900/30' 
                        : 'bg-gray-50 text-gray-400 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-600'}
                    `}
                  >
                    <i className={`fas ${playingMessageId === msg.id ? 'fa-stop' : 'fa-volume-up'}`}></i>
                    {playingMessageId === msg.id ? 'Stop' : 'Listen'}
                  </button>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex gap-2 items-center text-[10px] font-black text-gray-400 uppercase tracking-widest animate-pulse">
            <div className="flex gap-1">
              <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"></div>
              <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce delay-75"></div>
              <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce delay-150"></div>
            </div>
            Lovelya is typing
          </div>
        )}
        {isTranscribing && (
          <div className="flex gap-2 items-center text-[10px] font-black text-lovelya-500 uppercase tracking-widest animate-pulse">
            <i className="fas fa-wave-square"></i> Transcribing audio...
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 md:p-8 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700">
        <div className="flex gap-2 overflow-x-auto pb-4 mb-4 no-scrollbar">
           {QUICK_ACTIONS.map((a, idx) => (
             <button 
               key={idx} 
               onClick={() => handleSend(a.prompt)} 
               className="whitespace-nowrap px-4 py-2 bg-lovelya-50 dark:bg-gray-900/30 text-lovelya-700 dark:text-lovelya-300 text-[10px] font-black rounded-full border border-lovelya-100 dark:border-lovelya-800 hover:bg-lovelya-100 transition shadow-sm uppercase tracking-widest"
             >
               {a.label}
             </button>
           ))}
        </div>
        <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-900 p-2 rounded-[2rem] border border-gray-100 dark:border-gray-800 focus-within:border-lovelya-500 transition-all">
          <button 
            onMouseDown={startRecording} 
            onMouseUp={stopRecording} 
            className={`w-12 h-12 rounded-full flex items-center justify-center text-lg transition-all ${isRecording ? 'bg-red-500 text-white animate-pulse scale-110' : 'bg-white dark:bg-gray-800 text-gray-400 hover:text-lovelya-600 shadow-sm'}`}
          >
            <i className="fas fa-microphone"></i>
          </button>
          <input 
            value={input} 
            onChange={e => setInput(e.target.value)} 
            onKeyDown={e => e.key === 'Enter' && handleSend()} 
            placeholder="Type your message here..." 
            className="flex-1 bg-transparent outline-none text-sm md:text-base font-medium px-2" 
          />
          <button 
            onClick={() => handleSend()} 
            className="w-12 h-12 rounded-full bg-lovelya-600 text-white flex items-center justify-center text-lg shadow-lg shadow-lovelya-200 hover:bg-lovelya-700 transition-all active:scale-95"
          >
            <i className="fas fa-paper-plane"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatModule;
