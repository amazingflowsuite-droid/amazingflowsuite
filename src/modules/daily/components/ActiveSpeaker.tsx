import { Play, Pause, SkipForward, Maximize2, Minimize2 } from 'lucide-react';
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useDailyStore } from '../store/useDailyStore';
import { usePiP } from '@/hooks/usePiP';
import { createPortal } from 'react-dom';

export const ActiveSpeaker = () => {
    const { activeMemberId, members, secondsRemaining, status, pauseDaily, resumeDaily, nextSpeaker } = useDailyStore();
    const { requestPiP, closePiP, isActive, pipWindow } = usePiP();

    const activeMember = members.find(m => m.id === activeMemberId);

    if (!activeMemberId || !activeMember) {
        return (
            <Card className="h-full border-dashed border-2 flex items-center justify-center p-12 bg-card/30">
                <div className="text-center text-muted-foreground">
                    <p className="text-lg font-medium">Ready to start?</p>
                    <p className="text-sm">Click "Start Daily" above.</p>
                </div>
            </Card>
        );
    }

    // --- STANDARD DASHBOARD LAYOUT ---
    const SpeakerContentFull = (
        <div className="flex flex-col items-center justify-center space-y-8 py-8 h-full">
            {/* Timer Ring */}
            <div className="relative flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-8 border-muted opacity-20" />
                <div
                    className="rounded-full border-8 border-primary w-64 h-64 flex items-center justify-center transition-all duration-1000 relative"
                    style={{
                        borderColor: secondsRemaining < 10 ? 'hsl(var(--destructive))' : 'hsl(var(--primary))',
                        boxShadow: '0 0 40px -10px currentColor'
                    }}
                >
                    <div className="text-center space-y-1 z-10">
                        <div className="text-7xl font-bold tabular-nums tracking-tighter">
                            {Math.floor(secondsRemaining / 60)}:{(secondsRemaining % 60).toString().padStart(2, '0')}
                        </div>
                        <div className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Remaining</div>
                    </div>
                </div>
            </div>

            {/* Member Info */}
            <div className="text-center space-y-4">
                <Avatar className="h-24 w-24 mx-auto border-4 border-background shadow-xl ring-2 ring-primary/20">
                    <AvatarImage src={activeMember.avatar} />
                    <AvatarFallback className="text-2xl">{activeMember.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                    <h2 className="text-3xl font-bold">{activeMember.name}</h2>
                    <p className="text-lg text-muted-foreground">{activeMember.role}</p>
                </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4">
                {status === 'running' ? (
                    <Button size="lg" variant="outline" className="h-14 w-14 rounded-full border-2" onClick={pauseDaily}>
                        <Pause className="h-6 w-6" />
                    </Button>
                ) : (
                    <Button size="lg" className="h-14 w-14 rounded-full shadow-lg shadow-primary/30" onClick={resumeDaily}>
                        <Play className="h-6 w-6 ml-1" />
                    </Button>
                )}

                <Button size="lg" variant="secondary" className="h-14 px-8 rounded-full" onClick={nextSpeaker}>
                    <SkipForward className="mr-2 h-5 w-5" /> Next
                </Button>
            </div>
        </div>
    );

    // --- COMPACT PIP MINI-PLAYER LAYOUT ---
    const SpeakerContentMini = (
        <div className="flex flex-col h-full bg-background text-foreground p-4">
            {/* Top Bar: Progress & Time */}
            <div className="flex items-center justify-between mb-2">
                <div className={`text-4xl font-bold tabular-nums tracking-tighter ${secondsRemaining < 10 ? 'text-destructive' : 'text-primary'}`}>
                    {Math.floor(secondsRemaining / 60)}:{(secondsRemaining % 60).toString().padStart(2, '0')}
                </div>
                {/* Small status indicator */}
                <div className={`h-3 w-3 rounded-full ${status === 'running' ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`} />
            </div>

            {/* Speaker Info (Compact) */}
            <div className="flex items-center gap-3 mb-6 flex-1">
                <Avatar className="h-12 w-12 border-2 border-primary/20">
                    <AvatarImage src={activeMember.avatar} />
                    <AvatarFallback>{activeMember.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <div className="overflow-hidden">
                    <h3 className="text-lg font-bold truncate leading-tight">{activeMember.name}</h3>
                    <p className="text-xs text-muted-foreground truncate">{activeMember.role}</p>
                </div>
            </div>

            {/* Controls Footer */}
            <div className="grid grid-cols-2 gap-3 mt-auto">
                {status === 'running' ? (
                    <Button variant="outline" size="sm" onClick={pauseDaily} className="w-full">
                        <Pause className="mr-2 h-4 w-4" /> Pause
                    </Button>
                ) : (
                    <Button variant="default" size="sm" onClick={resumeDaily} className="w-full">
                        <Play className="mr-2 h-4 w-4" /> Resume
                    </Button>
                )}
                <Button variant="secondary" size="sm" onClick={nextSpeaker} className="w-full">
                    Next <SkipForward className="ml-2 h-4 w-4" />
                </Button>
            </div>
        </div>
    );

    return (
        <Card className="border-border/50 shadow-2xl bg-gradient-to-b from-card/50 to-background border-t-primary/20 h-full relative overflow-hidden">
            <div className="absolute top-4 right-4 z-20">
                <Button size="icon" variant="ghost" onClick={() => isActive ? closePiP() : requestPiP()}>
                    {isActive ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                </Button>
            </div>
            <CardContent className="h-full">
                {isActive && pipWindow
                    ? createPortal(
                        <div className="h-full w-full bg-background">
                            <style>{`
                            body { margin: 0; overflow: hidden; background: hsl(var(--background)); color: hsl(var(--foreground)); }
                        `}</style>
                            {SpeakerContentMini}
                        </div>,
                        pipWindow.document.body
                    )
                    : SpeakerContentFull
                }
                {isActive && (
                    <div className="h-full flex flex-col items-center justify-center text-muted-foreground space-y-4">
                        <Maximize2 className="h-12 w-12 opacity-20" />
                        <p className="text-sm font-medium">Timer is popped out in Mini Mode.</p>
                        <Button variant="outline" size="sm" onClick={closePiP}>
                            Return to Window
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
