import { motion } from 'framer-motion';
import { type Question } from '../types';
import { Code2 } from 'lucide-react';

interface QuestionCardProps {
    question: Question;
    questionNumber: number;
}

export function QuestionCard({ question, questionNumber }: QuestionCardProps) {
    return (
        <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            key={question.id} // Animate on new question
            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-6 md:p-8 shadow-2xl relative overflow-hidden group"
        >
            {/* Syntax Highlighting Bar */}
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-pink-500 to-purple-600"></div>

            {/* Watermark */}
            <div className="absolute top-4 right-4 opacity-5">
                <Code2 size={120} />
            </div>

            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4 text-slate-500 font-mono text-xs uppercase tracking-widest">
                    <span className="bg-slate-800 px-2 py-1 rounded text-pink-400 border border-slate-700">Ticket #{questionNumber}</span>
                    <span>{question.difficulty === 'million' ? 'EPIC STORY' : `${question.difficulty.toUpperCase()} BUG`}</span>
                </div>

                <h2 className="text-xl md:text-2xl font-medium text-slate-100 leading-relaxed font-mono">
                    <span className="text-pink-500 mr-2">const</span>
                    problem
                    <span className="text-pink-500 mx-2">=</span>
                    <span className="text-yellow-200">"{question.text}"</span>;
                </h2>
            </div>
        </motion.div>
    );
}
