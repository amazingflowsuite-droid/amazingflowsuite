
import { useState, useRef, useEffect } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Terminal, Send, Copy, Key } from 'lucide-react';
import { Button } from '@/components/ui/button'; // Assuming shadcn ui
import { supabase } from '@/lib/supabase';
import { QUESTIONS } from '../data/questions';
export default function GeneratorPage() {
    const [apiKey, setApiKey] = useState(import.meta.env.VITE_GEMINI_API_KEY || '');
    const [topic, setTopic] = useState('');
    const [logs, setLogs] = useState<string[]>(['> AMAZING LEARNING AI GENERATOR V1.0', '> SYSTEM READY...']);
    const [generatedQuestions, setGeneratedQuestions] = useState<any[]>([]); // Using any for transition to TrilingualQuestion
    const [isGenerating, setIsGenerating] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    const [modelName, setModelName] = useState("gemini-1.5-flash");
    const [availableModels, setAvailableModels] = useState<string[]>([]);
    const [isSaving, setIsSaving] = useState(false);

    // New Configuration State
    const [questionCount, setQuestionCount] = useState(5);
    // Language is now auto-handled (trilingual)
    const [selectedIndices, setSelectedIndices] = useState<number[]>([]);

    const addLog = (msg: string) => {
        setLogs(prev => [...prev, `> ${msg}`]);
    };

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [logs]);

    // Auto-fetch models on load or key change
    useEffect(() => {
        if (apiKey) {
            fetchAvailableModels(apiKey);
        }
    }, [apiKey]);

    const fetchAvailableModels = async (key: string) => {
        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);
            const data = await response.json();

            if (data.models) {
                const supportedModels = data.models
                    .filter((m: any) => m.supportedGenerationMethods?.includes("generateContent"))
                    .map((m: any) => m.name.replace('models/', ''));

                if (supportedModels.length > 0) {
                    setAvailableModels(supportedModels);
                    // If current model is not in list, switch to the first available one (preferring gemini-pro or 1.5-flash)
                    if (!supportedModels.includes(modelName)) {
                        const preferred = supportedModels.find((m: string) => m.includes("flash")) ||
                            supportedModels.find((m: string) => m.includes("pro")) ||
                            supportedModels[0];
                        setModelName(preferred);
                        addLog(`SYSTEM: AUTO-SWITCHED TO AVAILABLE MODEL: ${preferred}`);
                    }
                }
            }
        } catch (error) {
            console.error("Failed to fetch models", error);
        }
    };

    const handleSystemCheck = async () => {
        if (!apiKey) {
            addLog("ERROR: API KEY REQUIRED FOR SYSTEM CHECK.");
            return;
        }
        addLog("RUNNING SYSTEM DIAGNOSTICS...");
        addLog(`CHECKING AVAILABLE MODELS FOR API KEY...`);

        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
            const data = await response.json();

            if (data.error) {
                throw new Error(data.error.message);
            }

            if (data.models) {
                addLog(`SUCCESS: ${data.models.length} MODELS FOUND.`);
                data.models.forEach((m: any) => {
                    const isSupported = m.supportedGenerationMethods?.includes("generateContent");
                    if (isSupported) {
                        const name = m.name.replace('models/', '');
                        addLog(`  - ${name} ${name === modelName ? '(ACTIVE)' : ''}`);
                    }
                });
            } else {
                addLog("WARNING: NO MODELS RETURNED.");
            }
        } catch (error: any) {
            addLog(`DIAGNOSTIC FAILED: ${error.message}`);
        }
    };

    const handleGenerate = async () => {
        if (!apiKey) {
            addLog("ERROR: API KEY MISSING. PLEASE CONFIGURE VITE_GEMINI_API_KEY OR ENTER BELOW.");
            return;
        }
        if (!topic) return;

        setIsGenerating(true);
        addLog(`INITIATING GENERATION SEQUENCE FOR TOPIC: "${topic}"...`);
        addLog(`USING MODEL: ${modelName}`);
        addLog("CONNECTING TO GEMINI NEURAL NET...");

        try {
            const genAI = new GoogleGenerativeAI(apiKey.trim());
            const model = genAI.getGenerativeModel({ model: modelName });

            const prompt = `
            You are a trivia question generator for a developer quiz game.
            Generate ${questionCount} multiple-choice questions about: "${topic}".
            
            Strictly follow this JSON format. Each question must include translations for Portuguese (pt), English (en), and Spanish (es):
            [
              {
                "id": number,
                "difficulty": "easy" | "medium" | "hard" | "million",
                "correctOptionIndex": number (0-3),
                "pt": {
                    "text": "Question in Portuguese?",
                    "options": ["Opção A", "Opção B", "Opção C", "Opção D"],
                    "correctDetails": "Explicação em Português"
                },
                "en": {
                    "text": "Question in English?",
                    "options": ["Option A", "Option B", "Option C", "Option D"],
                    "correctDetails": "Explanation in English"
                },
                "es": {
                    "text": "Question in Spanish?",
                    "options": ["Opción A", "Opción B", "Opción C", "Opción D"],
                    "correctDetails": "Explicación en Español"
                }
              }
            ]

            Return ONLY the raw JSON array. No markdown code blocks.
            Do not include any text before or after the JSON array.
            `;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            // Clean up if markdown is present
            let jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();

            // Find the array boundaries to ignore any preamble/postscript
            const firstOpen = jsonStr.indexOf('[');
            const lastClose = jsonStr.lastIndexOf(']');

            if (firstOpen !== -1 && lastClose !== -1) {
                jsonStr = jsonStr.substring(firstOpen, lastClose + 1);
            }

            const questions = JSON.parse(jsonStr);
            setGeneratedQuestions(questions);
            // Select all by default
            setSelectedIndices(questions.map((_: any, index: number) => index));

            addLog(`SUCCESS: ${questions.length} QUESTIONS GENERATED.`);
            addLog("OUTPUT READY FOR DEPLOYMENT.");

        } catch (error: any) {
            console.error(error);
            addLog(`CRITICAL ERROR: ${error.message}`);
            addLog("HINT: CHECK API KEY OR TRY A DIFFERENT MODEL.");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSaveToDB = async () => {
        if (generatedQuestions.length === 0) return;

        const questionsToSave = generatedQuestions.filter((_, index) => selectedIndices.includes(index));

        if (questionsToSave.length === 0) {
            addLog("ERROR: NO QUESTIONS SELECTED TO SAVE.");
            return;
        }

        setIsSaving(true);
        addLog(`INITIATING DATABASE UPLOAD FOR ${questionsToSave.length} QUESTIONS...`);

        try {
            // Transform to snake_case for DB with trilingual support
            const dbPayload = questionsToSave.map(q => ({
                // PT
                text_pt: q.pt.text,
                options_pt: q.pt.options,
                correct_details_pt: q.pt.correctDetails,
                // EN
                text_en: q.en.text,
                options_en: q.en.options,
                correct_details_en: q.en.correctDetails,
                // ES
                text_es: q.es.text,
                options_es: q.es.options,
                correct_details_es: q.es.correctDetails,
                // Shared
                correct_option_index: q.correctOptionIndex,
                difficulty: q.difficulty
            }));

            // Use the client-side supabase instance (make sure to import it!)
            // We need to dynamically import or use the one from lib
            const { error } = await supabase
                .from('questions')
                .insert(dbPayload);

            if (error) throw error;

            if (error) throw error;

            addLog(`SUCCESS: ${questionsToSave.length} QUESTIONS SAVED TO DATABASE.`);
            // Optional: Clear generated or give success feedback
        } catch (error: any) {
            console.error("Save failed", error);
            addLog(`UPLOAD FAILED: ${error.message}`);
        } finally {
            setIsSaving(false);
        }
    };

    const handleSeedDatabase = async () => {
        if (QUESTIONS.length === 0) return;

        setIsSaving(true);
        addLog("INITIATING DATABASE SEEDING FROM LOCAL DATA...");

        try {
            // Transform to snake_case for DB
            const dbPayload = QUESTIONS.map(q => ({
                text: q.text,
                options: q.options,
                correct_option_index: parseInt(q.correctAnswer),
                correct_details: q.correctDetails,
                difficulty: q.difficulty
            }));

            const { error } = await supabase
                .from('questions')
                .insert(dbPayload);

            if (error) throw error;

            addLog(`SUCCESS: ${QUESTIONS.length} QUESTIONS SEEDED TO DATABASE.`);
        } catch (error: any) {
            console.error("Seed failed", error);
            addLog(`SEED FAILED: ${error.message}`);
        } finally {
            setIsSaving(false);
        }
    };

    const copyToClipboard = () => {
        const json = JSON.stringify(generatedQuestions, null, 2);
        navigator.clipboard.writeText(json);
        addLog("DATA COPIED TO CLIPBOARD.");
    };

    return (
        <div className="min-h-screen bg-black text-green-500 font-mono p-4 md:p-8 flex flex-col">
            {/* Header */}
            <div className="border-b border-green-900 pb-4 mb-6 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <Terminal className="w-6 h-6 animate-pulse" />
                    <h1 className="text-xl tracking-widest">AI_QUESTION_GENERATOR</h1>
                </div>
                <div className="flex items-center gap-4">
                    <select
                        value={modelName}
                        onChange={(e) => setModelName(e.target.value)}
                        className="bg-green-950/30 border border-green-800 text-green-400 text-xs p-1 rounded focus:outline-none"
                    >
                        {availableModels.length > 0 ? (
                            availableModels.map(m => (
                                <option key={m} value={m}>{m}</option>
                            ))
                        ) : (
                            <>
                                <option value="gemini-1.5-flash">gemini-1.5-flash (Default)</option>
                                <option value="gemini-pro">gemini-pro</option>
                            </>
                        )}
                    </select>
                    <div className="text-xs text-green-800">V1.2.0-AUTO</div>
                </div>
            </div>

            {/* API Key Input (if missing) */}
            {!import.meta.env.VITE_GEMINI_API_KEY && (
                <div className="bg-red-950/20 border border-red-900 p-4 mb-6 rounded flex items-center gap-4">
                    <Key className="text-red-500" />
                    <input
                        type="password"
                        placeholder="ENTER GEMINI API KEY..."
                        className="bg-transparent border-b border-red-800 text-red-400 focus:outline-none flex-1 font-mono"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                    />
                    <Button
                        onClick={handleSystemCheck}
                        variant="ghost"
                        className="text-red-400 hover:text-red-300 hover:bg-red-900/20 text-xs border border-red-900/50"
                    >
                        SYSTEM CHECK
                    </Button>
                </div>
            )}

            {/* If API key exists in ENV, still show System Check button somewhere */}
            {import.meta.env.VITE_GEMINI_API_KEY && (
                <div className="flex justify-end mb-2">
                    <button
                        onClick={handleSystemCheck}
                        className="text-[10px] text-green-800 hover:text-green-500 uppercase"
                    >
                        [ RUN SYSTEM DIAGNOSTICS ]
                    </button>
                </div>
            )}

            {/* Main Terminal Area */}
            <div className="flex-1 flex flex-col md:flex-row gap-6 overflow-hidden">

                {/* Left: Controls & Logs */}
                <div className="flex-1 flex flex-col gap-4 min-h-[300px]">
                    {/* Configuration Controls */}
                    <div className="flex gap-2">
                        <div className="w-32 bg-green-950/20 border border-green-800 rounded px-2 py-1 flex flex-col justify-center">
                            <label className="text-[10px] text-green-700 uppercase font-bold">Count</label>
                            <input
                                type="number"
                                min="1"
                                max="50"
                                value={questionCount}
                                onChange={(e) => setQuestionCount(Number(e.target.value))}
                                className={`bg-transparent text-xs focus:outline-none w-full ${questionCount > 20 ? 'text-yellow-500' : 'text-green-400'}`}
                            />
                        </div>
                        {questionCount > 20 && (
                            <div className="flex-1 flex items-center text-[10px] text-yellow-600 animate-pulse">
                                ! HIGH COUNT MAY CAUSE TIMEOUT
                            </div>
                        )}
                        <div className="flex-1 flex justify-end items-center text-[10px] text-green-800">
                            AUTO-TRANSLATE: PT / EN / ES
                        </div>
                    </div>

                    {/* Log Window */}
                    <div
                        ref={scrollRef}
                        className="flex-1 bg-black border border-green-900 rounded p-4 overflow-y-auto font-mono text-sm custom-scrollbar shadow-[0_0_20px_rgba(0,255,0,0.1)]"
                    >
                        {logs.map((log, i) => (
                            <div key={i} className="mb-1 opacity-90">{log}</div>
                        ))}
                        {isGenerating && <div className="animate-pulse">_</div>}
                    </div>

                    {/* Input Area */}
                    <div className="flex gap-2">
                        <div className="flex-1 bg-green-950/20 border border-green-800 rounded flex items-center px-4">
                            <span className="mr-2 select-none">{'>'}</span>
                            <input
                                type="text"
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                                placeholder="ENTER TOPIC (e.g., 'React Hooks')..."
                                className="bg-transparent border-none focus:outline-none text-green-400 w-full py-3 font-mono"
                                disabled={isGenerating}
                            />
                        </div>
                        <Button
                            onClick={handleGenerate}
                            disabled={isGenerating || !topic}
                            className="bg-green-700 hover:bg-green-600 text-black font-bold font-mono rounded"
                        >
                            <Send size={18} />
                        </Button>
                    </div>
                </div>

                {/* Right: Output Preview */}
                <div className="flex-1 bg-slate-900 border border-slate-700 rounded p-4 overflow-hidden flex flex-col">
                    <div className="flex justify-between items-center mb-2 border-b border-slate-700 pb-2">
                        <span className="text-slate-400 text-xs uppercase">Output Preview</span>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleSeedDatabase}
                            disabled={isSaving}
                            className="text-yellow-300 hover:text-yellow-100 hover:bg-yellow-900/20 mr-2"
                        >
                            <Terminal size={14} className="mr-2" /> SEED DB
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleSaveToDB}
                            disabled={generatedQuestions.length === 0 || isSaving}
                            className="text-blue-300 hover:text-blue-100 hover:bg-blue-900/20 mr-2"
                        >
                            <Terminal size={14} className="mr-2" /> SAVE TO DB
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={copyToClipboard}
                            disabled={generatedQuestions.length === 0}
                            className="text-slate-300 hover:text-white hover:bg-slate-800"
                        >
                            <Copy size={14} className="mr-2" /> COPY JSON
                        </Button>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-3">
                        {generatedQuestions.length > 0 ? (
                            generatedQuestions.map((q, idx) => {
                                const isSelected = selectedIndices.includes(idx);
                                return (
                                    <div
                                        key={idx}
                                        onClick={() => {
                                            if (isSelected) {
                                                setSelectedIndices(prev => prev.filter(i => i !== idx));
                                            } else {
                                                setSelectedIndices(prev => [...prev, idx]);
                                            }
                                        }}
                                        className={`p-3 rounded border cursor-pointer transition-all ${isSelected
                                            ? 'bg-green-900/20 border-green-600/50'
                                            : 'bg-slate-800/50 border-slate-700 opacity-60 hover:opacity-100'
                                            }`}
                                    >
                                        <div className="flex justify-between items-start mb-1">
                                            <span className={`text-xs font-bold ${isSelected ? 'text-green-400' : 'text-slate-500'}`}>
                                                #{idx + 1} [{q.difficulty.toUpperCase()}]
                                            </span>
                                            {isSelected && <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_5px_theme(colors.green.500)]"></div>}
                                        </div>
                                        <p className="text-sm text-slate-300 mb-2">{q.pt?.text || q.text}</p>
                                        <div className="grid grid-cols-2 gap-2">
                                            {(q.pt?.options || q.options || []).map((opt: string, i: number) => (
                                                <div
                                                    key={i}
                                                    className={`text-[10px] px-2 py-1 rounded ${i === q.correctOptionIndex
                                                        ? 'bg-green-950/40 text-green-300 border border-green-900'
                                                        : 'bg-slate-950/30 text-slate-500'
                                                        }`}
                                                >
                                                    {opt}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="h-full flex items-center justify-center text-slate-600 text-sm flex-col gap-2">
                                <Terminal size={32} className="opacity-20" />
                                <span>[NO DATA GENERATED]</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
