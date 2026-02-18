import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Terminal } from 'lucide-react';

interface AnswerButtonProps {
    option: string;
    index: number;
    state?: 'default' | 'selected' | 'correct' | 'wrong' | 'hidden';
    onClick: () => void;
    disabled?: boolean;
}

export function AnswerButton({ option, index, state = 'default', onClick, disabled }: AnswerButtonProps) {
    if (state === 'hidden') {
        return <div className="h-16 w-full invisible" />;
    }

    const baseStyles = "relative w-full p-4 rounded-lg border text-left font-mono text-sm md:text-base transition-all transform active:scale-98 flex items-center gap-3 group";

    const variants = {
        default: "bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800 hover:border-pink-500/50 hover:text-pink-100",
        selected: "bg-pink-900/20 border-pink-500 text-pink-100 shadow-[0_0_15px_rgba(236,72,153,0.3)]",
        correct: "bg-green-900/20 border-green-500 text-green-100 shadow-[0_0_15px_rgba(34,197,94,0.3)]",
        wrong: "bg-red-900/20 border-red-500 text-red-100 shadow-[0_0_15px_rgba(239,68,68,0.3)]",
    };

    const labels = ['A', 'B', 'C', 'D'];

    return (
        <motion.button
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={cn(baseStyles, variants[state])}
            onClick={onClick}
            disabled={disabled || state !== 'default'}
        >
            <span className={`
                w-8 h-8 flex items-center justify-center rounded border font-bold text-xs shrink-0 transition-colors
                ${state === 'default' ? 'bg-slate-800 border-slate-600 text-slate-400 group-hover:border-pink-500/50 group-hover:text-pink-400' : ''}
                ${state === 'selected' ? 'bg-pink-500 border-pink-400 text-white' : ''}
                ${state === 'correct' ? 'bg-green-500 border-green-400 text-white' : ''}
                ${state === 'wrong' ? 'bg-red-500 border-red-400 text-white' : ''}
            `}>
                {labels[index]}
            </span>
            <span className="flex-1 font-mono break-words">
                <span className="opacity-50 mr-2 select-none">&gt;</span>
                {option}
            </span>
            {state === 'selected' && <Terminal size={16} className="text-pink-500 animate-pulse" />}
        </motion.button>
    );
}
