
import { GoogleGenAI, Type, Modality, ThinkingLevel } from "@google/genai";
import { ReadingContent, GrammarResult, AssessmentQuestion, AssessmentResult, QuizQuestion } from "../types";
import { getGeminiApiKey, getAppLanguage } from "./storage";

declare global {
    interface Window {
        aistudio?: {
            openSelectKey?: () => void;
            hasSelectedApiKey?: () => Promise<boolean>;
        };
    }
}

const getAiClient = () => {
    const apiKey = getGeminiApiKey();
    if (!apiKey) {
        throw new Error("AI API Key not found. Please set it in your settings.");
    }
    return new GoogleGenAI({ apiKey });
};

export const safeParseJSON = (text: string | undefined, fallback: any) => {
    if (!text) return fallback;
    let cleanText = text.trim();
    cleanText = cleanText.replace(/^```(json|JSON)?|```$/g, '').trim();
    const firstBrace = cleanText.search(/[{[]/);
    if (firstBrace !== -1) {
        const lastClose = cleanText.lastIndexOf(cleanText[firstBrace] === '{' ? '}' : ']');
        if (lastClose !== -1 && lastClose > firstBrace) {
            cleanText = cleanText.substring(firstBrace, lastClose + 1);
        }
    }
    try { return JSON.parse(cleanText); } catch (e) { return fallback; }
};

const handleApiError = (e: any) => {
    console.error("Gemini API Error:", e);
    if (e.message?.includes("Requested entity was not found")) {
        window.aistudio?.openSelectKey?.();
    }
    throw e;
};

const STRICT_FILTER = `
STRICT CONTENT PROHIBITIONS:
- Do NOT generate ANY content related to: Music, singing, concerts, movies, cinema, yoga, meditation, dating, romance, Valentine's Day, Halloween, New Year's celebrations, magic, fantasy, horoscopes, alcohol, pork, gambling, or inappropriate free-mixing.
- Ensure all content respects Islamic values and modesty.
- RELIGIOUS SOURCE RULE: Strictly Quran and Sahih Hadith for religious facts.
`;

const getLanguageInstruction = () => {
    const lang = getAppLanguage();
    return lang === 'id'
        ? "IMPORTANT: Provide all feedback, explanations, and insights in INDONESIAN language. The English learning content itself must remain in English."
        : "IMPORTANT: Provide all feedback, explanations, and insights in ENGLISH language.";
};

export const analyzeDiaryEntry = async (text: string, level: string): Promise<GrammarResult> => {
    try {
        const ai = getAiClient();
        const prompt = `
        Act as a friendly English Tutor and Islamic Coach. 
        User Level: ${level}
        Diary Content: "${text}"
        ${getLanguageInstruction()}

        TASK:
        1. Perform a deep grammar and vocabulary analysis.
        2. Identify specific mistakes but DO NOT change the user's original text in your final feedback string.
        3. For each mistake, provide the original snippet, the recommendation, and a short explanation.
        4. Based on the diary's topic, provide one relevant "Islamic Insight" (Quran verse or Hadith) that matches the mood (gratitude, struggle, joy, etc.).

        STRICT FILTER: ${STRICT_FILTER}

        Return JSON: { 
            "score": 0-100, 
            "generalFeedback": "A short summary of their writing quality.", 
            "errors": [{ "mistake": "snippet", "correction": "fixed version", "explanation": "why" }],
            "islamicInsight": "A relevant spiritual reminder based on their day's story."
        }`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-lite',
            contents: prompt,
            config: {
                responseMimeType: 'application/json'
            }
        });
        return safeParseJSON(response.text, { correctedText: text, generalFeedback: 'Analysis failed', errors: [], score: 0 });
    } catch (e) { return handleApiError(e); }
};

// --- ASSESSMENT SERVICES ---

export const generateAssessmentTest = async (): Promise<AssessmentQuestion[]> => {
    try {
        const ai = getAiClient();
        const prompt = `
        Generate a FAST 10-item English Placement Test.
        STRUCTURE (MUST BE 3-5-2):
        1. Q1-Q3: TYPE speaking. Prompt the user to tell a short story or describe something (e.g., "Describe your favorite place for peace" or "Tell me about a person you admire"). 
        2. Q4-Q8: TYPE grammar. Multiple choice (4 options) on structures (Tenses, Modals, Conditionals).
        3. Q9-Q10: TYPE writing. Short essay questions.

        Themes: Character, Education, or Daily Life.
        Content Filter: ${STRICT_FILTER}
        Return JSON: { "questions": [{ "id": "string", "type": "speaking"|"grammar"|"writing", "prompt": "string", "options": ["str"], "correctIndex": 0 }] }
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
            config: {
                responseMimeType: 'application/json'
            }
        });
        const data = safeParseJSON(response.text, { questions: [] });
        return data.questions;
    } catch (e) { return handleApiError(e); }
};

export const evaluateAssessment = async (responses: any[]): Promise<AssessmentResult> => {
    try {
        const ai = getAiClient();
        const summaryData = responses.map((r, idx) => ({
            questionNumber: idx + 1,
            type: r.type,
            prompt: r.originalQuestion.prompt,
            answer: r.type === 'speaking' ? `[See Audio Part ${idx + 1}]` : (r.type === 'writing' ? r.textAnswer : r.originalQuestion.options[r.selectedOption]),
            isCorrect: r.type === 'grammar' ? (r.selectedOption === r.originalQuestion.correctIndex) : null
        }));

        const contentParts: any[] = [
            {
                text: `Act as a senior English linguist and CEFR examiner. 
              Analyze the following 10 responses (including audio recordings) to determine the user's English proficiency level (A1-C2).
              ${getLanguageInstruction()}
              
              USER RESPONSES SUMMARY:
              ${JSON.stringify(summaryData, null, 2)}

              INSTRUCTIONS:
              1. Listen to each audio part provided below.
              2. Evaluate the speaking fluency, pronunciation, and grammar in the audio.
              3. Evaluate the writing complexity and accuracy in the text answers.
              4. Provide a final CEFR level and detailed feedback.

              Return JSON: {
                "detectedLevel": "A1"|"A2"|"B1"|"B2"|"C1"|"C2",
                "overallScore": 0-100,
                "sections": {
                    "speaking": { "score": 0-100, "feedback": "string" },
                    "grammar": { "score": 0-100, "feedback": "string" },
                    "writing": { "score": 0-100, "feedback": "string" }
                },
                "recommendedFocus": ["string"],
                "summary": "string"
              }
            `}
        ];

        responses.forEach((r, idx) => {
            if (r.type === 'speaking' && r.audioBase64) {
                contentParts.push({ text: `--- AUDIO PART ${idx + 1} ---` });
                contentParts.push({ inlineData: { mimeType: 'audio/webm', data: r.audioBase64 } });
            }
        });

        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: { parts: contentParts },
            config: {
                responseMimeType: 'application/json'
            }
        });

        return safeParseJSON(response.text, { detectedLevel: 'A1', overallScore: 0 });
    } catch (e) {
        console.error("Evaluation Error Details:", e);
        return handleApiError(e);
    }
};

// --- GRAMMAR SERVICES ---

export const generateGrammarTask = async (lessonTitle: string): Promise<string> => {
    try {
        const ai = getAiClient();
        const prompt = `Create a specific English writing task for the grammar topic: "${lessonTitle}". 
        - Max 2 sentences of instruction for the main task.
        - Add a "Hint" section if there are specific tips or examples.
        - Format: [TASK] Main instruction here. [HINT] Tips or examples here.
        - NO introductory or conversational fluff.
        ${getLanguageInstruction()} 
        ${STRICT_FILTER}`;
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-lite',
            contents: prompt,
            config: {
            }
        });
        return response.text?.trim() || `Write 3-5 sentences practicing ${lessonTitle}.`;
    } catch (e) { return handleApiError(e); }
};

export const analyzeGrammar = async (text: string, taskContext: string): Promise<GrammarResult> => {
    try {
        const ai = getAiClient();
        const prompt = `
        Analyze this English writing for grammar. Task: ${taskContext}. Text: "${text}".
        ${getLanguageInstruction()}
        Return JSON: { "correctedText": "...", "generalFeedback": "...", "score": 0-100, "errors": [{ "mistake": "...", "correction": "...", "explanation": "..." }] }`;
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-lite',
            contents: prompt,
            config: {
                responseMimeType: 'application/json'
            }
        });
        return safeParseJSON(response.text, { correctedText: text, generalFeedback: 'Error', errors: [], score: 0 });
    } catch (e) { return handleApiError(e); }
};

export const generateGrammarQuiz = async (lessonTitle: string, content: string, level: string): Promise<QuizQuestion[]> => {
    try {
        const ai = getAiClient();
        const prompt = `Create 10 MCQ English quiz items for: "${lessonTitle}" at ${level} level. 
        ${getLanguageInstruction()}
        ${STRICT_FILTER}
        Return JSON: { "quiz": [{ "question": "...", "options": ["4 options"], "correctIndex": 0, "explanation": "..." }] }`;
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-lite',
            contents: prompt,
            config: {
                responseMimeType: 'application/json'
            }
        });
        const data = safeParseJSON(response.text, { quiz: [] });
        return data.quiz;
    } catch (e) { return handleApiError(e); }
};

// --- GAME SERVICES ---

export const generateGameData = async (category: string, context: string, level: number, count: number): Promise<any[]> => {
    try {
        const ai = getAiClient();
        let schemaPrompt = "";
        switch (category) {
            case 'visual': schemaPrompt = `{ "data": [{ "emojis": "string", "answer": "string", "clue": "string" }] }`; break;
            case 'knowledge': schemaPrompt = `{ "data": [{ "question": "string", "options": ["4 strings"], "correctIndex": 0 }] }`; break;
            case 'grammar_strike': schemaPrompt = `{ "data": [{ "sentence_with_error": "string", "correction": "string" }] }`; break;
            case 'odd_one_out': schemaPrompt = `{ "data": [{ "words": ["4 strings"], "intruder_index": 0 }] }`; break;
            case 'arcade': schemaPrompt = `{ "data": [{ "word": "string", "definition": "string" }] }`; break;
            case 'scramble': schemaPrompt = `{ "data": [{ "sentence": "string" }] }`; break;
            case 'interpreter': schemaPrompt = `{ "data": [{ "indonesian": "string", "english": "string" }] }`; break;
            case 'read_aloud': schemaPrompt = `{ "data": [{ "text": "string" }] }`; break;
        }

        const prompt = `Generate ${count} English items for "${category}" in "${context}" context, level ${level}/20. 
        ${getLanguageInstruction()}
        ${STRICT_FILTER} Structure: ${schemaPrompt}`;
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-lite',
            contents: prompt,
            config: {
                responseMimeType: 'application/json'
            }
        });
        return safeParseJSON(response.text, { data: [] }).data || [];
    } catch (e) { return handleApiError(e); }
};

// --- READING & LISTENING SERVICES ---

export const generateReadingTitles = async (level: string, theme: string, isIslamic: boolean): Promise<string[]> => {
    try {
        const ai = getAiClient();
        const prompt = `Generate 12 unique and catchy English reading titles for level ${level}, theme: ${theme}. 
        Provide a variety of styles (e.g., narrative, informative, reflective).
        ${isIslamic ? 'Include Islamic context and values.' : ''} 
        ${STRICT_FILTER} 
        Return JSON: { "titles": ["string"] }`;
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-lite',
            contents: prompt,
            config: {
                responseMimeType: 'application/json'
            }
        });
        return safeParseJSON(response.text, { titles: [] }).titles;
    } catch (e) { return handleApiError(e); }
};

export const generateReadingContentStream = async (title: string, level: string, theme: string, isIslamic: boolean) => {
    try {
        const ai = getAiClient();
        const prompt = `Write a short English reading passage (3-5 paragraphs) titled "${title}" for level ${level}. 
        Theme: ${theme}. 
        ${isIslamic ? 'Ensure content reflects Islamic wisdom and character.' : ''}
        ${STRICT_FILTER} 
        Return JSON structure but as a stream: { "title": "${title}", "paragraphs": ["string"] }`;

        return await ai.models.generateContentStream({
            model: 'gemini-2.5-flash-lite',
            contents: prompt,
            config: {
                responseMimeType: 'application/json'
            }
        });
    } catch (e) { return handleApiError(e); }
};

export const generateReadingContent = async (title: string, level: string, theme: string, isIslamic: boolean): Promise<ReadingContent> => {
    try {
        const ai = getAiClient();
        const prompt = `Write a short English reading passage (3-5 paragraphs) titled "${title}" for level ${level}. 
        Theme: ${theme}. 
        ${isIslamic ? 'Ensure content reflects Islamic wisdom and character.' : ''}
        ${STRICT_FILTER} 
        Return JSON: { "title": "${title}", "paragraphs": ["string"] }`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-lite',
            contents: prompt,
            config: {
                responseMimeType: 'application/json'
            }
        });
        return safeParseJSON(response.text, { title, paragraphs: [] });
    } catch (e) { return handleApiError(e); }
};

export const generateListeningTitles = async (level: string, type: string, theme: string, isIslamic: boolean): Promise<string[]> => {
    try {
        const ai = getAiClient();
        const prompt = `Generate 12 unique and catchy English listening ${type} titles for level ${level}, theme: ${theme}. 
        Provide a variety of scenarios and contexts.
        ${isIslamic ? 'Include Islamic context and values.' : ''} 
        ${STRICT_FILTER} 
        Return JSON: { "titles": ["string"] }`;
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-lite',
            contents: prompt,
            config: {
                responseMimeType: 'application/json'
            }
        });
        return safeParseJSON(response.text, { titles: [] }).titles;
    } catch (e) { return handleApiError(e); }
};

export const generateListeningScript = async (title: string, level: string, type: string, theme: string, isIslamic: boolean): Promise<string> => {
    try {
        const ai = getAiClient();
        const prompt = `Write a natural and comprehensive English ${type} script for level ${level} titled "${title}". 
        Theme: ${theme}. 
        ${isIslamic ? 'Ensure the content reflects Islamic manners and vocabulary.' : ''}
        ${type === 'dialogue' ? 'IMPORTANT: Use "Person A" and "Person B" as the names of the speakers. Create an engaging dialogue with 22-26 turns of conversation (back and forth) where each turn consists of 1-3 sentences to ensure a duration of approximately 2 minutes.' : 'Aim for a word count of approximately 380-420 words to ensure a duration of approximately 2 minutes.'}
        ${STRICT_FILTER} 
        Return only the plain text script.`;
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-lite',
            contents: prompt,
            config: {
            }
        });
        return response.text || "";
    } catch (e) { return handleApiError(e); }
};

export const generateListeningQuiz = async (script: string, level: string): Promise<QuizQuestion[]> => {
    try {
        const ai = getAiClient();
        const prompt = `Create 5 MCQ comprehension questions for this English script at ${level} level: "${script}". 
        ${getLanguageInstruction()}
        ${STRICT_FILTER}
        Return JSON: { "quiz": [{ "question": "...", "options": ["4 options"], "correctIndex": 0, "explanation": "..." }] }`;
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-lite',
            contents: prompt,
            config: {
                responseMimeType: 'application/json'
            }
        });
        return safeParseJSON(response.text, { quiz: [] }).quiz;
    } catch (e) { return handleApiError(e); }
};

export const analyzePronunciationAudio = async (text: string, base64: string, mime: string) => {
    try {
        const ai = getAiClient();
        const prompt = `Analyze the user's pronunciation for the following text:
        "${text}"
        
        ${getLanguageInstruction()}
        
        Compare the provided audio with the target text. 
        1. Evaluate overall score (0-100).
        2. Evaluate accuracy percentage (0-100).
        3. Provide helpful feedback on how to improve.
        4. Provide a word-by-word analysis. For EVERY word in the target text, indicate if it was pronounced correctly or incorrectly.
        
        IMPORTANT: The "wordAnalysis" array MUST have the EXACT same number of elements as there are words in the target text, in the EXACT same order.
        
        Return JSON structure:
        {
          "score": number,
          "accuracy": number,
          "feedback": "string",
          "wordAnalysis": [
            { "word": "string", "status": "correct" | "incorrect", "errorDetails": "string (optional)" }
          ]
        }`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-lite',
            contents: {
                parts: [
                    { inlineData: { data: base64, mimeType: mime } },
                    { text: prompt }
                ]
            },
            config: {
                responseMimeType: 'application/json'
            }
        });

        const result = safeParseJSON(response.text, null);
        if (!result || typeof result.score !== 'number') {
            throw new Error("Invalid analysis format from AI");
        }
        return result;
    } catch (e) {
        console.error("Pronunciation Analysis Error:", e);
        return {
            score: 0,
            accuracy: 0,
            feedback: "We couldn't analyze your audio clearly. Please try recording again in a quieter environment.",
            wordAnalysis: []
        };
    }
};

export const transcribeAudio = async (base64: string, mime: string): Promise<string> => {
    try {
        const ai = getAiClient();
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-lite',
            contents: {
                parts: [
                    { inlineData: { data: base64, mimeType: mime } },
                    { text: "Transcribe this English audio precisely. Return only the transcription." }
                ]
            },
            config: {
            }
        });
        return response.text?.trim() || "";
    } catch (e) { return handleApiError(e); }
};

export const generateTTSAudio = async (text: string, type: string): Promise<string> => {
    try {
        const ai = getAiClient();
        const config: any = {
            responseModalities: [Modality.AUDIO],
        };

        if (type === 'dialogue') {
            // Use multi-speaker for dialogues
            config.speechConfig = {
                multiSpeakerVoiceConfig: {
                    speakerVoiceConfigs: [
                        { speaker: 'Person A', voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Puck' } } },
                        { speaker: 'Person B', voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } }
                    ]
                }
            };
        } else {
            // Single speaker for monologue
            config.speechConfig = {
                voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } }
            };
        }

        const prompt = type === 'dialogue'
            ? `Read this conversation naturally between two people. Use expressive tones, natural emotions, and appropriate pauses: \n\n${text}`
            : `Read this monologue naturally with a clear, engaging, and expressive voice. Use natural intonation: \n\n${text}`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-tts",
            contents: [{ parts: [{ text: prompt }] }],
            config
        });
        return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data || "";
    } catch (e) { return handleApiError(e); }
};

export interface TranslationResult {
    translation: string;
    synonyms?: string[];
    examples?: string[];
}

export const translateText = async (text: string, direction: 'en-id' | 'id-en'): Promise<TranslationResult> => {
    try {
        const ai = getAiClient();
        const prompt = `
        ${direction === 'en-id' ? `Translate to Indonesian: "${text}"` : `Translate to English: "${text}"`}
        
        TASK:
        1. Provide the most natural translation.
        2. If the input is a single word, provide 3-5 synonyms in the TARGET language.
        3. Provide 2 natural example sentences in the TARGET language (or English if the target is Indonesian, for educational value).
        
        Return JSON structure:
        {
            "translation": "string",
            "synonyms": ["string"],
            "examples": ["string"]
        }`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-lite',
            contents: prompt,
            config: {
                responseMimeType: 'application/json'
            }
        });
        return safeParseJSON(response.text, { translation: text, synonyms: [], examples: [] });
    } catch (e) {
        handleApiError(e);
        return { translation: text, synonyms: [], examples: [] };
    }
};

export const getWordIPA = async (word: string): Promise<string> => {
    try {
        const ai = getAiClient();
        const prompt = `Give the International Phonetic Alphabet (IPA) for the English word: "${word}". Return only the IPA symbols in slashes.`;
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-lite',
            contents: prompt,
            config: {
            }
        });
        return response.text?.trim() || "";
    } catch (e) { return ""; }
};

export const generateSingleReadingTitle = async (level: string, theme: string, isIslamic: boolean) => {
    try {
        const ai = getAiClient();
        const prompt = `Generate ONE unique and catchy English reading title for level ${level}, theme: ${theme}. 
        ${isIslamic ? 'Include Islamic context.' : ''} 
        ${STRICT_FILTER} 
        Return JSON: { "title": "string" }`;
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-lite',
            contents: prompt,
            config: {
                responseMimeType: 'application/json'
            }
        });
        return safeParseJSON(response.text, { title: "New Topic" }).title;
    } catch (e) { return "New Topic"; }
};

export const generateSingleListeningTitle = async (level: string, type: string, theme: string, isIslamic: boolean) => {
    try {
        const ai = getAiClient();
        const prompt = `Generate ONE unique and catchy English listening ${type} title for level ${level}, theme: ${theme}. 
        ${isIslamic ? 'Include Islamic context.' : ''} 
        ${STRICT_FILTER} 
        Return JSON: { "title": "string" }`;
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-lite',
            contents: prompt,
            config: {
                responseMimeType: 'application/json'
            }
        });
        return safeParseJSON(response.text, { title: "New Topic" }).title;
    } catch (e) { return "New Topic"; }
};

export const generateWeeklyInsight = async (logs: any[], profileName: string): Promise<string> => {
    try {
        const ai = getAiClient();
        const prompt = `
        Act as a VERY warm, friendly, and compassionate English Tutor and Islamic Coach.
        Generate a "Weekly AI Insight" for the user named ${profileName}.
        
        USER DATA (Last 7 Days Activity Logs):
        ${JSON.stringify(logs, null, 2)}
        
        ${getLanguageInstruction()}
        
        TASK:
        1. Analyze the logs. If the user was active, highlight their best achievements with pride and joy.
        2. IF THE USER WAS INACTIVE OR RARELY USED THE APP: Provide a HEARTWARMING, KIND, and HIGHLY ENCOURAGING message.
           - Use words that show empathy (e.g., "I missed seeing you", "It's okay to take a break").
           - Gently remind them that even 5 minutes of learning is better than nothing.
           - Share an Islamic bit of wisdom about persistence and Allah's love for small, consistent deeds.
        3. Keep the insight concise (max 300 characters).
        4. Use a very human, friendly tone – NO ROBOTIC LANGUAGE.
        5. The goal is to make the user feel LOVED and SUPPORTED, never judged.
        
        STRICT FILTER: ${STRICT_FILTER}
        
        Return only the plain text insight (no quotes in the response).
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
            config: {
            }
        });
        return response.text?.trim() || "";
    } catch (e) {
        console.error("Weekly Insight Error:", e);
        return `"Keep up the great work, ${profileName}! Consistency is the key to mastering a new language. You're doing better than you think!"`;
    }
};
