import React, { useState, useEffect } from 'react';
import { usePlanningStore } from '../../store/usePlanningStore';
import { Calculator } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface PlanningPokerModalProps {
    isOpen: boolean;
    onClose: () => void;
    storyId: string;
    taskId: string;
    taskTitle: string;
    currentEstimate: number;
}

export const PlanningPokerModal: React.FC<PlanningPokerModalProps> = ({ isOpen, onClose, storyId, taskId, taskTitle }) => {
    const { members, updateSubTaskEstimate } = usePlanningStore();
    const [votes, setVotes] = useState<Record<string, string>>({});

    // Initialize votes empty
    useEffect(() => {
        if (isOpen) {
            setVotes({});
        }
    }, [isOpen]);

    const handleVote = (memberId: string, value: string) => {
        setVotes(prev => ({ ...prev, [memberId]: value }));
    };

    const calculateAverage = () => {
        const numericVotes = Object.values(votes).map(v => parseFloat(v)).filter(v => !isNaN(v));
        if (numericVotes.length === 0) return 0;
        const sum = numericVotes.reduce((a, b) => a + b, 0);
        return sum / numericVotes.length;
    };

    const applyEstimate = () => {
        const avg = calculateAverage();
        const rounded = Math.round(avg * 2) / 2;
        updateSubTaskEstimate(storyId, taskId, rounded);
        onClose();
    };

    const validVotesCount = Object.values(votes).filter(v => v !== '' && !isNaN(parseFloat(v))).length;
    const average = calculateAverage();

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Calculator className="w-5 h-5 text-purple-500" />
                        Planning Poker
                    </DialogTitle>
                    <DialogDescription>
                        Estimate effort for task: <span className="font-semibold text-foreground">{taskTitle}</span>
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4 space-y-3 max-h-[60vh] overflow-y-auto pr-1">
                    {members.map(member => (
                        <div key={member.id} className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
                            <div className="flex items-center gap-3">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={member.avatar} />
                                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-xs font-bold">
                                        {member.name.substring(0, 2).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <span className="text-sm font-medium">{member.name}</span>
                            </div>
                            <Input
                                type="number"
                                className="w-20 text-center font-mono"
                                placeholder="-"
                                step="0.5"
                                value={votes[member.id] || ''}
                                onChange={e => handleVote(member.id, e.target.value)}
                            />
                        </div>
                    ))}
                </div>

                <div className="flex items-center justify-between p-4 bg-primary/5 rounded-lg border border-primary/10 mb-2">
                    <span className="text-sm text-muted-foreground">Team Average:</span>
                    <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-primary">{average.toFixed(1)}h</span>
                        {validVotesCount > 0 && <span className="text-xs text-muted-foreground">({validVotesCount} votes)</span>}
                    </div>
                </div>

                <DialogFooter className="sm:justify-between gap-2">
                    <Button variant="ghost" onClick={onClose}>Cancel</Button>
                    <Button
                        onClick={applyEstimate}
                        disabled={validVotesCount === 0}
                        className="bg-purple-600 hover:bg-purple-700 text-white"
                    >
                        Apply Estimate
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
