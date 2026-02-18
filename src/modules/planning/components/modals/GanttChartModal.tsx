import { usePlanningStore } from '../../store/usePlanningStore';
import { Calendar } from 'lucide-react';
import { clsx } from 'clsx';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

export const GanttChartModal = () => {
    const { stories, settings, members } = usePlanningStore();

    // Filter stories in sprint
    const sprintStories = stories.filter(s => s.in_sprint);

    // Determine Parallel Streams based on Team Composition
    const devMembers = members.filter(m => m.roleType === 'Dev');
    const qaMembers = members.filter(m => m.roleType === 'QA');

    // Fallback to 1 if no members defined to avoid division by zero/infinite loops (though UI enforces 1)
    const devCount = Math.max(devMembers.length, 1);
    const qaCount = Math.max(qaMembers.length, 1);

    type TimelineItem = {
        id: string;
        title: string;
        type: 'Dev' | 'QA';
        startHour: number;
        duration: number;
        storyTitle: string;
        laneIndex: number; // To visually separate concurrent tasks? For now just logically.
    };

    const timelineItems: TimelineItem[] = [];

    // Track when each "machine" (member) is free (in hours from start)
    // [0, 0, 0] means all 3 devs are free at hour 0.
    const devAvailability = new Array(devCount).fill(0);
    const qaAvailability = new Array(qaCount).fill(0);

    // Helper to find earliest free slot
    const getEarliestSlot = (availability: number[]) => {
        let minVal = Infinity;
        let index = -1;
        for (let i = 0; i < availability.length; i++) {
            if (availability[i] < minVal) {
                minVal = availability[i];
                index = i;
            }
        }
        return { index, time: minVal };
    };

    sprintStories.forEach(story => {
        const devTasks = story.subTasks.filter(t => t.category === 'Implementation');
        const qaTasks = story.subTasks.filter(t => t.category === 'Test');

        const storyDevDuration = devTasks.reduce((acc, t) => acc + t.estimate, 0);
        const storyQaDuration = qaTasks.reduce((acc, t) => acc + t.estimate, 0);

        let devEndTime = 0;

        // --- Schedule Development ---
        if (storyDevDuration > 0) {
            // Find earliest available Dev
            const { index: devIndex, time: startTime } = getEarliestSlot(devAvailability);

            timelineItems.push({
                id: `dev-${story.id}`,
                title: 'Development',
                type: 'Dev',
                startHour: startTime,
                duration: storyDevDuration,
                storyTitle: story.title,
                laneIndex: devIndex
            });

            // Update availability
            devEndTime = startTime + storyDevDuration;
            devAvailability[devIndex] = devEndTime;
        } else {
            // If no dev work, effectively "instant" or dependent on nothing? 
            // Let's assume it starts at 0 for dependency purposes if pure QA task?
            devEndTime = 0;
        }

        // --- Schedule QA ---
        if (storyQaDuration > 0) {
            // QA constrained by:
            // 1. Earliest available QA member
            // 2. Story Dev must be finished (devEndTime)

            const { index: qaIndex, time: availableTime } = getEarliestSlot(qaAvailability);

            const actualStart = Math.max(availableTime, devEndTime);

            timelineItems.push({
                id: `qa-${story.id}`,
                title: 'QA / Testing',
                type: 'QA',
                startHour: actualStart,
                duration: storyQaDuration,
                storyTitle: story.title,
                laneIndex: qaIndex + devCount // Offset index for visualization differentiation if needed
            });

            qaAvailability[qaIndex] = actualStart + storyQaDuration;
        }
    });

    const totalHours = Math.max(...devAvailability, ...qaAvailability);
    // Convert to days for display (assuming 8h day for simplicity in visualization scale)
    const pxPerHour = 20;

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="ghost" className="text-muted-foreground hover:text-primary gap-2">
                    <Calendar className="w-4 h-4" />
                    <span className="hidden md:inline">Timeline</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-7xl h-[80vh] flex flex-col p-0 gap-0 overflow-hidden">
                <DialogHeader className="p-6 border-b shrink-0">
                    <DialogTitle className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-primary" />
                        Delivery Forecast
                    </DialogTitle>
                    <p className="text-xs text-muted-foreground mt-1">
                        projected based on {settings.sprintDurationDays} days sprint ({settings.sprintDurationDays * 8}h capacity)
                    </p>
                </DialogHeader>

                <div className="p-4 border-b flex items-center justify-between bg-muted/20 shrink-0">
                    <div className="flex gap-4 text-xs">
                        <div className="flex items-center gap-1.5">
                            <div className="w-3 h-3 bg-blue-600 rounded"></div>
                            <span className="text-muted-foreground">Development</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-3 h-3 bg-emerald-500 rounded"></div>
                            <span className="text-muted-foreground">QA / Testing</span>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-auto p-6 bg-background relative min-h-0">
                    {/* Timeline Grid */}
                    <div className="relative min-w-[800px]">
                        {/* Hours Markers */}
                        <div className="absolute top-0 left-[250px] right-0 h-full pointer-events-none flex">
                            {Array.from({ length: Math.ceil(totalHours / 8) + 2 }).map((_, i) => (
                                <div key={i} className="flex-1 border-l border-border text-[10px] text-muted-foreground pl-1 pt-1">
                                    Day {i + 1}
                                </div>
                            ))}
                        </div>

                        <div className="space-y-6 relative z-10 pt-6">
                            {timelineItems.map(item => (
                                <div key={item.id} className="flex items-center group">
                                    <div className="w-[250px] shrink-0 pr-4">
                                        <div className="text-sm font-medium truncate" title={item.storyTitle}>
                                            {item.storyTitle}
                                        </div>
                                        <div className="text-xs text-muted-foreground">{item.title} • {item.duration}h</div>
                                    </div>
                                    <div className="grow relative h-8">
                                        <div
                                            className={clsx(
                                                "absolute top-0 h-6 rounded-md shadow-sm border border-border/50 flex items-center px-2 text-xs font-bold text-white whitespace-nowrap overflow-hidden transition-all hover:scale-105 hover:z-20 cursor-pointer",
                                                item.type === 'Dev' ? "bg-blue-600 hover:bg-blue-500" : "bg-emerald-600 hover:bg-emerald-500"
                                            )}
                                            style={{
                                                left: `${item.startHour * pxPerHour}px`,
                                                width: `${Math.max(item.duration * pxPerHour, 4)}px`
                                            }}
                                        >
                                            {item.duration}h
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {timelineItems.length === 0 && (
                                <div className="text-center text-muted-foreground py-12">
                                    No items in sprint to forecast.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
