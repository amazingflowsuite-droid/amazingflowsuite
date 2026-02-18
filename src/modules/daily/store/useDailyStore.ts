import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { RealtimeChannel } from '@supabase/supabase-js';

export interface Member {
    id: string;
    name: string;
    role: string;
    avatar?: string;
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
    fetchData: () => Promise<void>;
    subscribeToChanges: () => void;
    unsubscribe: () => void;

    addMember: (member: Omit<Member, 'id'>) => Promise<void>;
    removeMember: (id: string) => Promise<void>;
    setQueue: (memberIds: string[]) => Promise<void>;
    setSpeakerLimit: (seconds: number) => Promise<void>;
    setGlobalTimeLimit: (seconds: number) => Promise<void>;
    setTimeboxMode: (mode: 'manual' | 'auto') => Promise<void>;

    startDaily: () => Promise<void>;
    pauseDaily: () => Promise<void>;
    resumeDaily: () => Promise<void>;
    nextSpeaker: () => Promise<void>;
    resetDaily: () => Promise<void>;

    tick: () => void; // Called by interval locally
}

export const useDailyStore = create<DailyState>((set, get) => {
    let realtimeChannel: RealtimeChannel | null = null;

    return {
        members: [],
        queue: [],
        activeMemberId: null,
        status: 'idle',
        secondsRemaining: 120,
        totalDuration: 0,
        speakerLimit: 120,

        globalTimeLimit: 900,
        globalSecondsRemaining: 900,
        timeboxMode: 'manual',

        history: [],

        currentView: 'dashboard',
        setCurrentView: (view) => set({ currentView: view as any }),

        fetchData: async () => {
            // Fetch Members
            const { data: members } = await supabase.from('daily_members').select('*').order('created_at');

            // Fetch State
            const { data: state } = await supabase.from('daily_state').select('*').eq('id', 1).single();

            // Fetch History (Last 5)
            const { data: history } = await supabase.from('daily_history').select('*').order('date', { ascending: false }).limit(5);

            if (state) {
                set({
                    members: members || [],
                    status: state.status as any,
                    activeMemberId: state.active_member_id,
                    queue: state.queue || [],
                    speakerLimit: state.speaker_limit,
                    globalTimeLimit: state.global_time_limit,
                    timeboxMode: state.timebox_mode as any,
                    secondsRemaining: state.seconds_remaining,
                    globalSecondsRemaining: state.global_seconds_remaining,
                    history: history || []
                });
            } else {
                set({ members: members || [], history: history || [] });
            }
        },

        subscribeToChanges: () => {
            if (realtimeChannel) return;

            realtimeChannel = supabase
                .channel('daily_sync')
                .on('postgres_changes', { event: '*', schema: 'public', table: 'daily_state' }, (payload) => {
                    const newState = payload.new as any;
                    if (newState) {
                        set({
                            status: newState.status,
                            activeMemberId: newState.active_member_id,
                            queue: newState.queue,
                            speakerLimit: newState.speaker_limit,
                            globalTimeLimit: newState.global_time_limit,
                            timeboxMode: newState.timebox_mode,
                            secondsRemaining: newState.seconds_remaining,
                            globalSecondsRemaining: newState.global_seconds_remaining,
                        });
                    }
                })
                .on('postgres_changes', { event: '*', schema: 'public', table: 'daily_members' }, () => {
                    get().fetchData();
                })
                .on('postgres_changes', { event: '*', schema: 'public', table: 'daily_history' }, () => {
                    get().fetchData();
                })
                .subscribe();
        },

        unsubscribe: () => {
            if (realtimeChannel) {
                supabase.removeChannel(realtimeChannel);
                realtimeChannel = null;
            }
        },

        addMember: async (member) => {
            await supabase.from('daily_members').insert(member);
        },

        removeMember: async (id) => {
            await supabase.from('daily_members').delete().eq('id', id);
        },

        setQueue: async (ids) => {
            await supabase.from('daily_state').update({ queue: ids }).eq('id', 1);
            set({ queue: ids });
        },

        setSpeakerLimit: async (seconds) => {
            await supabase.from('daily_state').update({ speaker_limit: seconds, seconds_remaining: seconds }).eq('id', 1);
            set({ speakerLimit: seconds, secondsRemaining: seconds });
        },

        setGlobalTimeLimit: async (seconds) => {
            await supabase.from('daily_state').update({ global_time_limit: seconds, global_seconds_remaining: seconds }).eq('id', 1);
            set({ globalTimeLimit: seconds, globalSecondsRemaining: seconds });
        },

        setTimeboxMode: async (mode) => {
            await supabase.from('daily_state').update({ timebox_mode: mode }).eq('id', 1);
            set({ timeboxMode: mode });
        },

        startDaily: async () => {
            const { members, queue, status, globalTimeLimit, timeboxMode, speakerLimit } = get();
            if (status === 'running') return;

            let dbUpdates: any = { status: 'running' };
            let stateUpdates: Partial<DailyState> = { status: 'running' };

            // If starting fresh
            if (status === 'idle' || status === 'finished') {
                const initialQueue = queue.length > 0 ? queue : members.map(m => m.id);
                const firstSpeaker = initialQueue[0];

                let calculatedSpeakerLimit = speakerLimit;
                if (timeboxMode === 'auto' && members.length > 0) {
                    calculatedSpeakerLimit = Math.floor(globalTimeLimit / members.length);
                }

                dbUpdates = {
                    status: 'running',
                    queue: initialQueue,
                    active_member_id: firstSpeaker,
                    speaker_limit: calculatedSpeakerLimit,
                    seconds_remaining: calculatedSpeakerLimit,
                    global_seconds_remaining: globalTimeLimit,
                };

                stateUpdates = {
                    status: 'running',
                    queue: initialQueue,
                    activeMemberId: firstSpeaker,
                    speakerLimit: calculatedSpeakerLimit,
                    secondsRemaining: calculatedSpeakerLimit,
                    globalSecondsRemaining: globalTimeLimit,
                };
            }

            set(stateUpdates);
            await supabase.from('daily_state').update(dbUpdates).eq('id', 1);
        },

        pauseDaily: async () => {
            const { secondsRemaining, globalSecondsRemaining } = get();

            await supabase.from('daily_state').update({
                status: 'paused',
                seconds_remaining: secondsRemaining,
                global_seconds_remaining: globalSecondsRemaining
            }).eq('id', 1);

            set({ status: 'paused' });
        },

        resumeDaily: async () => {
            await supabase.from('daily_state').update({ status: 'running' }).eq('id', 1);
            set({ status: 'running' });
        },

        nextSpeaker: async () => {
            const { queue, activeMemberId, members, speakerLimit, totalDuration } = get();
            const currentIndex = queue.indexOf(activeMemberId || '');
            const nextIndex = currentIndex + 1;

            if (nextIndex < queue.length) {
                const dbUpdates = {
                    active_member_id: queue[nextIndex],
                    seconds_remaining: speakerLimit
                };

                set({
                    activeMemberId: queue[nextIndex],
                    secondsRemaining: speakerLimit
                });

                await supabase.from('daily_state').update(dbUpdates).eq('id', 1);
            } else {
                // Finished
                const historyEntry = {
                    date: new Date().toISOString(),
                    duration: totalDuration,
                    team_size: members.length
                };

                await supabase.from('daily_history').insert(historyEntry);

                const dbUpdates = {
                    status: 'finished',
                    active_member_id: null,
                    seconds_remaining: 0
                };

                set({
                    status: 'finished',
                    activeMemberId: null,
                    secondsRemaining: 0
                });

                await supabase.from('daily_state').update(dbUpdates).eq('id', 1);
            }
        },

        resetDaily: async () => {
            const { globalTimeLimit } = get();
            const dbUpdates = {
                status: 'idle',
                active_member_id: null,
                queue: [],
                seconds_remaining: 120,
                global_seconds_remaining: globalTimeLimit,
            };

            set({
                status: 'idle',
                activeMemberId: null,
                queue: [],
                secondsRemaining: 120,
                globalSecondsRemaining: globalTimeLimit
            });

            await supabase.from('daily_state').update(dbUpdates).eq('id', 1);
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
    };
});
