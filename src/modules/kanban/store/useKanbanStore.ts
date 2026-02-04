import { create } from 'zustand';
import { supabase } from '@/lib/supabase';

export type TaskType = 'epic' | 'feature' | 'story' | 'bug' | 'block' | 'impediment';
export type Priority = 'low' | 'medium' | 'high' | 'critical';

export type Task = {
    id: string;
    content: string;
    column_id: string; // Changed to match DB column name
    type: TaskType;
    priority?: Priority;
    parent_id?: string; // Changed to match DB column name
    order?: number;
};

export type Column = {
    id: string;
    title: string;
    phase: 'pre-dev' | 'dev' | 'post-dev';
    order: number;
};

interface KanbanState {
    columns: Column[];
    tasks: Task[];
    isLoading: boolean;
    error: string | null;

    // Actions
    fetchBoard: () => Promise<void>;
    addTask: (columnId: string, content: string, type?: TaskType) => Promise<void>;
    moveTask: (taskId: string, newColumnId: string) => Promise<void>;
    deleteTask: (taskId: string) => Promise<void>;
    setTasks: (tasks: Task[]) => void; // Still useful for optimistic UI updates
}

export const useKanbanStore = create<KanbanState>((set, get) => ({
    columns: [],
    tasks: [],
    isLoading: false,
    error: null,

    fetchBoard: async () => {
        set({ isLoading: true, error: null });
        try {
            const { data: cols, error: colsError } = await supabase
                .from('kanban_columns')
                .select('*')
                .order('order');

            if (colsError) throw colsError;

            const { data: tasks, error: tasksError } = await supabase
                .from('kanban_tasks')
                .select('*');

            if (tasksError) throw tasksError;

            set({ columns: cols || [], tasks: tasks || [] });
        } catch (err: any) {
            console.error('Error fetching board:', err);
            set({ error: err.message });
        } finally {
            set({ isLoading: false });
        }
    },

    addTask: async (columnId, content, type = 'story') => {
        // Optimistic Update can be added here, but for now let's just wait for DB
        try {
            const newTask = {
                column_id: columnId,
                content,
                type,
                priority: 'medium'
            };

            const { data, error } = await supabase
                .from('kanban_tasks')
                .insert(newTask)
                .select()
                .single();

            if (error) throw error;

            if (data) {
                set(state => ({ tasks: [...state.tasks, data as Task] }));
            }
        } catch (err: any) {
            console.error('Error adding task:', err);
        }
    },

    moveTask: async (taskId, newColumnId) => {
        // Optimistic Update
        const previousTasks = get().tasks;
        set(state => ({
            tasks: state.tasks.map(t => t.id === taskId ? { ...t, column_id: newColumnId } : t)
        }));

        try {
            const { error } = await supabase
                .from('kanban_tasks')
                .update({ column_id: newColumnId })
                .eq('id', taskId);

            if (error) throw error;
        } catch (err) {
            // Rollback
            console.error('Error moving task:', err);
            set({ tasks: previousTasks });
        }
    },

    deleteTask: async (taskId) => {
        // Optimistic
        const previousTasks = get().tasks;
        set(state => ({
            tasks: state.tasks.filter(t => t.id !== taskId)
        }));

        try {
            const { error } = await supabase
                .from('kanban_tasks')
                .delete()
                .eq('id', taskId);

            if (error) throw error;
        } catch (err) {
            console.error('Error deleting task:', err);
            set({ tasks: previousTasks });
        }
    },

    setTasks: (tasks) => set({ tasks }),
}));
