import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

export type RoleType = 'Dev' | 'QA' | 'Other';
export type TaskCategory = 'Implementation' | 'Test';

export type TeamMember = {
    id: string;
    name: string;
    role: string;
    roleType: RoleType;
    allocation: number;
    daysOff: number;
    dailyHours: number;
    avatar?: string;
};

export type SubTask = {
    id: string;
    story_id: string;
    title: string;
    estimate: number;
    category: TaskCategory;
    completed: boolean;
};

export type Story = {
    id: string;
    title: string;
    type: 'User Story' | 'Bug' | 'Task';
    points?: number;
    in_sprint: boolean;
    subTasks: SubTask[];
};

export type SprintSettings = {
    id?: number;
    sprintDurationDays: number;
    dailyScrumDuration: number;
    planningDuration: number;
    reviewDuration: number;
    retroDuration: number;
    refinementDuration: number;
    otherRitualsDuration: number;
};

type PlanningState = {
    members: TeamMember[];
    stories: Story[];
    settings: SprintSettings;
    loading: boolean;

    // Actions
    fetchData: () => Promise<void>;
    addMember: (member: Omit<TeamMember, 'id'>) => Promise<void>;
    updateMember: (id: string, updates: Partial<TeamMember>) => Promise<void>;
    removeMember: (id: string) => Promise<void>;

    addStory: (story: Omit<Story, 'id' | 'subTasks' | 'in_sprint'>) => Promise<void>;
    importStories: (newStories: (Omit<Story, 'id'> & { id?: string })[]) => Promise<void>;
    updateStory: (id: string, updates: Partial<Story>) => Promise<void>;
    removeStory: (id: string) => Promise<void>;
    clearBacklog: () => Promise<void>;
    cloneStory: (storyId: string) => Promise<void>;

    // SubTask Actions
    addSubTask: (storyId: string, task: Omit<SubTask, 'id' | 'story_id'>) => Promise<void>;
    updateSubTaskEstimate: (storyId: string, taskId: string, hours: number) => Promise<void>;
    updateSubTaskCategory: (storyId: string, taskId: string, category: TaskCategory) => Promise<void>;
    updateSubTask: (storyId: string, taskId: string, updates: Partial<SubTask>) => Promise<void>;
    removeSubTask: (storyId: string, taskId: string) => Promise<void>;
    cloneSubTask: (storyId: string, taskId: string) => Promise<void>;

    addToSprint: (storyId: string) => Promise<void>;
    removeFromSprint: (storyId: string) => Promise<void>;
    clearSprintBucket: () => Promise<void>;

    updateSettings: (updates: Partial<SprintSettings>) => Promise<void>;
    migrateFromLocal: (localState: any) => Promise<void>;

    // UI State
    isHelpOpen: boolean;
    toggleHelp: () => void;
};

export const usePlanningStore = create<PlanningState>((set, get) => ({
    members: [],
    stories: [],
    settings: {
        sprintDurationDays: 15,
        dailyScrumDuration: 0.25, // 15 mins
        planningDuration: 4,
        reviewDuration: 2,
        retroDuration: 2,
        refinementDuration: 2, // Default updated to match DB default if needed
        otherRitualsDuration: 0,
    },
    loading: false,
    isHelpOpen: false,

    fetchData: async () => {
        set({ loading: true });
        try {
            // 1. Fetch Members (Merged from daily_members)
            const { data: membersData } = await supabase
                .from('daily_members')
                .select('*')
                .order('name');

            const members: TeamMember[] = (membersData || []).map((m: any) => ({
                id: m.id,
                name: m.name,
                role: m.role || '',
                roleType: (m.role_type as RoleType) || 'Dev',
                allocation: m.allocation || 100,
                daysOff: m.days_off || 0,
                dailyHours: m.daily_hours || 8,
                avatar: m.avatar
            }));

            // 2. Fetch Settings
            const { data: settingsData } = await supabase
                .from('planning_settings')
                .select('*')
                .eq('id', 1)
                .single();

            const settings: SprintSettings = settingsData ? {
                sprintDurationDays: settingsData.sprint_duration_days,
                dailyScrumDuration: settingsData.daily_scrum_duration,
                planningDuration: settingsData.planning_duration,
                reviewDuration: settingsData.review_duration,
                retroDuration: settingsData.retro_duration,
                refinementDuration: settingsData.refinement_duration,
                otherRitualsDuration: settingsData.other_rituals_duration
            } : get().settings;

            // 3. Fetch Stories & Subtasks
            const { data: storiesData } = await supabase
                .from('planning_stories')
                .select(`
                    *,
                    planning_subtasks (*)
                `)
                .order('created_at'); // Simplistic ordering for now

            const stories: Story[] = (storiesData || []).map((s: any) => ({
                id: s.id,
                title: s.title,
                type: s.type,
                points: s.points,
                in_sprint: s.in_sprint,
                subTasks: (s.planning_subtasks || []).map((t: any) => ({
                    id: t.id,
                    story_id: t.story_id,
                    title: t.title,
                    estimate: t.estimate,
                    category: t.category,
                    completed: t.completed
                }))
            }));

            set({ members, stories, settings, loading: false });
        } catch (error) {
            console.error('Failed to fetch planning data:', error);
            set({ loading: false });
        }
    },

    toggleHelp: () => set((state) => ({ isHelpOpen: !state.isHelpOpen })),

    // --- Actions ---

    addMember: async (member) => {
        // Optimistic
        const tempId = uuidv4();
        const newMember: TeamMember = { ...member, id: tempId };
        set(state => ({ members: [...state.members, newMember] }));

        // DB
        const { error } = await supabase.from('daily_members').insert({
            name: member.name,
            role: member.role,
            role_type: member.roleType,
            allocation: member.allocation,
            days_off: member.daysOff,
            daily_hours: member.dailyHours
        });

        if (error) {
            console.error('Error adding member:', error);
            // Revert or re-fetch (simplest is re-fetch or ignore for now)
            get().fetchData();
        } else {
            get().fetchData(); // Refresh to get real ID
        }
    },

    updateMember: async (id, updates) => {
        // Optimistic
        set(state => ({
            members: state.members.map(m => m.id === id ? { ...m, ...updates } : m)
        }));

        // DB Mapping
        const dbUpdates: any = {};
        if (updates.name !== undefined) dbUpdates.name = updates.name;
        if (updates.role !== undefined) dbUpdates.role = updates.role;
        if (updates.roleType !== undefined) dbUpdates.role_type = updates.roleType;
        if (updates.allocation !== undefined) dbUpdates.allocation = updates.allocation;
        if (updates.daysOff !== undefined) dbUpdates.days_off = updates.daysOff;
        if (updates.dailyHours !== undefined) dbUpdates.daily_hours = updates.dailyHours;

        await supabase.from('daily_members').update(dbUpdates).eq('id', id);
    },

    removeMember: async (id) => {
        set(state => ({ members: state.members.filter(m => m.id !== id) }));
        await supabase.from('daily_members').delete().eq('id', id);
    },

    addStory: async (story) => {
        const id = uuidv4();
        const newStory: Story = { ...story, id, in_sprint: false, subTasks: [] };
        set(state => ({ stories: [...state.stories, newStory] }));

        const { error } = await supabase.from('planning_stories').insert({
            id,
            title: story.title,
            type: story.type,
            points: story.points,
            in_sprint: false
        });

        if (error) console.error("Error adding story", error);
    },

    importStories: async (newStories) => {
        // Bulk implementation
        // For simplicity, we loop or use bulk insert. Bulk insert is better.
        // But we need to handle upserts or checks. 
        // Logic from original store: check if exists, update; else insert.

        const state = get();
        const storiesToInsert: any[] = [];
        // storiesToUpdate removed as unused

        // This is complex to robustly sync fully optimistically. 
        // We will just do DB ops and then fetch.

        for (const s of newStories) {
            const existing = state.stories.find(ex => ex.id === s.id);
            if (existing) {
                await supabase.from('planning_stories').update({
                    title: s.title,
                    type: s.type
                }).eq('id', s.id);
                // Handle subtasks?? The import logic in original store was specific for Jira import
                // For now, let's assume specific "Import" button usage sends fresh data
            } else {
                storiesToInsert.push({
                    id: s.id || uuidv4(),
                    title: s.title,
                    type: s.type,
                    points: s.points,
                    in_sprint: false
                });
            }
        }

        if (storiesToInsert.length > 0) {
            await supabase.from('planning_stories').insert(storiesToInsert);
        }

        // Refresh
        get().fetchData();
    },

    updateStory: async (id, updates) => {
        set(state => ({
            stories: state.stories.map(s => s.id === id ? { ...s, ...updates } : s)
        }));

        await supabase.from('planning_stories').update(updates).eq('id', id);
    },

    removeStory: async (id) => {
        set(state => ({ stories: state.stories.filter(s => s.id !== id) }));
        await supabase.from('planning_stories').delete().eq('id', id);
    },

    clearBacklog: async () => {
        set(state => ({
            stories: state.stories.filter(s => s.in_sprint) // Keep only sprint stories
        }));

        // Delete only stories that are NOT in the sprint
        await supabase.from('planning_stories').delete().eq('in_sprint', false);
    },

    cloneStory: async (storyId) => {
        const story = get().stories.find(s => s.id === storyId);
        if (!story) return;

        const newId = uuidv4();
        const newTitle = `${story.title} (Copy)`;

        // 1. Insert Story
        const { error } = await supabase.from('planning_stories').insert({
            id: newId,
            title: newTitle,
            type: story.type,
            points: story.points,
            in_sprint: story.in_sprint
        });

        if (!error && story.subTasks.length > 0) {
            const newSubtasks = story.subTasks.map(t => ({
                story_id: newId,
                title: t.title,
                estimate: t.estimate,
                category: t.category,
                completed: t.completed
            }));
            await supabase.from('planning_subtasks').insert(newSubtasks);
        }

        get().fetchData();
    },

    // --- SubTasks ---

    addSubTask: async (storyId, task) => {
        const tempId = uuidv4();
        // Optimistic
        set(state => ({
            stories: state.stories.map(s => s.id === storyId ? {
                ...s,
                subTasks: [...s.subTasks, { ...task, id: tempId, story_id: storyId }]
            } : s)
        }));

        const { data, error } = await supabase.from('planning_subtasks').insert({
            story_id: storyId,
            title: task.title,
            estimate: task.estimate,
            category: task.category,
            completed: task.completed
        }).select().single();

        if (!error && data) {
            // Update ID
            set(state => ({
                stories: state.stories.map(s => s.id === storyId ? {
                    ...s,
                    subTasks: s.subTasks.map(t => t.id === tempId ? { ...t, id: data.id } : t)
                } : s)
            }));
        }
    },

    updateSubTaskEstimate: async (storyId, taskId, hours) => {
        set(state => ({
            stories: state.stories.map(s => s.id === storyId ? {
                ...s,
                subTasks: s.subTasks.map(t => t.id === taskId ? { ...t, estimate: hours } : t)
            } : s)
        }));
        await supabase.from('planning_subtasks').update({ estimate: hours }).eq('id', taskId);
    },

    updateSubTaskCategory: async (storyId, taskId, category) => {
        set(state => ({
            stories: state.stories.map(s => s.id === storyId ? {
                ...s,
                subTasks: s.subTasks.map(t => t.id === taskId ? { ...t, category } : t)
            } : s)
        }));
        await supabase.from('planning_subtasks').update({ category }).eq('id', taskId);
    },

    updateSubTask: async (storyId, taskId, updates) => {
        set(state => ({
            stories: state.stories.map(s => s.id === storyId ? {
                ...s,
                subTasks: s.subTasks.map(t => t.id === taskId ? { ...t, ...updates } : t)
            } : s)
        }));
        await supabase.from('planning_subtasks').update(updates).eq('id', taskId);
    },

    removeSubTask: async (storyId, taskId) => {
        set(state => ({
            stories: state.stories.map(s => s.id === storyId ? {
                ...s,
                subTasks: s.subTasks.filter(t => t.id !== taskId)
            } : s)
        }));
        await supabase.from('planning_subtasks').delete().eq('id', taskId);
    },

    cloneSubTask: async (storyId, taskId) => {
        // This is tricky optimistically without complex logic. 
        // Let's do DB then fetch.
        const story = get().stories.find(s => s.id === storyId);
        const task = story?.subTasks.find(t => t.id === taskId);
        if (!task) return;

        await supabase.from('planning_subtasks').insert({
            story_id: storyId,
            title: `${task.title} (Copy)`,
            estimate: task.estimate,
            category: task.category,
            completed: task.completed
        });

        get().fetchData();
    },

    // --- Sprint Bucket ---

    addToSprint: async (storyId) => {
        set(state => ({
            stories: state.stories.map(s => s.id === storyId ? { ...s, in_sprint: true } : s)
        }));
        await supabase.from('planning_stories').update({ in_sprint: true }).eq('id', storyId);
    },

    removeFromSprint: async (storyId) => {
        set(state => ({
            stories: state.stories.map(s => s.id === storyId ? { ...s, in_sprint: false } : s)
        }));
        await supabase.from('planning_stories').update({ in_sprint: false }).eq('id', storyId);
    },

    clearSprintBucket: async () => {
        set(state => ({
            stories: state.stories.map(s => ({ ...s, in_sprint: false }))
        }));
        // Update all stories where in_sprint = true
        await supabase.from('planning_stories').update({ in_sprint: false }).eq('in_sprint', true);
    },

    updateSettings: async (updates) => {
        set(state => ({ settings: { ...state.settings, ...updates } }));

        const dbUpdates: any = {};
        if (updates.sprintDurationDays) dbUpdates.sprint_duration_days = updates.sprintDurationDays;
        if (updates.dailyScrumDuration) dbUpdates.daily_scrum_duration = updates.dailyScrumDuration;
        if (updates.planningDuration) dbUpdates.planning_duration = updates.planningDuration;
        if (updates.reviewDuration) dbUpdates.review_duration = updates.reviewDuration;
        if (updates.retroDuration) dbUpdates.retro_duration = updates.retroDuration;
        if (updates.refinementDuration) dbUpdates.refinement_duration = updates.refinementDuration;
        if (updates.otherRitualsDuration) dbUpdates.other_rituals_duration = updates.otherRitualsDuration;

        await supabase.from('planning_settings').update(dbUpdates).eq('id', 1);
    },

    migrateFromLocal: async (localState: any) => {
        set({ loading: true });
        try {
            const { members, stories, settings, sprintBucketStoryIds } = localState;
            console.log("Migrating from local:", localState);

            // 1. Migrate Members
            const currentMembers = get().members;

            for (const m of members || []) {
                const exists = currentMembers.some(cm => cm.name === m.name);
                if (!exists) {
                    await supabase.from('daily_members').insert({
                        name: m.name,
                        role: m.role,
                        role_type: m.roleType,
                        allocation: m.allocation,
                        days_off: m.daysOff,
                        daily_hours: m.dailyHours
                    });
                }
            }

            // 2. Migrate Settings
            if (settings) {
                await get().updateSettings(settings);
            }

            // 3. Migrate Stories
            const bucketIds = new Set(sprintBucketStoryIds || []);

            for (const s of stories || []) {
                const inSprint = bucketIds.has(s.id);

                // Insert/Upsert Story
                const { error: storyError } = await supabase.from('planning_stories').upsert({
                    id: s.id,
                    title: s.title,
                    type: s.type,
                    points: s.points,
                    in_sprint: inSprint
                });

                if (!storyError && s.subTasks && s.subTasks.length > 0) {
                    // Upsert Subtasks
                    for (const t of s.subTasks) {
                        await supabase.from('planning_subtasks').upsert({
                            id: t.id,
                            story_id: s.id,
                            title: t.title,
                            estimate: t.estimate,
                            category: t.category,
                            completed: t.completed
                        });
                    }
                }
            }

            // Refresh all data
            await get().fetchData();

        } catch (error) {
            console.error('Migration failed:', error);
        } finally {
            set({ loading: false });
        }
    },
}));
