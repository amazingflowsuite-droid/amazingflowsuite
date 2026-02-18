import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameState } from '../hooks/useGameState';
import { QuestionCard } from '../components/QuestionCard';
import { AnswerButton } from '../components/AnswerButton';
import { Lifelines } from '../components/Lifelines';
import { LifelineModal } from '../components/LifelineModal';
import { MoneyLadder } from '../components/MoneyLadder';
import { Link } from 'react-router-dom';
import { ArrowLeft, Terminal, Trophy, AlertTriangle, ShieldCheck, RotateCcw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PRIZE_LADDER } from '../data/questions';

export default function LearningPage() {
    const {
        gameState,
        currentQuestion,
        handleAnswer,
        handleStop,
        useLifeline,
        closeLifelineModal,
        restartGame,
        language,
        setLanguage
    } = useGameState();

    const [showStopConfirm, setShowStopConfirm] = useState(false);

    // helper to format XP
    const formatXP = (value: number) => {
        return `${value.toLocaleString()} XP`;
    };

    const currentQuestionLevel = PRIZE_LADDER.find(p => p.level === gameState.currentLevel);

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900 flex flex-col">
            {/* Amazing Flow Header */}
            <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 shrink-0 z-20">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild className="text-gray-400 hover:text-gray-600 transition">
                        <Link to="/">
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                    </Button>
                    <div className="flex items-center gap-3">
                        <div className="bg-pink-50 text-pink-500 rounded-lg w-10 h-10 flex items-center justify-center text-xl">
                            <Terminal className="w-5 h-5" />
                        </div>
                        <div>
                            <h1 className="font-bold text-lg leading-tight text-pink-600">Amazing Learning</h1>
                            <p className="text-sm text-gray-500 font-medium">Agile Mastery</p>
                        </div>

                        {/* Language Selector (Flags) */}
                        <div className="flex items-center gap-2 bg-slate-100 rounded-full p-1 border border-slate-200">
                            <button
                                onClick={() => setLanguage('pt')}
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-lg transition-all ${language === 'pt' ? 'bg-white shadow-md scale-110' : 'opacity-50 hover:opacity-100 hover:bg-slate-200'}`}
                                title="Português"
                            >
                                🇧🇷
                            </button>
                            <button
                                onClick={() => setLanguage('en')}
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-lg transition-all ${language === 'en' ? 'bg-white shadow-md scale-110' : 'opacity-50 hover:opacity-100 hover:bg-slate-200'}`}
                                title="English"
                            >
                                🇺🇸
                            </button>
                            <button
                                onClick={() => setLanguage('es')}
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-lg transition-all ${language === 'es' ? 'bg-white shadow-md scale-110' : 'opacity-50 hover:opacity-100 hover:bg-slate-200'}`}
                                title="Español"
                            >
                                🇪🇸
                            </button>
                        </div>

                        {/* Stop Sprint Button - Moved directly to Header */}
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowStopConfirm(true)}
                            className="ml-4 text-red-500 hover:text-red-700 hover:bg-red-50 font-medium"
                        >
                            Stop Sprint
                        </Button>
                    </div>
                </div>
            </header>

            <main className="flex-1 p-4 md:p-8 flex items-center justify-center">
                {/* Terminal / IDE Container */}
                <div className="w-full max-w-6xl bg-slate-950 rounded-xl shadow-2xl overflow-hidden border border-slate-800 flex flex-col md:flex-row min-h-[600px]">

                    {/* Sidebar / Minimap (Prize Ladder) */}
                    <aside className="hidden md:flex w-full md:w-80 bg-slate-900 border-r border-slate-800 flex-col">
                        <div className="p-4 border-b border-slate-800 flex items-center gap-2">
                            <div className="flex gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                                <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                            </div>
                            <span className="ml-4 text-xs font-mono text-slate-500">explorer.tsx</span>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                            <MoneyLadder
                                currentLevel={gameState.currentLevel}
                                ladder={PRIZE_LADDER}
                            />
                        </div>

                        {/* Current Stats Panel */}
                        <div className="p-4 bg-slate-900 border-t border-slate-800">
                            <div className="space-y-3">
                                <div>
                                    <span className="text-xs text-slate-500 font-mono uppercase">Current Role</span>
                                    <div className="text-sm font-bold text-pink-400 font-mono">
                                        {currentQuestionLevel?.title || 'Intern'}
                                    </div>
                                </div>
                                <div>
                                    <span className="text-xs text-slate-500 font-mono uppercase">Accumulated XP</span>
                                    <div className="text-xl font-bold text-green-400 font-mono">
                                        {formatXP(gameState.accumulatedMoney)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Main Code Area */}
                    <div className="flex-1 flex flex-col relative bg-slate-950/50">
                        {/* Tab Bar mimic */}
                        <div className="sticky top-0 z-20 h-10 bg-slate-950 border-b border-slate-800 flex items-center px-4 gap-2 shadow-md">
                            <div className="px-3 py-1 bg-slate-900 border-t-2 border-pink-500 text-slate-300 text-xs font-mono rounded-t-md flex items-center gap-2">
                                <Terminal size={12} className="text-pink-400" />
                                index.tsx
                            </div>

                            {/* Timer in Tab Bar */}
                            <div className="ml-auto flex items-center gap-2 mr-2">
                                <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Time Remaining:</span>
                                <div className={`text-lg font-mono font-bold ${gameState.timeLeft <= 10 ? 'text-red-500 animate-pulse' : 'text-slate-200'}`}>
                                    00:{gameState.timeLeft.toString().padStart(2, '0')}
                                </div>
                            </div>
                        </div>

                        {/* Content Area */}
                        <div className="flex-1 p-4 md:p-10 flex flex-col items-center justify-start md:justify-center relative overflow-y-auto custom-scrollbar">
                            {/* Background decoration */}
                            <div className="absolute inset-0 opacity-5 pointer-events-none">
                                <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
                            </div>

                            <AnimatePresence mode="wait">
                                {gameState.status === 'playing' && currentQuestion && (
                                    <motion.div
                                        key="game"
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="w-full max-w-3xl z-10 pt-4 md:pt-0 pb-20 md:pb-0"
                                    >
                                        <div className="mb-4 sticky top-2 z-30 md:static">
                                            <Lifelines
                                                lifelines={gameState.lifelines}
                                                onUse={useLifeline}
                                                disabled={false}
                                            />




                                        </div>

                                        <QuestionCard
                                            question={currentQuestion}
                                            questionNumber={gameState.currentLevel}
                                        />

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                                            {currentQuestion.options.map((option, index) => (
                                                !gameState.eliminatedOptions.includes(index) ? (
                                                    <AnswerButton
                                                        key={index}
                                                        option={option.text as string} // Explicit cast since we know it's a string in Arcade mode
                                                        index={index}
                                                        onClick={() => handleAnswer(index)}
                                                    />
                                                ) : <div key={index} className="hidden" />
                                            ))}
                                        </div>
                                    </motion.div>
                                )}

                                {gameState.status === 'won' && (
                                    <motion.div
                                        key="won"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="text-center z-10"
                                    >
                                        <div className="inline-block p-6 bg-pink-500/20 rounded-full mb-6 ring-8 ring-pink-500/10">
                                            <Trophy size={64} className="text-pink-500" />
                                        </div>
                                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-2">Sprint Completed!</h2>
                                        <p className="text-xl text-slate-400 mb-8">You are now a <strong>CTO</strong>!</p>

                                        <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-700 max-w-md mx-auto mb-8 backdrop-blur-sm">
                                            <p className="text-slate-400 text-sm uppercase font-mono mb-1">Total XP Earned</p>
                                            <p className="text-4xl font-bold text-green-400 font-mono">{formatXP(1000000)}</p>
                                        </div>

                                        <div className="flex gap-4 justify-center">
                                            <Button onClick={() => window.location.href = '/'} variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800">
                                                <Home className="mr-2 h-4 w-4" /> Dashboard
                                            </Button>
                                            <Button onClick={restartGame} className="bg-pink-600 hover:bg-pink-700 text-white">
                                                <RotateCcw className="mr-2 h-4 w-4" /> New Sprint
                                            </Button>
                                        </div>
                                    </motion.div>
                                )}

                                {gameState.status === 'lost' && (
                                    <motion.div
                                        key="lost"
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="text-center z-10"
                                    >
                                        <div className="inline-block p-6 bg-red-500/20 rounded-full mb-6 ring-8 ring-red-500/10">
                                            <AlertTriangle size={64} className="text-red-500" />
                                        </div>
                                        <h2 className="text-4xl font-bold text-white mb-2">Build Failed</h2>
                                        <p className="text-lg text-slate-400 mb-8 max-w-md mx-auto">
                                            That was incorrect. But every failure is a learning opportunity.
                                        </p>

                                        {/* Explanation / Rationale */}
                                        {currentQuestion?.correctDetails && (
                                            <div className="bg-slate-900/50 border border-red-900/30 p-4 rounded-lg mb-6 text-left relative overflow-hidden max-w-md mx-auto">
                                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500"></div>
                                                <h4 className="text-red-400 font-bold mb-1 flex items-center text-sm uppercase tracking-wider">
                                                    <Terminal size={14} className="mr-2" /> Root Cause Analysis
                                                </h4>
                                                <p className="text-slate-300 text-sm leading-relaxed">
                                                    {typeof currentQuestion.correctDetails === 'string'
                                                        ? currentQuestion.correctDetails
                                                        : (currentQuestion.correctDetails as Record<string, string>)[language || 'pt'] || ''}
                                                </p>
                                            </div>
                                        )}

                                        <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-700 max-w-md mx-auto mb-8 backdrop-blur-sm">
                                            <p className="text-slate-400 text-sm uppercase font-mono mb-1">XP Retained</p>
                                            <p className="text-3xl font-bold text-yellow-500 font-mono">{formatXP(gameState.wrongPrize)}</p>
                                        </div>

                                        <Button onClick={restartGame} size="lg" className="bg-pink-600 hover:bg-pink-700 text-white w-full max-w-xs">
                                            <RotateCcw className="mr-2 h-5 w-5" /> Debug & Retry
                                        </Button>
                                    </motion.div>
                                )}

                                {gameState.status === 'stopped' && (
                                    <motion.div
                                        key="stopped"
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="text-center z-10"
                                    >
                                        <div className="inline-block p-6 bg-blue-500/20 rounded-full mb-6 ring-8 ring-blue-500/10">
                                            <ShieldCheck size={64} className="text-blue-500" />
                                        </div>
                                        <h2 className="text-3xl font-bold text-white mb-2">Safe Deploy</h2>
                                        <p className="text-lg text-slate-400 mb-8">You chose to stop and ship what you have.</p>

                                        <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-700 max-w-md mx-auto mb-8 backdrop-blur-sm">
                                            <p className="text-slate-400 text-sm uppercase font-mono mb-1">XP Secured</p>
                                            <p className="text-3xl font-bold text-green-400 font-mono">{formatXP(gameState.stopPrize)}</p>
                                        </div>

                                        <div className="flex gap-4 justify-center">
                                            <Button onClick={() => window.location.href = '/'} variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800">
                                                <Home className="mr-2 h-4 w-4" /> Dashboard
                                            </Button>
                                            <Button onClick={restartGame} className="bg-blue-600 hover:bg-blue-700 text-white">
                                                <RotateCcw className="mr-2 h-4 w-4" /> New Sprint
                                            </Button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </main>

            {/* Stop Confirmation Modal */}
            {showStopConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 max-w-sm w-full shadow-2xl animate-in zoom-in-95">
                        <h3 className="text-xl font-bold text-white mb-2">Stop Sprint?</h3>
                        <p className="text-slate-400 mb-6">
                            If you stop now, you'll secure <strong className="text-green-400 font-mono">{formatXP(gameState.stopPrize)}</strong>.
                            <br />
                            Continuing risks dropping to <span className="text-yellow-500 font-mono">{formatXP(gameState.wrongPrize)}</span>.
                        </p>
                        <div className="flex gap-3 justify-end">
                            <Button variant="ghost" className="text-slate-300 hover:text-white" onClick={() => setShowStopConfirm(false)}>
                                Resume
                            </Button>
                            <Button
                                className="bg-red-600 hover:bg-red-700 text-white"
                                onClick={() => {
                                    handleStop();
                                    setShowStopConfirm(false);
                                }}
                            >
                                Stop & Ship
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            <LifelineModal
                result={gameState.lifelineResult}
                onClose={closeLifelineModal}
            />
        </div>
    );
}
