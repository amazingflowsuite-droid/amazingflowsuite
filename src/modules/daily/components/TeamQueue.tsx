import React from 'react';
import { Users, GripVertical } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useDailyStore } from '../store/useDailyStore';
import { cn } from '@/lib/utils';

export const TeamQueue = () => {
    const { queue, members, activeMemberId } = useDailyStore();

    // Filter out those who are already done (not in queue or active) if we wanted to show history,
    // but for "Queue" usually implies upcoming.
    // However, the store simply moves the active index.
    // Let's verify store logic: `activeMemberId` updates. `queue` stays static? 
    // Store implementation: `nextSpeaker` moves `activeMemberId` by index. Queue is static list of IDs.

    const currentIndex = queue.indexOf(activeMemberId || '');

    // Show upcoming speakers
    const upcomingQueueIds = activeMemberId
        ? queue.slice(currentIndex + 1)
        : queue;

    return (
        <Card className="h-full border-border/50 shadow-sm bg-card/50 backdrop-blur-sm flex flex-col">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    Up Next
                </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 space-y-2 overflow-auto custom-scrollbar">
                {upcomingQueueIds.length === 0 ? (
                    <div className="text-center text-muted-foreground py-8 text-sm">
                        {activeMemberId ? "No more speakers in queue." : "Queue is empty."}
                    </div>
                ) : (
                    upcomingQueueIds.map((memberId, index) => {
                        const member = members.find(m => m.id === memberId);
                        if (!member) return null;

                        return (
                            <div key={memberId} className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors border border-transparent hover:border-border/50 cursor-pointer group bg-card/40">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                    {currentIndex + 1 + index + 1}
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium leading-none">{member.name}</p>
                                    <p className="text-xs text-muted-foreground">{member.role}</p>
                                </div>
                                <GripVertical className="h-4 w-4 text-muted-foreground/30 opacity-0 group-hover:opacity-100 cursor-grab" />
                            </div>
                        );
                    })
                )}
            </CardContent>
        </Card>
    );
};
