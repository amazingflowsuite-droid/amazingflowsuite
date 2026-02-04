import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import type { Column, Task, TaskType } from '../store/useKanbanStore';
import { useKanbanStore } from '../store/useKanbanStore';
import { KanbanCard } from './KanbanCard';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { Input } from '@/components/ui/input';

interface Props {
    column: Column;
    tasks: Task[];
}

export const KanbanColumn = ({ column, tasks }: Props) => {
    const { setNodeRef } = useDroppable({
        id: column.id,
    });
    const { addTask } = useKanbanStore();
    const [isAdding, setIsAdding] = useState(false);
    const [newTaskContent, setNewTaskContent] = useState('');

    const handleAdd = () => {
        const rawContent = newTaskContent.trim();
        if (!rawContent) return;

        // Regex handles "/bug", "/bug text", "/bug  text"
        const commandRegex = /^\/(bug|epic|feat|block|imp)(?:\s+(.*))?$/i;
        const match = rawContent.match(commandRegex);

        let content = rawContent;
        let type: TaskType = 'story';

        if (match) {
            const command = match[1].toLowerCase(); // bug, epic, etc.
            content = match[2] ? match[2].trim() : '';

            // Map command to type
            switch (command) {
                case 'bug': type = 'bug'; break;
                case 'epic': type = 'epic'; break;
                case 'feat': type = 'feature'; break;
                case 'block': type = 'block'; break;
                case 'imp': type = 'impediment'; break;
            }

            // If user just typed "/bug", give it a default content
            if (!content) {
                content = `New ${type.charAt(0).toUpperCase() + type.slice(1)}`;
            }
        }

        if (content.trim()) {
            addTask(column.id, content, type);
            setNewTaskContent('');
            setIsAdding(false);
        }
    };

    const phaseColors = {
        'pre-dev': 'border-blue-500 bg-blue-500/5',
        'dev': 'border-amber-500 bg-amber-500/5',
        'post-dev': 'border-green-500 bg-green-500/5'
    };

    const phaseLabels = {
        'pre-dev': 'Pre-Dev',
        'dev': 'Dev',
        'post-dev': 'Post-Dev'
    };

    const accentColor = {
        'pre-dev': 'bg-blue-500',
        'dev': 'bg-amber-500',
        'post-dev': 'bg-green-500'
    };

    return (
        <div className={`w-80 flex-shrink-0 flex flex-col rounded-lg border h-full max-h-[calc(100vh-8rem)] ${phaseColors[column.phase] || 'bg-muted/30 border-border/50'}`}>
            {/* Header */}
            <div className="p-4 font-semibold text-sm flex justify-between items-center border-b border-border/40 relative overflow-hidden">
                {/* Visual Indicator Line */}
                <div className={`absolute top-0 left-0 w-full h-1 ${accentColor[column.phase]}`} />

                <div className="flex flex-col gap-1">
                    <span className="text-xs uppercase tracking-wider opacity-60 font-bold">{phaseLabels[column.phase]}</span>
                    <span>{column.title}</span>
                </div>
                <span className="bg-background/50 text-foreground px-2 py-0.5 rounded text-xs border border-border/20">{tasks.length}</span>
            </div>

            {/* Task List */}
            <div ref={setNodeRef} className="flex-1 p-2 space-y-2 overflow-y-auto min-h-[100px]">
                <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
                    {tasks.map((task) => (
                        <KanbanCard key={task.id} task={task} />
                    ))}
                </SortableContext>
            </div>

            {/* Footer */}
            <div className="p-2 border-t border-border/40">
                {isAdding ? (
                    <div className="space-y-2">
                        <Input
                            autoFocus
                            placeholder="Type '/bug', '/epic' or just text..."
                            value={newTaskContent}
                            onChange={(e) => setNewTaskContent(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                        />
                        <div className="flex gap-2 justify-between items-center">
                            <div className="flex gap-2">
                                <Button size="sm" onClick={handleAdd}>Add</Button>
                                <Button size="sm" variant="ghost" onClick={() => setIsAdding(false)}>Cancel</Button>
                            </div>
                            <span className="text-[10px] text-muted-foreground">Try /bug, /feat</span>
                        </div>
                    </div>
                ) : (
                    <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-foreground" onClick={() => setIsAdding(true)}>
                        <Plus className="mr-2 h-4 w-4" /> Add Task
                    </Button>
                )}
            </div>
        </div>
    );
};
