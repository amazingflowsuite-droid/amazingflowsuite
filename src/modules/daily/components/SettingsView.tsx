import { Clock, Volume2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useDailyStore } from '../store/useDailyStore';

export const SettingsView = () => {
    // This would need extending the store to allow setting time limit, 
    // but for now we mocked speakerLimit as 120s in store state.
    const { speakerLimit, setSpeakerLimit, timeboxMode, setTimeboxMode, globalTimeLimit, members } = useDailyStore();

    const calculatedTime = timeboxMode === 'auto' && members.length > 0
        ? Math.floor(globalTimeLimit / members.length)
        : speakerLimit;

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <Card className="border-border/50 shadow-sm bg-card/50 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-primary" />
                        Time Configuration
                    </CardTitle>
                    <CardDescription>Manage your daily scrum duration.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Mode Selection */}
                    <div className="flex items-center justify-between p-4 border rounded-lg bg-card/40">
                        <div className="space-y-0.5">
                            <label className="text-base font-medium">Calculation Mode</label>
                            <div className="text-sm text-muted-foreground">
                                How should speaker time be determined?
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant={timeboxMode === 'manual' ? "default" : "outline"}
                                size="sm"
                                onClick={() => setTimeboxMode('manual')}
                            >
                                Manual
                            </Button>
                            <Button
                                variant={timeboxMode === 'auto' ? "default" : "outline"}
                                size="sm"
                                onClick={() => setTimeboxMode('auto')}
                            >
                                Auto (15m / Team)
                            </Button>
                        </div>
                    </div>

                    {/* Manual Timebox Input */}
                    {timeboxMode === 'manual' && (
                        <div className="flex items-center justify-between p-4 border rounded-lg bg-card/40">
                            <div className="space-y-0.5">
                                <label className="text-base font-medium">Speaker Timebox</label>
                                <div className="text-sm text-muted-foreground">
                                    Fixed duration per person in seconds.
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Input
                                    type="number"
                                    value={speakerLimit}
                                    onChange={(e) => setSpeakerLimit(Number(e.target.value))}
                                    className="w-24 text-center"
                                />
                                <span className="text-sm text-muted-foreground">sec</span>
                            </div>
                        </div>
                    )}

                    {/* Auto Timebox Display */}
                    {timeboxMode === 'auto' && (
                        <div className="flex items-center justify-between p-4 border rounded-lg bg-primary/5 border-primary/20">
                            <div className="space-y-0.5">
                                <label className="text-base font-medium text-primary">Auto-Calculated Timebox</label>
                                <div className="text-sm text-muted-foreground">
                                    Based on {Math.floor(globalTimeLimit / 60)}m Total / {members.length} Members.
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-2xl font-bold tabular-nums text-primary">{calculatedTime}</span>
                                <span className="text-sm text-muted-foreground">sec/person</span>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            <Card className="border-border/50 shadow-sm bg-card/50 backdrop-blur-sm opacity-50">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Volume2 className="h-5 w-5 text-primary" />
                        Sound & Feedback
                    </CardTitle>
                    <CardDescription>Comming soon...</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-sm">Enable Sounds</span>
                        <Button variant="outline" size="sm" disabled>Enabled</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
