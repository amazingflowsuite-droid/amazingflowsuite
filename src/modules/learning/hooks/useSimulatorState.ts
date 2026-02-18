import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { type Question } from '../types';

export type SimulatorStatus = 'intro' | 'ongoing' | 'finished';

interface SimulatorState {
    status: SimulatorStatus;
    questions: Question[];
    answers: Record<string, string[]>; // questionId -> selectedOptionIds (array for multi-select)
    flaggedQuestions: string[];
    currentQuestionIndex: number;
    timeLeft: number; // in seconds
    score: number;
    passed: boolean;
}

const EXAM_DURATION = 60 * 60; // 60 minutes
const PASSING_SCORE = 85; // Percentage
const TOTAL_QUESTIONS = 80;

export const useSimulatorState = () => {
    const [state, setState] = useState<SimulatorState>({
        status: 'intro',
        questions: [],
        answers: {},
        flaggedQuestions: [],
        currentQuestionIndex: 0,
        timeLeft: EXAM_DURATION,
        score: 0,
        passed: false,
    });

    const [loading, setLoading] = useState(false);

    const startExam = useCallback(async () => {
        setLoading(true);
        try {
            // Fetch questions from Supabase
            // TODO: Optimize to fetch specific set or random sample
            const { data, error } = await supabase
                .from('questions')
                .select('*');

            if (error) throw error;

            // Map and Shuffle
            const mappedQuestions: Question[] = (data as any[]).map(q => {
                // Determine flexible structure logic similar to useGameState but flattened for now
                // Since Simulator might want to support language switching, ideally we keep Trilingual structure
                // But our state uses Question[]. Let's default to PT for now or mapping object

                const options = q.options_pt || q.options || []; // Fallback

                return {
                    id: q.id.toString(),
                    text: {
                        pt: q.text_pt || q.text,
                        en: q.text_en || q.text,
                        es: q.text_es || q.text
                    },
                    options: Array.isArray(options) ? options.map((opt: string, idx: number) => ({
                        id: idx.toString(),
                        text: {
                            pt: (q.options_pt && q.options_pt[idx]) || opt,
                            en: (q.options_en && q.options_en[idx]) || opt,
                            es: (q.options_es && q.options_es[idx]) || opt
                        }
                    })) : [],
                    correctAnswer: q.correct_option_index?.toString() || '0', // Mapping index to string ID
                    difficulty: q.difficulty,
                    language: 'pt', // Default for now
                    correctDetails: {
                        pt: q.correct_details_pt || q.correct_details,
                        en: q.correct_details_en || q.correct_details,
                        es: q.correct_details_es || q.correct_details
                    }
                };
            });

            const shuffled = mappedQuestions.sort(() => 0.5 - Math.random());
            const selected = shuffled.slice(0, TOTAL_QUESTIONS);

            setState(prev => ({
                ...prev,
                status: 'ongoing',
                questions: selected,
                timeLeft: EXAM_DURATION,
                answers: {},
                flaggedQuestions: [],
                currentQuestionIndex: 0
            }));
        } catch (error) {
            console.error('Error starting exam:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    const finishExam = useCallback(() => {
        // Calculate Score
        let correctCount = 0;
        state.questions.forEach(q => {
            const userAnswers = state.answers[q.id] || [];
            // Simple check: user answers must match correct answer exactly
            // Note: This logic needs to be robust for multi-select vs single select
            // For now assuming single select 'correctAnswer' logic from game, 
            // but we need to handle multiple correct based on data structure.
            // If data only has 'correctAnswer' (string), it's single choice.
            // If we support multiple, we need to parse.

            // Current data structure uses `correctAnswer` (single string index usually).
            // Let's assume strict match for now.
            if (userAnswers.length === 1 && userAnswers[0] === q.correctAnswer) {
                correctCount++;
            }
        });

        const percentage = (correctCount / state.questions.length) * 100;

        setState(prev => ({
            ...prev,
            status: 'finished',
            score: percentage,
            passed: percentage >= PASSING_SCORE
        }));
    }, [state.questions, state.answers]);

    // Timer Logic
    useEffect(() => {
        let timer: any;
        if (state.status === 'ongoing' && state.timeLeft > 0) {
            timer = setInterval(() => {
                setState(prev => {
                    if (prev.timeLeft <= 1) {
                        finishExam();
                        return { ...prev, timeLeft: 0 };
                    }
                    return { ...prev, timeLeft: prev.timeLeft - 1 };
                });
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [state.status, state.timeLeft, finishExam]);

    // Actions
    const selectAnswer = (questionId: string, optionId: string, isMultiSelect: boolean) => {
        setState(prev => {
            const currentAnswers = prev.answers[questionId] || [];
            let newAnswers;

            if (isMultiSelect) {
                if (currentAnswers.includes(optionId)) {
                    newAnswers = currentAnswers.filter(id => id !== optionId);
                } else {
                    newAnswers = [...currentAnswers, optionId];
                }
            } else {
                newAnswers = [optionId];
            }

            return {
                ...prev,
                answers: { ...prev.answers, [questionId]: newAnswers }
            };
        });
    };

    const toggleFlag = (questionId: string) => {
        setState(prev => {
            const isFlagged = prev.flaggedQuestions.includes(questionId);
            return {
                ...prev,
                flaggedQuestions: isFlagged
                    ? prev.flaggedQuestions.filter(id => id !== questionId)
                    : [...prev.flaggedQuestions, questionId]
            };
        });
    };

    const goToQuestion = (index: number) => {
        if (index >= 0 && index < state.questions.length) {
            setState(prev => ({ ...prev, currentQuestionIndex: index }));
        }
    };

    return {
        state,
        loading,
        startExam,
        finishExam,
        selectAnswer,
        toggleFlag,
        goToQuestion
    };
};
