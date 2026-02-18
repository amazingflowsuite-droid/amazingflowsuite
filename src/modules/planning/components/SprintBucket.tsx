import { usePlanningStore } from '../store/usePlanningStore';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StoryCard } from './StoryCard';
import { RotateCw } from 'lucide-react';

export const SprintBucket = () => {
    const { stories, clearSprintBucket } = usePlanningStore();
    const sprintStories = stories.filter(s => s.in_sprint);

    const handleClearBucket = () => {
        if (sprintStories.length === 0) return;
        if (confirm(`Move all ${sprintStories.length} items back to Backlog?`)) {
            clearSprintBucket();
        }
    };

    return (
        <div className="flex flex-col h-full bg-white">
            {/* Bucket Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-white shrink-0">
                <div className="flex items-center gap-3">
                    <h2 className="text-lg font-bold text-gray-800">Sprint Bucket</h2>
                    <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border-none px-2.5 py-0.5 text-xs font-medium rounded-full">
                        {sprintStories.length} items
                    </Badge>
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleClearBucket}
                    className="text-gray-400 hover:text-emerald-500 transition-colors hover:rotate-180 duration-300"
                    title="Clear Bucket"
                >
                    <RotateCw className="w-4 h-4" />
                </Button>
            </div>

            {/* Bucket Content */}
            <div className="flex-1 overflow-y-auto p-6 bg-gray-50/30 space-y-4">
                {sprintStories.length > 0 ? (
                    sprintStories.map(story => (
                        <StoryCard key={story.id} story={story} isInSprint={true} />
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center h-48 text-gray-400 border-2 border-dashed border-gray-200 rounded-lg">
                        <p className="text-sm">Sprint Bucket is empty</p>
                        <p className="text-xs mt-1">Drag items here from the Backlog</p>
                    </div>
                )}
            </div>
        </div>
    );
};
