export type Difficulty = 'easy' | 'medium' | 'hard' | 'million';

export interface Question {
    id: string; // Changed to string for UUID from DB
    text: Record<string, string> | string; // Supports multi-language or legacy string
    options: { id: string; text: Record<string, string> | string }[]; // Structured options
    correctAnswer: string; // ID of correct option
    difficulty: Difficulty;
    language?: string; // Optional language override
    correctDetails?: Record<string, string> | string; // Explanation
}

export interface TrilingualQuestion {
    id: string | number; // Support both for now to avoid breaking everything
    difficulty: Difficulty;
    pt: { text: string; options: string[]; correctDetails: string };
    en: { text: string; options: string[]; correctDetails: string };
    es: { text: string; options: string[]; correctDetails: string };
    correctOptionIndex: number;
}

export type LifelineType = 'cards' | 'placa' | 'guests' | 'skip';

export interface LifelineState {
    type: LifelineType;
    available: boolean;
    used: boolean;
    usesLeft?: number; // For "Livramento" (Skip)
}

export interface LifelineResult {
    type: LifelineType;
    suggestion?: number; // Index for Pastor
    stats?: number[]; // Percentages for Irmãos
}

export type GameStatus = 'playing' | 'won' | 'lost' | 'stopped';

export interface GameState {
    currentQuestionIndex: number; // 0 to 15 usually
    currentLevel: number; // 1 to ...
    accumulatedMoney: number;
    currentPrize: number;
    stopPrize: number;
    wrongPrize: number; // Prize if answer is wrong (usually 50% or safe haven)
    status: GameStatus;
    lifelines: {
        cards: LifelineState;
        placa: LifelineState;
        guests: LifelineState;
        skip: LifelineState;
    };
    eliminatedOptions: number[]; // Indices of options eliminated by "Cards" or similar logic?
    lifelineResult: LifelineResult | null; // Result to show in Modal
    timeLeft: number;
}
