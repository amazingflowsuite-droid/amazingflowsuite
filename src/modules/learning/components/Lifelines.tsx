import { type LifelineType, type LifelineState } from '../types';
import { FileCode2, Vote, ShieldCheck, Forward } from 'lucide-react';
// FileCode2 -> "Refactoring" (Corta)
// Vote -> "Planning Poker" (Irmãos)
// ShieldCheck -> "Tech Lead" (Pastor)
// Forward -> "Backlog" (Livramento)

interface LifelinesProps {
    lifelines: { [key in LifelineType]: LifelineState };
    onUse: (type: LifelineType) => void;
    disabled: boolean;
}

export function Lifelines({ lifelines, onUse, disabled }: LifelinesProps) {
    const renderButton = (type: LifelineType, icon: React.ReactNode, label: string) => {
        const state = lifelines[type];
        const isAvailable = state.available && !state.used;

        return (
            <button
                onClick={() => onUse(type)}
                disabled={!isAvailable || disabled}
                className={`
          flex flex-col items-center justify-center p-2 rounded-xl border-2 transition-all group
          ${isAvailable
                        ? 'bg-slate-800 border-slate-600 hover:bg-slate-700 hover:border-pink-500 text-slate-300 hover:text-white hover:scale-105 shadow-md hover:shadow-pink-500/20'
                        : 'bg-slate-900 border-slate-800 text-slate-700 opacity-50 cursor-not-allowed'}
        `}
            >
                <div className={`mb-1 transition-colors ${isAvailable ? 'text-pink-400 group-hover:text-pink-300' : ''}`}>{icon}</div>
                <div className="flex flex-col items-center">
                    <span className="text-[10px] md:text-xs font-bold uppercase text-center leading-tight max-w-[80px]">{label}</span>
                    {state.type === 'skip' && state.usesLeft! > 0 && (
                        <span className="text-[10px] bg-slate-950 px-2 rounded-full mt-1 border border-slate-700 text-gray-400">
                            {state.usesLeft}x
                        </span>
                    )}
                </div>
            </button>
        );
    };

    return (
        <div className="grid grid-cols-4 gap-3 w-full max-w-lg mx-auto mb-6">
            {renderButton('cards', <FileCode2 size={24} />, 'Refactor')}
            {renderButton('placa', <Vote size={24} />, 'Planning Poker')}
            {renderButton('guests', <ShieldCheck size={24} />, 'Tech Lead')}
            {renderButton('skip', <Forward size={24} />, 'Backlog It')}
        </div>
    );
}
