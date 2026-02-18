import React, { useState } from 'react';
import { usePlanningStore } from '../store/usePlanningStore';
import type { Story, TaskCategory } from '../store/usePlanningStore';
import { ChevronDown, ChevronRight, Vote, Plus, Copy, CheckCircle2, Trash2, Edit2, X, Save } from 'lucide-react';
import { PlanningPokerModal } from './modals/PlanningPokerModal';
import { clsx } from 'clsx';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface StoryCardProps {
    story: Story;
    isInSprint: boolean;
}

export const StoryCard: React.FC<StoryCardProps> = ({ story, isInSprint }) => {

    const { updateStory, removeStory, cloneStory, addToSprint, removeFromSprint, addSubTask, updateSubTask, removeSubTask } = usePlanningStore();
    const [isExpanded, setIsExpanded] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(story.title);
    const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
    const [newSubtaskEstimate, setNewSubtaskEstimate] = useState('');
    const [newSubtaskCategory, setNewSubtaskCategory] = useState<TaskCategory>('Implementation');
    const [pokerTask, setPokerTask] = useState<{ id: string, title: string, estimate: number } | null>(null);

    const handleSaveTitle = () => {
        if (editTitle.trim()) {
            updateStory(story.id, { title: editTitle });
            setIsEditing(false);
        }
    };

    const handleAddSubtask = () => {
        if (newSubtaskTitle.trim()) {
            addSubTask(story.id, {
                title: newSubtaskTitle,
                category: newSubtaskCategory,
                estimate: Number(newSubtaskEstimate) || 0,
                completed: false
            });
            setNewSubtaskTitle('');
            setNewSubtaskEstimate('');
        }
    };

    const handleClone = (e: React.MouseEvent) => {
        e.stopPropagation();
        cloneStory(story.id);
    };

    const toggleSprintBucket = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (isInSprint) {
            removeFromSprint(story.id);
        } else {
            addToSprint(story.id);
        }
    };

    const totalSubtasks = story.subTasks?.length || 0;

    return (
        <>
            <Card className={clsx(
                "group transition-all duration-200 border-l-4",
                isInSprint ? "border-l-emerald-500 bg-emerald-500/5 hover:bg-emerald-500/10" : "border-l-blue-500 hover:bg-muted/50"
            )}>
                <div className="p-3">
                    <div className="flex items-start gap-3">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 mt-0.5 shrink-0 text-muted-foreground hover:text-foreground"
                            onClick={() => setIsExpanded(!isExpanded)}
                        >
                            {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                        </Button>

                        <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                                {isEditing ? (
                                    <div className="flex items-center gap-2 flex-1 mr-2">
                                        <Input
                                            value={editTitle}
                                            onChange={e => setEditTitle(e.target.value)}
                                            className="h-7 text-sm"
                                            autoFocus
                                            onKeyDown={e => e.key === 'Enter' && handleSaveTitle()}
                                        />
                                        <Button size="icon" variant="ghost" className="h-7 w-7 text-emerald-500" onClick={handleSaveTitle}>
                                            <Save className="h-4 w-4" />
                                        </Button>
                                        <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => setIsEditing(false)}>
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="flex-1">
                                        <h4
                                            className="font-medium text-sm text-foreground leading-tight cursor-pointer hover:text-primary transition-colors"
                                            onClick={() => setIsExpanded(!isExpanded)}
                                        >
                                            {story.title}
                                        </h4>
                                        <div className="flex items-center gap-2 mt-1.5">
                                            <Badge variant="outline" className="text-[10px] px-1.5 h-4 font-normal text-muted-foreground border-border/50">
                                                {story.type}
                                            </Badge>

                                            {story.points !== undefined && (
                                                <Badge variant="secondary" className="text-[10px] px-1.5 h-4 font-normal bg-blue-500/10 text-blue-500 hover:bg-blue-500/20">
                                                    {story.points} pts
                                                </Badge>
                                            )}

                                            {totalSubtasks > 0 && (
                                                <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground ml-1">
                                                    <span>{story.subTasks.length} tasks</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            {!isEditing && (
                                <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-primary" onClick={() => setIsEditing(true)}>
                                    <Edit2 className="h-3.5 w-3.5" />
                                </Button>
                            )}

                            <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-primary" onClick={handleClone}>
                                <Copy className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-muted-foreground hover:text-destructive"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (confirm('Delete story?')) removeStory(story.id);
                                }}
                            >
                                <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className={clsx("h-7 w-7", isInSprint ? "text-emerald-500 hover:bg-emerald-500/20" : "text-muted-foreground hover:text-primary")}
                                onClick={toggleSprintBucket}
                                title={isInSprint ? "Remove from Sprint" : "Add to Sprint"}
                            >
                                {isInSprint ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Plus className="h-4 w-4" />}
                            </Button>
                        </div>
                    </div>

                    {isExpanded && (
                        <div className="mt-3 pl-9 animate-in slide-in-from-top-2 duration-200">
                            <Separator className="mb-3 bg-border/50" />

                            <div className="space-y-2 mb-3">
                                {story.subTasks?.map(task => (
                                    <div key={task.id} className="flex items-center gap-2 group/task text-sm">
                                        <div
                                            className={clsx("cursor-pointer transition-colors", task.completed ? "text-emerald-500" : "text-muted-foreground hover:text-foreground")}
                                            onClick={() => updateSubTask(story.id, task.id, { completed: !task.completed })}
                                        >
                                            {task.completed ? <CheckCircle2 className="w-4 h-4" /> : <div className="w-4 h-4 rounded-full border-2 border-current opacity-60" />}
                                        </div>

                                        <div className={clsx("p-1 rounded bg-muted/30 text-[10px] font-mono w-8 text-center",
                                            task.category === 'Test' ? "text-emerald-500 bg-emerald-500/10" : "text-blue-500 bg-blue-500/10"
                                        )}>
                                            {task.category === 'Implementation' ? 'Dev' : 'QA'}
                                        </div>

                                        <div className={clsx("flex-1", task.completed && "line-through text-muted-foreground/60")}>
                                            {isEditing ? (
                                                <Input
                                                    className="h-6 text-xs px-1"
                                                    value={task.title}
                                                    onChange={(e) => updateSubTask(story.id, task.id, { title: e.target.value })}
                                                    onClick={(e) => e.stopPropagation()}
                                                />
                                            ) : (
                                                task.title
                                            )}
                                        </div>

                                        <div className="text-[10px] text-muted-foreground font-mono w-14 text-right">
                                            {isEditing ? (
                                                <Input
                                                    type="number"
                                                    className="h-6 text-xs px-1 text-right"
                                                    value={task.estimate}
                                                    onChange={(e) => updateSubTask(story.id, task.id, { estimate: Number(e.target.value) })}
                                                    onClick={(e) => e.stopPropagation()}
                                                />
                                            ) : (
                                                `${task.estimate}h`
                                            )}
                                        </div>

                                        <div className="flex gap-1 opacity-0 group-hover/task:opacity-100 transition-opacity">
                                            {!isEditing && (
                                                <>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-5 w-5 text-purple-400 hover:text-purple-300 hover:bg-purple-400/20"
                                                        onClick={() => setPokerTask({ id: task.id, title: task.title, estimate: task.estimate })}
                                                        title="Planning Poker"
                                                    >
                                                        <Vote className="h-3 w-3" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-5 w-5 text-muted-foreground hover:text-destructive"
                                                        onClick={() => removeSubTask(story.id, task.id)}
                                                    >
                                                        <X className="w-3 h-3" />
                                                    </Button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                ))}

                                {(!story.subTasks || story.subTasks.length === 0) && (
                                    <div className="text-xs text-muted-foreground/60 italic px-1">
                                        No subtasks. Add breakdown below to estimate hours.
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-2">
                                <select
                                    className="h-7 rounded-md border border-input bg-background/50 px-2 text-xs shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
                                    value={newSubtaskCategory}
                                    onChange={e => setNewSubtaskCategory(e.target.value as TaskCategory)}
                                >
                                    <option value="Implementation">Dev</option>
                                    <option value="Test">QA</option>
                                </select>
                                <Input
                                    className="h-7 text-xs flex-1"
                                    placeholder="New subtask..."
                                    value={newSubtaskTitle}
                                    onChange={e => setNewSubtaskTitle(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && handleAddSubtask()}
                                />
                                <Input
                                    type="number"
                                    className="h-7 text-xs w-16 text-right"
                                    placeholder="h"
                                    value={newSubtaskEstimate}
                                    onChange={e => setNewSubtaskEstimate(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && handleAddSubtask()}
                                />
                                <Button size="sm" variant="secondary" className="h-7 px-2 text-xs" onClick={handleAddSubtask}>
                                    <Plus className="w-3 h-3" />
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </Card>

            {pokerTask && (
                <PlanningPokerModal
                    isOpen={!!pokerTask}
                    onClose={() => setPokerTask(null)}
                    storyId={story.id}
                    taskId={pokerTask.id}
                    taskTitle={pokerTask.title}
                    currentEstimate={pokerTask.estimate}
                />
            )}
        </>
    );
};
