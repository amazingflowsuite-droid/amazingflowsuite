import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { persist } from 'zustand/middleware';

export type TaskType = 'epic' | 'feature' | 'story' | 'bug' | 'block' | 'impediment';
export type Priority = 'low' | 'medium' | 'high' | 'critical';

export type Task = {
    id: string;
    content: string;
    columnId: string;
    type: TaskType;
    priority?: Priority;
    parentId?: string;
};

export type Column = {
    id: string;
    title: string;
    phase: 'pre-dev' | 'dev' | 'post-dev';
};

interface KanbanState {
    columns: Column[];
    tasks: Task[];
    addTask: (columnId: string, content: string, type?: TaskType) => void;
    moveTask: (taskId: string, newColumnId: string) => void;
    deleteTask: (taskId: string) => void;
    setTasks: (tasks: Task[]) => void;
}

export const useKanbanStore = create<KanbanState>()(
    persist(
        (set) => ({
            columns: [
                { id: 'backlog', title: 'Backlog', phase: 'pre-dev' },
                { id: 'business_refinement', title: 'Business Refinement', phase: 'pre-dev' },
                { id: 'business_refinement_done', title: 'Business Refinement Done', phase: 'pre-dev' },
                { id: 'tech_refinement', title: 'Technical Refinement', phase: 'pre-dev' },
                { id: 'ready_dev', title: 'Ready for Dev', phase: 'dev' },
                { id: 'in_dev', title: 'In Development', phase: 'dev' },
                { id: 'developed', title: 'Developed', phase: 'dev' },
                { id: 'ready_qa', title: 'Ready for QA', phase: 'dev' },
                { id: 'in_qa', title: 'In QA Testing', phase: 'dev' },
                { id: 'qa_tested', title: 'QA Tested', phase: 'post-dev' },
                { id: 'ready_uat', title: 'Ready for UAT', phase: 'post-dev' },
                { id: 'ready_prod', title: 'Ready for Production', phase: 'post-dev' },
                { id: 'in_prod', title: 'In Production', phase: 'post-dev' },
                { id: 'validated_prod', title: 'Validated in Prod', phase: 'post-dev' },
            ],
            tasks: [
                { id: '1', columnId: 'backlog', content: 'Initialize Project', type: 'story', priority: 'high' },
                { id: '2', columnId: 'in_dev', content: 'Build Kanban Board', type: 'feature', priority: 'critical' },
            ],
            addTask: (columnId, content, type = 'story') =>
                set((state) => ({
                    tasks: [...state.tasks, { id: uuidv4(), columnId, content, type }],
                })),
            moveTask: (taskId, newColumnId) =>
                set((state) => ({
                    tasks: state.tasks.map((task) =>
                        task.id === taskId ? { ...task, columnId: newColumnId } : task
                    ),
                })),
            deleteTask: (taskId) =>
                set((state) => ({
                    tasks: state.tasks.filter((task) => task.id !== taskId),
                })),
            setTasks: (newTasks) => set({ tasks: newTasks }),
        }),
        {
            name: 'amazing-kanban-v4',
        }
    )
);
