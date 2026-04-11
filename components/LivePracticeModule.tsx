
import React, { useRef, useEffect, useState } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { decodeAudioData, createPcmBlob, base64ToUint8Array } from '../utils/audio';
import { ModuleProps, AppView } from '../types';
import { logActivity, getGeminiApiKey, getUserProfile } from '../services/storage';

const STRICT_FILTER = `
STRICT CONTENT PROHIBITIONS:
- Do NOT generate ANY content related to: Music, singing, concerts, movies, cinema, yoga, meditation, dating, romance, Valentine's Day, Halloween, New Year's celebrations, magic, fantasy, horoscopes, alcohol, pork, gambling, or inappropriate free-mixing.
- Ensure all content respects Islamic values and modesty.
- RELIGIOUS SOURCE RULE: Strictly Quran and Sahih Hadith for religious facts.
`;

const drawVisualizer = (canvas: HTMLCanvasElement, dataArray: Uint8Array) => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const width = canvas.width;
  const height = canvas.height;
  ctx.clearRect(0, 0, width, height);
  
  const barWidth = (width / dataArray.length) * 2.5;
  let barHeight;
  let x = 0;

  for (let i = 0; i < dataArray.length; i++) {
    barHeight = dataArray[i] / 2;
    ctx.fillStyle = `rgba(96, 165, 250, ${Math.max(0.2, dataArray[i] / 255)})`;
    ctx.fillRect(x, height/2 - barHeight/2, barWidth, barHeight);
    x += barWidth + 1;
  }
};

const LivePracticeModule: React.FC<ModuleProps> = ({ initialContext, onComplete }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [status, setStatus] = useState('Ready to connect');
  const [customTopic, setCustomTopic] = useState(initialContext?.title || '');
  
  useEffect(() => {
    if (initialContext?.title) {
        setCustomTopic(initialContext.title);
    }
  }, [initialContext]);

  const activeSessionPromiseRef = useRef<Promise<any> | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sessionStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    return () => { stopSession(false); };
  }, []);

  const startSession = async () => {
    if (isConnecting || isConnected) return;
    setIsConnecting(true);
    setStatus('Connecting to AI...');

    try {
      let stream: MediaStream;
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error('Browser does not support microphone access or is in an insecure context');
        }

        // Use simpler constraints first to avoid OverconstrainedError on some mobile devices
        stream = await navigator.mediaDevices.getUserMedia({ 
          audio: true 
        });
      } catch (micErr: any) {
        console.error("Mic Error Detail:", micErr);
        let errorMsg = 'Microphone access denied';
        
        if (micErr.name === 'NotAllowedError') {
          errorMsg = 'Microphone permission blocked by browser';
        } else if (micErr.name === 'NotFoundError') {
          errorMsg = 'No microphone found on this device';
        } else if (micErr.name === 'NotReadableError') {
          errorMsg = 'Microphone is already in use by another app';
        } else if (micErr.message) {
          errorMsg = micErr.message;
        }
        
        setStatus(errorMsg);
        setIsConnecting(false);
        return;
      }
      
      streamRef.current = stream;

      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      
      await inputCtx.resume();
      await outputCtx.resume();

      inputAudioContextRef.current = inputCtx;
      outputAudioContextRef.current = outputCtx;

      const apiKey = getGeminiApiKey() || (process.env.API_KEY as string);
      if (!apiKey) {
        setStatus('API Key missing');
        setIsConnecting(false);
        return;
      }

      const ai = new GoogleGenAI({ apiKey });
      
      const profile = getUserProfile();
      const userName = profile.name || 'Student';

      let instructions = `You are Lovelya, a friendly and helpful English tutor and personal coach.
      This is a real-time voice conversation.

      ${STRICT_FILTER}

      YOUR PERSONALITY & BEHAVIOR:
      1. GREETING: Every time you start a new session, you MUST greet the user with "Assalamualaikum", address them by their name (${userName}), and introduce yourself as Lovelya. Use a warm and varied greeting each time.
      2. PATIENCE: You are speaking with a beginner. They will often pause to think. DO NOT interrupt them. Wait for a significantly longer silence than usual before you start responding. Give them space to finish their thoughts.
      3. RESPONSE LENGTH: Provide natural, flowing responses (3-5 sentences). Do not be too brief; the user needs to practice listening to complete thoughts.
      4. NATIVE COACH: Act as a linguist. If the user makes a mistake, correct it gently and briefly. More importantly, suggest how a native speaker would say it naturally (e.g., "That's good! A native speaker might say '...' to sound more fluent").
      5. CONFIDENCE BUILDER: Be extremely encouraging. Praise their effort and progress. Use a non-judgmental, warm tone.
      6. PROACTIVE SUGGESTIONS: If relevant, suggest better ways to structure their sentences or provide alternative vocabulary that fits the context better.`;
      
      if (initialContext) {
          instructions += `\nTopic: We are discussing "${initialContext.title}". Start by asking a question about this topic.`;
      } else if (customTopic.trim()) {
          instructions += `\nTopic: The user wants to discuss "${customTopic}". Start the conversation about this topic.`;
      } else {
          instructions += `\nStart by greeting the user and asking how their day is going.`;
      }

      const sessionPromise = ai.live.connect({
        model: 'gemini-3.1-flash-live-preview',
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
          systemInstruction: instructions,
        },
        callbacks: {
          onopen: () => {
            console.log("Session Opened");
            setIsConnected(true);
            setIsConnecting(false);
            setStatus(initialContext?.title || customTopic || 'Listening...');
            sessionStartTimeRef.current = Date.now();

            const source = inputCtx.createMediaStreamSource(stream);
            const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
            
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              
              if (canvasRef.current) {
                 const dataArray = new Uint8Array(100);
                 for(let i=0; i<100; i++) dataArray[i] = Math.abs(inputData[i * 40]) * 255;
                 drawVisualizer(canvasRef.current, dataArray);
              }

              const pcmBlob = createPcmBlob(inputData);
              sessionPromise.then((session) => {
                session.sendRealtimeInput({ audio: pcmBlob });
              });
            };
            
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputCtx.destination);
          },
          onmessage: async (msg: LiveServerMessage) => {
            const audioData = msg.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (audioData && outputAudioContextRef.current) {
                const ctx = outputAudioContextRef.current;
                nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
                const buffer = await decodeAudioData(base64ToUint8Array(audioData), ctx);
                const source = ctx.createBufferSource();
                source.buffer = buffer;
                source.connect(ctx.destination);
                source.addEventListener('ended', () => {
                    sourcesRef.current.delete(source);
                });
                source.start(nextStartTimeRef.current);
                nextStartTimeRef.current += buffer.duration;
                sourcesRef.current.add(source);
            }

            const interrupted = msg.serverContent?.interrupted;
            if (interrupted) {
                for (const source of sourcesRef.current.values()) {
                    try { source.stop(); } catch(e) {}
                    sourcesRef.current.delete(source);
                }
                nextStartTimeRef.current = 0;
            }
          },
          onclose: () => { 
              console.log("Session Closed");
              stopSession(false); 
          },
          onerror: (err) => { 
            console.error("Live Error:", err);
            setStatus("Connection Error");
            stopSession(false); 
          }
        }
      });

      activeSessionPromiseRef.current = sessionPromise;

    } catch (e) {
      console.error("Session Start Error:", e);
      setStatus('Connection failed');
      setIsConnecting(false);
    }
  };

  const stopSession = (triggerComplete = true) => {
    if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
        streamRef.current = null;
    }

    const closeCtx = async (ctx: AudioContext | null) => {
        if (ctx && ctx.state !== 'closed') {
            try { await ctx.close(); } catch(e) { console.error("Ctx close error", e); }
        }
    };
    closeCtx(inputAudioContextRef.current);
    closeCtx(outputAudioContextRef.current);
    inputAudioContextRef.current = null;
    outputAudioContextRef.current = null;
    
    if (isConnected && sessionStartTimeRef.current > 0) {
        logActivity({
            type: AppView.LIVE,
            date: new Date().toISOString(),
            durationSeconds: Math.round((Date.now() - sessionStartTimeRef.current) / 1000),
            score: 0,
            accuracy: 0,
            details: `Voice Call: ${initialContext?.title || customTopic || 'General'}`
        });
    }

    setIsConnected(false);
    setIsConnecting(false);
    activeSessionPromiseRef.current = null;
    if (status !== 'Connection Error') setStatus('Ready to practice');
    
    if (triggerComplete && onComplete) onComplete();
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-4 md:p-6 space-y-8 md:space-y-10 animate-fade-in">
      <div className="text-center">
        <h2 className="text-xl md:text-3xl font-extrabold text-gray-800 dark:text-white mb-2 md:mb-3">Live Session</h2>
        <div className={`inline-flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-full text-[10px] md:text-sm font-bold transition-all shadow-sm ${isConnected ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-gray-100 text-gray-500'}`}>
            <span className={`w-2 md:w-2.5 h-2 md:h-2.5 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></span>
            {status}
        </div>
      </div>

      <div className="relative w-48 h-48 md:w-64 md:h-64 flex items-center justify-center">
        <div className={`absolute inset-0 rounded-full border-2 transition-all duration-1000 ${isConnected ? 'border-lovelya-300 scale-125 opacity-40 animate-pulse' : 'border-gray-200 dark:border-gray-700'}`}></div>
        <div className={`absolute inset-0 rounded-full border-2 transition-all duration-1000 delay-100 ${isConnected ? 'border-lovelya-400 scale-110 opacity-60' : 'border-gray-200 dark:border-gray-700'}`}></div>
        
        <canvas ref={canvasRef} width="120" height="60" className="absolute z-20 md:w-[160px] md:h-[80px]"></canvas>
        
        <div className={`w-32 h-32 md:w-40 md:h-40 rounded-full bg-white dark:bg-gray-800 shadow-xl flex items-center justify-center z-10 transition-all duration-500 ${isConnected ? 'shadow-lovelya-200/50 scale-105' : 'border border-gray-100 dark:border-gray-700'}`}>
          <i className={`fas ${isConnected ? 'fa-microphone-alt text-lovelya-500 animate-pulse' : 'fa-phone-alt text-gray-300'} text-3xl md:text-5xl`}></i>
        </div>
      </div>

      <div className="w-full max-w-xs space-y-3 md:space-y-4">
        {!isConnected && !isConnecting && (
            <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 md:pl-4 flex items-center pointer-events-none">
                    <i className="fas fa-comment-dots text-gray-400 group-focus-within:text-lovelya-500 transition-colors text-sm md:text-base"></i>
                </div>
                <input
                    type="text"
                    value={customTopic}
                    onChange={(e) => setCustomTopic(e.target.value)}
                    placeholder="Enter a topic (e.g. Travel)..."
                    className="w-full py-3.5 md:py-4 pl-10 md:pl-12 pr-4 rounded-xl md:rounded-2xl bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 focus:border-lovelya-500 focus:ring-4 focus:ring-lovelya-100 dark:focus:ring-lovelya-900/30 outline-none transition-all font-medium text-xs md:text-base text-gray-700 dark:text-gray-200 placeholder-gray-400 shadow-sm text-center"
                />
            </div>
        )}

        {!isConnected ? (
          <button 
            onClick={startSession} 
            disabled={isConnecting} 
            className="w-full py-4 md:py-5 rounded-xl md:rounded-2xl bg-lovelya-600 text-white font-black text-base md:text-xl shadow-lg hover:bg-lovelya-700 transition transform hover:-translate-y-1 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 md:gap-3"
          >
            {isConnecting ? <><i className="fas fa-circle-notch fa-spin"></i> Connecting...</> : <><i className="fas fa-phone"></i> START CALL</>}
          </button>
        ) : (
          <button 
            onClick={() => stopSession(true)} 
            className="w-full py-3.5 md:py-4 rounded-xl md:rounded-2xl bg-red-500 text-white font-bold shadow-lg hover:bg-red-600 transition transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 md:gap-3 text-sm md:text-base"
          >
            <i className="fas fa-phone-slash"></i> END SESSION
          </button>
        )}
        <p className="text-center text-[10px] md:text-xs text-gray-400 font-medium italic px-4">
          Lovelya will listen continuously. Just speak naturally and wait for her response.
        </p>
      </div>
    </div>
  );
};

export default LivePracticeModule;
