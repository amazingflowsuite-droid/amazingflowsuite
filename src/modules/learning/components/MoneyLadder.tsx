import { useRef, useEffect } from 'react';

interface MoneyLadderProps {
    currentLevel: number;
    ladder: { level: number; prize: number; title: string }[];
}

export function MoneyLadder({ currentLevel, ladder }: MoneyLadderProps) {
    const listRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to active item
    useEffect(() => {
        if (listRef.current) {
            const activeItem = listRef.current.querySelector('[data-active="true"]');
            if (activeItem) {
                activeItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    }, [currentLevel]);

    // Reverse to show highest at top
    const displayLadder = [...ladder].reverse();

    return (
        <div className="h-full flex flex-col">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 px-2">Sprint Roadmap</h3>
            <div ref={listRef} className="space-y-0.5 flex-1 overflow-y-auto custom-scrollbar">
                {displayLadder.map((step) => {
                    const isActive = step.level === currentLevel;
                    const isPast = step.level < currentLevel;

                    return (
                        <div
                            key={step.level}
                            data-active={isActive}
                            className={`
                                flex justify-between items-center px-3 py-2 rounded-md transition-all border
                                ${isActive
                                    ? 'bg-pink-900/30 border-pink-500/50 text-pink-100 shadow-[0_0_15px_rgba(236,72,153,0.1)]'
                                    : 'border-transparent hover:bg-slate-800/50'}
                                ${isPast ? 'text-green-500/50' : 'text-slate-400'}
                                ${!isActive && !isPast ? 'text-slate-500' : ''}
                            `}
                        >
                            <div className="flex items-center gap-3 overflow-hidden">
                                <span className={`
                                    text-[10px] w-5 h-5 flex items-center justify-center rounded border font-mono
                                    ${isActive
                                        ? 'bg-pink-500 border-pink-400 text-white font-bold'
                                        : isPast
                                            ? 'bg-green-900/30 border-green-800 text-green-500'
                                            : 'bg-slate-800 border-slate-700 text-slate-600'}
                                `}>
                                    {step.level}
                                </span>
                                <span className={`text-xs font-medium truncate ${isActive ? 'text-pink-200' : ''}`} title={step.title}>
                                    {step.title}
                                </span>
                            </div>
                            <span className={`font-mono text-xs ${isActive ? 'text-pink-300 font-bold' : ''}`}>
                                {(step.prize).toLocaleString()} XP
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
