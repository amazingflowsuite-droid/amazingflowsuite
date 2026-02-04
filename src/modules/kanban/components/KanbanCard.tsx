import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Task, TaskType } from '../store/useKanbanStore';
import { useKanbanStore } from '../store/useKanbanStore';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GripVertical, Trash2 } from 'lucide-react';

interface Props {
    task: Task;
}

export const KanbanCard = ({ task }: Props) => {
    const { deleteTask } = useKanbanStore();
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: task.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    const getTypeStyles = (type: TaskType) => {
        switch (type) {
            case 'epic': return 'bg-purple-500/10 text-purple-600 border-purple-200';
            case 'feature': return 'bg-blue-500/10 text-blue-600 border-blue-200';
            case 'bug': return 'bg-red-500/10 text-red-600 border-red-200';
            case 'block': return 'bg-destructive/10 text-destructive border-destructive/20';
            case 'impediment': return 'bg-orange-500/10 text-orange-600 border-orange-200';
            default: return 'bg-green-500/10 text-green-600 border-green-200';
        }
    };

    const typeLabels = {
        epic: 'EPIC',
        feature: 'FEAT',
        story: 'STORY',
        bug: 'BUG',
        block: 'BLOCK',
        impediment: 'IMP'
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent drag start when clicking delete
        deleteTask(task.id);
    };

    return (
        <Card
            ref={setNodeRef}
            style={style}
            className={`bg-card hover:border-primary/50 cursor-grab active:cursor-grabbing group shadow-sm relative pr-6 ${task.type === 'block' ? 'border-destructive/40' : ''}`}
            {...attributes}
            {...listeners}
        >
            <CardContent className="p-3 flex flex-col gap-2 relative">
                <div className="flex gap-2 items-start">
                    <div className="mt-1 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                        <GripVertical className="h-4 w-4" />
                    </div>
                    <span className="text-sm leading-relaxed flex-1">{task.content}</span>
                </div>

                <div className="flex gap-2 pl-6">
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border uppercase ${getTypeStyles(task.type)}`}>
                        {typeLabels[task.type]}
                    </span>
                    {task.priority && task.priority !== 'medium' && (
                        <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded border ${task.priority === 'critical' ? 'bg-destructive text-destructive-foreground' :
                            task.priority === 'high' ? 'text-orange-600 border-orange-200' : 'text-slate-500'
                            }`}>
                            {task.priority}
                        </span>
                    )}
                </div>

                <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={handleDelete}
                >
                    <Trash2 className="h-3 w-3" />
                </Button>
            </CardContent>
        </Card>
    );
};
