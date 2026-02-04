import { useState } from 'react';
import {
    DndContext,
    DragOverlay,
    closestCorners,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    type DragStartEvent,
    type DragOverEvent,
    type DragEndEvent,
} from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { useKanbanStore } from '../store/useKanbanStore';
import { KanbanColumn } from './KanbanColumn';
import { KanbanCard } from './KanbanCard';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const KanbanBoard = () => {
    const { columns, tasks, moveTask } = useKanbanStore();
    const [activeId, setActiveId] = useState<string | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string);
    };

    const handleDragOver = (event: DragOverEvent) => {
        const { active, over } = event;
        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        // Find the containers
        const activeTask = tasks.find(t => t.id === activeId);
        const overTask = tasks.find(t => t.id === overId);

        if (!activeTask) return;

        const activeColumnId = activeTask.columnId;
        const overColumnId = overTask ? overTask.columnId : overId; // If over a column directly

        if (activeColumnId !== overColumnId) {
            // Logic to move task between columns during drag (optional visual feedback)
            // For simplicity in MVP, we usually wait for DragEnd, but visual update needs state manipulation
        }
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (!over) {
            setActiveId(null);
            return;
        }

        const activeId = active.id as string;
        const overId = over.id as string;

        const activeTask = tasks.find((t) => t.id === activeId);
        const overTask = tasks.find((t) => t.id === overId);

        if (!activeTask) {
            setActiveId(null);
            return;
        }

        // Dropped over a Column (empty or not)
        const isOverColumn = columns.some(col => col.id === overId);
        if (isOverColumn) {
            if (activeTask.columnId !== overId) {
                moveTask(activeId, overId);
            }
        }
        // Dropped over another Task
        else if (overTask) {
            if (activeTask.columnId !== overTask.columnId) {
                moveTask(activeId, overTask.columnId);
            }
            // Improve reordering logic here later
        }

        setActiveId(null);
    };

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            <header className="h-16 border-b border-border flex items-center px-6 gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link to="/">
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                </Button>
                <h1 className="text-xl font-bold">Amazing Kanban</h1>
            </header>

            <main className="flex-1 p-6 overflow-x-auto overflow-y-hidden">
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCorners}
                    onDragStart={handleDragStart}
                    onDragOver={handleDragOver}
                    onDragEnd={handleDragEnd}
                >
                    <div className="flex gap-4 h-full">
                        {columns.map((col) => (
                            <KanbanColumn key={col.id} column={col} tasks={tasks.filter(t => t.columnId === col.id)} />
                        ))}
                        {/* Spacer to allow scrolling to the very end */}
                        <div className="w-2 flex-shrink-0" />
                    </div>

                    <DragOverlay>
                        {activeId ? (
                            <KanbanCard task={tasks.find(t => t.id === activeId)!} />
                        ) : null}
                    </DragOverlay>
                </DndContext>
            </main>
        </div>
    );
};
