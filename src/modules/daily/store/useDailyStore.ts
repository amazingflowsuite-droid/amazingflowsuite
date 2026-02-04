import { create } from 'zustand';

export interface Member {
    id: string;
    name: string;
    role: string;
    avatar?: string; // URL or Initials
}

interface DailyState {
    // Data
    members: Member[];
    queue: string[]; // List of Member IDs
    activeMemberId: string | null;

    // Timer State
    status: 'idle' | 'running' | 'paused' | 'finished';
    secondsRemaining: number;
    totalDuration: number;
    speakerLimit: number; // Default 120s (2 mins)

    // Global Timer State
    globalTimeLimit: number; // Default 900s (15 mins)
    globalSecondsRemaining: number;
    timeboxMode: 'manual' | 'auto';

    // View State
    currentView: 'dashboard' | 'team' | 'settings' | 'history';
    setCurrentView: (view: 'dashboard' | 'team' | 'settings' | 'history') => void;

    // History State
    history: { id: string; date: string; duration: number; teamSize: number }[];

    // Actions
    addMember: (member: Omit<Member, 'id'>) => void;
    removeMember: (id: string) => void;
    setQueue: (memberIds: string[]) => void;
    setSpeakerLimit: (seconds: number) => void;
    setGlobalTimeLimit: (seconds: number) => void;
    setTimeboxMode: (mode: 'manual' | 'auto') => void;

    startDaily: () => void;
    pauseDaily: () => void;
    resumeDaily: () => void;
    nextSpeaker: () => void;
    resetDaily: () => void;

    tick: () => void; // Called by interval
}

// Initial Mock Data
const INITIAL_MEMBERS: Member[] = [
    { id: '1', name: 'John Doe', role: 'Frontend Dev', avatar: 'https://github.com/shadcn.png' },
    { id: '2', name: 'Sarah Smith', role: 'Backend Dev' },
    { id: '3', name: 'Mike Johnson', role: 'QA Engineer' },
    { id: '4', name: 'Emily Davis', role: 'Product Owner' },
    { id: '5', name: 'Chris Wilson', role: 'Scrum Master' },
];

export const useDailyStore = create<DailyState>((set, get) => ({
    members: INITIAL_MEMBERS,
    queue: [],
    activeMemberId: null,
    status: 'idle',
    secondsRemaining: 120,
    totalDuration: 0,
    speakerLimit: 120,

    globalTimeLimit: 900,
    globalSecondsRemaining: 900,
    timeboxMode: 'manual',

    history: [], // Start empty

    currentView: 'dashboard',
    setCurrentView: (view) => set({ currentView: view as any }), // Cast to satisfy strict union if needed

    addMember: (member) => set((state) => {
        const newMember = { ...member, id: Math.random().toString(36).substr(2, 9) };
        return { members: [...state.members, newMember] };
    }),

    removeMember: (id) => set((state) => ({
        members: state.members.filter((m) => m.id !== id),
        queue: state.queue.filter((qid) => qid !== id)
    })),

    setQueue: (ids) => set({ queue: ids }),

    setSpeakerLimit: (seconds) => set({ speakerLimit: seconds, secondsRemaining: seconds }),

    setGlobalTimeLimit: (seconds) => set({ globalTimeLimit: seconds, globalSecondsRemaining: seconds }),

    setTimeboxMode: (mode) => set({ timeboxMode: mode }),

    startDaily: () => {
        const { members, queue, status, globalTimeLimit, timeboxMode, speakerLimit } = get();

        if (status === 'running') return;

        if (status === 'paused') {
            set({ status: 'running' });
            return;
        }

        const initialQueue = queue.length > 0 ? queue : members.map(m => m.id);
        const firstSpeaker = initialQueue[0];

        // Auto Calc Logic
        let calculatedSpeakerLimit = speakerLimit;
        if (timeboxMode === 'auto' && members.length > 0) {
            calculatedSpeakerLimit = Math.floor(globalTimeLimit / members.length);
        }

        set({
            status: 'running',
            queue: initialQueue,
            activeMemberId: firstSpeaker,
            speakerLimit: calculatedSpeakerLimit, // Update limit if auto
            secondsRemaining: calculatedSpeakerLimit,
            globalSecondsRemaining: globalTimeLimit,
            totalDuration: 0,
        });
    },

    pauseDaily: () => set({ status: 'paused' }),

    resumeDaily: () => set({ status: 'running' }),

    nextSpeaker: () => {
        const { queue, activeMemberId, members, speakerLimit, totalDuration } = get();
        const currentIndex = queue.indexOf(activeMemberId || '');
        const nextIndex = currentIndex + 1;

        if (nextIndex < queue.length) {
            set({
                activeMemberId: queue[nextIndex],
                secondsRemaining: speakerLimit,
            });
        } else {
            // Finished - Save History
            set((state) => ({
                activeMemberId: null,
                status: 'finished',
                secondsRemaining: 0,
                history: [
                    {
                        id: Math.random().toString(36).substr(2, 9),
                        date: new Date().toISOString(),
                        duration: totalDuration,
                        teamSize: members.length
                    },
                    ...state.history
                ]
            }));
        }
    },

    resetDaily: () => {
        const { globalTimeLimit } = get();
        set({
            status: 'idle',
            activeMemberId: null,
            queue: [],
            secondsRemaining: 120, // Will be overwritten on start
            globalSecondsRemaining: globalTimeLimit,
            totalDuration: 0,
        });
    },

    tick: () => {
        const { status, secondsRemaining, totalDuration, globalSecondsRemaining } = get();
        if (status !== 'running') return;

        const updates: Partial<DailyState> = {
            totalDuration: totalDuration + 1
        };

        if (secondsRemaining > 0) {
            updates.secondsRemaining = secondsRemaining - 1;
        }

        if (globalSecondsRemaining > 0) {
            updates.globalSecondsRemaining = globalSecondsRemaining - 1;
        }

        set(updates);
    }
}));
