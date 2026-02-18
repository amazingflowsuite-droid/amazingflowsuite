import { useState } from 'react';
import { usePlanningStore } from '../store/usePlanningStore';
import { Plus, Search, FileInput, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StoryCard } from './StoryCard';
import { ImportModal } from './modals/ImportModal';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

export const BacklogInput = () => {
    const { stories, addStory, clearBacklog } = usePlanningStore();
    const [newStoryTitle, setNewStoryTitle] = useState('');

    const availableStories = stories.filter(s => !s.in_sprint);

    const handleClearBacklog = () => {
        if (availableStories.length === 0) return;
        if (confirm(`Are you sure you want to delete all ${availableStories.length} items from the Backlog?`)) {
            clearBacklog();
        }
    };

    const handleAddStory = () => {
        if (newStoryTitle.trim()) {
            addStory({ title: newStoryTitle, type: 'User Story' });
            setNewStoryTitle('');
        }
    };

    return (
        <div className="flex flex-col h-full bg-white">
            {/* Header */}
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
                <h2 className="text-lg font-bold text-gray-800">Product Backlog</h2>
                <div className="flex items-center gap-2">
                    <ImportModal>
                        <Button
                            variant="outline"
                            size="sm"
                            className="text-xs font-medium text-gray-600 border-gray-200 hover:bg-gray-50 flex items-center gap-2"
                        >
                            <FileInput className="w-3 h-3" /> Import
                        </Button>
                    </ImportModal>

                    {availableStories.length > 0 && (
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={handleClearBacklog}
                                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Clear Backlog</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    )}
                </div>
            </div>

            {/* Search Area */}
            <div className="p-4 bg-gray-50/50 border-b border-gray-100">
                <div className="flex shadow-sm rounded-md">
                    <div className="relative flex-grow focus-within:z-10">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <Search className="w-4 h-4 text-gray-400" />
                        </div>
                        <input
                            className="block w-full rounded-l-md border-0 py-2.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-emerald-500 sm:text-sm sm:leading-6"
                            placeholder="Search or filter stories..."
                            type="text"
                            value={newStoryTitle}
                            onChange={(e) => setNewStoryTitle(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddStory()}
                        />
                    </div>
                    <button
                        className="relative -ml-px inline-flex items-center gap-x-1.5 rounded-r-md px-4 py-2 text-sm font-semibold text-white bg-emerald-500 hover:bg-emerald-600 focus:z-10 ring-1 ring-inset ring-emerald-500 transition-colors"
                        type="button"
                        onClick={handleAddStory}
                    >
                        <Plus className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Content List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/30">
                {availableStories.length > 0 ? (
                    availableStories.map(story => (
                        <StoryCard key={story.id} story={story} isInSprint={false} />
                    ))
                ) : (
                    <div className="text-center py-10 text-muted-foreground text-sm">
                        No stories in backlog. Create one or import!
                    </div>
                )}
            </div>
        </div>
    );
};
