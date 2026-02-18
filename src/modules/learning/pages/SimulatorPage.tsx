import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Flag, List, ChevronLeft, ChevronRight, CheckCircle, XCircle } from 'lucide-react';
import { useSimulatorState } from '../hooks/useSimulatorState';

export const SimulatorPage: React.FC = () => {
    const navigate = useNavigate();
    const {
        state,
        loading,
        startExam,
        finishExam,
        selectAnswer,
        toggleFlag,
        goToQuestion
    } = useSimulatorState();

    useEffect(() => {
        startExam();
    }, [startExam]);

    if (loading || state.status === 'intro') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (state.status === 'finished') {
        return (
            <div className="min-h-screen bg-slate-50 p-8 flex items-center justify-center">
                <Card className="max-w-md w-full text-center p-8 space-y-6">
                    <div className={`mx-auto w-24 h-24 rounded-full flex items-center justify-center ${state.passed ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                        {state.passed ? <CheckCircle size={48} /> : <XCircle size={48} />}
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold text-slate-800">{state.passed ? 'Passed!' : 'Failed'}</h2>
                        <p className="text-slate-500 mt-2">You scored {state.score.toFixed(1)}%</p>
                        <p className="text-sm text-slate-400">Required: 85%</p>
                    </div>
                    <Button onClick={() => navigate('/learning')} className="w-full">Return to Hub</Button>
                </Card>
            </div>
        );
    }

    const currentQuestion = state.questions[state.currentQuestionIndex];
    const isFlagged = state.flaggedQuestions.includes(currentQuestion.id);

    // Format time MM:SS
    const minutes = Math.floor(state.timeLeft / 60);
    const seconds = state.timeLeft % 60;
    const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-indigo-100">
            {/* Header */}
            <header className="border-b border-slate-200 bg-white sticky top-0 z-50">
                <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-indigo-600 rounded-md flex items-center justify-center text-white font-bold">AL</div>
                        </div>
                        <div className="h-6 w-px bg-slate-300 mx-2"></div>
                        <h1 className="text-xl font-bold text-slate-700 hidden md:block">Scrum Open Simulator</h1>
                    </div>

                    <div className="flex items-center gap-3 md:gap-6">
                        {/* Timer */}
                        <div className={`flex items-center gap-3 px-4 py-2 rounded-full border ${state.timeLeft < 300 ? 'bg-red-50 border-red-200 text-red-700' : 'bg-slate-50 border-slate-200 text-slate-700'}`}>
                            <div className={`w-4 h-4 rounded-full border-2 border-t-transparent animate-spin ${state.timeLeft < 300 ? 'border-red-500' : 'border-indigo-500'}`}></div>
                            <span className="text-sm font-medium">Time left: <span className="font-bold">{timeString}</span></span>
                        </div>

                        {/* Controls */}
                        <Button variant="ghost" size="sm" className="hidden md:flex text-indigo-600 gap-2 hover:bg-indigo-50">
                            <List size={18} />
                            See all questions
                        </Button>
                        <Button onClick={finishExam} variant="outline" size="sm" className="border-red-200 text-red-600 hover:bg-red-50">
                            Finish
                        </Button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-5xl mx-auto px-4 py-8 grid md:grid-cols-[1fr_250px] gap-8">

                {/* Question Area */}
                <div className="space-y-6">
                    <Card className="border-slate-200 shadow-sm min-h-[500px] flex flex-col">
                        <CardContent className="p-8 flex-1 flex flex-col">
                            {/* Question Header */}
                            <div className="flex justify-between items-start mb-6">
                                <h2 className="text-xl font-medium text-slate-700">
                                    Question {state.currentQuestionIndex + 1} of {state.questions.length}
                                </h2>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => toggleFlag(currentQuestion.id)}
                                    className={isFlagged ? "text-orange-500 bg-orange-50 hover:bg-orange-100 hover:text-orange-600" : "text-slate-400 hover:text-indigo-500"}
                                >
                                    <Flag size={20} fill={isFlagged ? "currentColor" : "none"} />
                                </Button>
                            </div>

                            {/* Question Text */}
                            <div className="mb-8">
                                <p className="text-lg text-slate-800 leading-relaxed mb-4">
                                    {typeof currentQuestion.text === 'string'
                                        ? currentQuestion.text
                                        : (currentQuestion.text as Record<string, string>)[currentQuestion.language || 'pt'] || 'Question text missing'}
                                </p>
                                {/* Hint would go here if we had multi-select logic */}
                                {/* <p className="text-sm text-indigo-600 font-medium">(choose the best answer)</p> */}
                            </div>

                            {/* Options */}
                            <div className="space-y-3">
                                {currentQuestion.options.map((option, index) => {
                                    const isSelected = (state.answers[currentQuestion.id] || []).includes(option.id);

                                    const optionText = typeof option.text === 'string'
                                        ? option.text
                                        : (option.text as Record<string, string>)[currentQuestion.language || 'pt'] || 'Option text missing';

                                    return (
                                        <label
                                            key={option.id}
                                            className={`flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-all group ${isSelected ? 'bg-indigo-50 border-indigo-200' : 'border-transparent hover:bg-slate-50 hover:border-slate-200'}`}
                                            onClick={() => selectAnswer(currentQuestion.id, option.id, false)} // False for single select
                                        >
                                            <div className={`w-6 h-6 rounded-full border flex items-center justify-center transition-colors ${isSelected ? 'bg-indigo-600 border-indigo-600' : 'bg-white border-slate-300 group-hover:border-indigo-400'}`}>
                                                {isSelected && <div className="w-2 h-2 bg-white rounded-full"></div>}
                                            </div>
                                            <span className="text-slate-700 font-medium text-lg min-w-[24px]">{String.fromCharCode(65 + index)}.</span>
                                            <span className="text-slate-600">{optionText}</span>
                                        </label>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Footer Navigation */}
                    <div className="flex justify-between items-center">
                        <Button
                            variant="outline"
                            onClick={() => goToQuestion(state.currentQuestionIndex - 1)}
                            disabled={state.currentQuestionIndex === 0}
                            className="border-indigo-600 text-indigo-600 hover:bg-indigo-50 px-8"
                        >
                            <ChevronLeft size={16} className="mr-2" />
                            Previous
                        </Button>

                        <Button
                            onClick={() => goToQuestion(state.currentQuestionIndex + 1)}
                            disabled={state.currentQuestionIndex === state.questions.length - 1}
                            className="bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-500 hover:to-teal-400 text-white px-8 border-0"
                        >
                            Next
                            <ChevronRight size={16} className="ml-2" />
                        </Button>
                    </div>
                </div>

                {/* Sidebar Navigation (Right) */}
                <div className="hidden md:block">
                    <div className="sticky top-24 space-y-4">
                        <h3 className="font-semibold text-slate-700">Question Navigator</h3>
                        <div className="grid grid-cols-5 gap-2">
                            {state.questions.map((q, idx) => {
                                const isAnswered = (state.answers[q.id] || []).length > 0;
                                const isCurrent = idx === state.currentQuestionIndex;
                                const isFlagged = state.flaggedQuestions.includes(q.id);

                                let bgClass = 'bg-slate-100 text-slate-500 hover:bg-slate-200';
                                if (isCurrent) bgClass = 'bg-indigo-600 text-white ring-2 ring-indigo-200';
                                else if (isFlagged) bgClass = 'bg-orange-100 text-orange-600 border border-orange-200';
                                else if (isAnswered) bgClass = 'bg-slate-700 text-slate-300';

                                return (
                                    <button
                                        key={q.id}
                                        onClick={() => goToQuestion(idx)}
                                        className={`h-10 w-10 text-xs font-bold rounded-md flex items-center justify-center transition-all ${bgClass}`}
                                    >
                                        {idx + 1}
                                        {isFlagged && <div className="absolute top-0 right-0 w-2 h-2 bg-orange-500 rounded-full border border-white"></div>}
                                    </button>
                                );
                            })}
                        </div>

                        <div className="space-y-2 mt-6 text-xs text-slate-500">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-indigo-600 rounded"></div> Current
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-slate-700 rounded"></div> Answered
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-orange-100 border border-orange-200 rounded text-orange-600 flex items-center justify-center">!</div> Flagged
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-slate-100 rounded"></div> Not Answered
                            </div>
                        </div>
                    </div>
                </div>

            </main>
        </div>
    );
};
