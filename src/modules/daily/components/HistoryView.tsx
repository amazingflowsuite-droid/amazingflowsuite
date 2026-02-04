import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useDailyStore } from '../store/useDailyStore';
import { History as HistoryIcon, Clock, Users } from 'lucide-react';

export const HistoryView = () => {
    const { history } = useDailyStore();

    const formatTime = (seconds: number) => {
        const min = Math.floor(seconds / 60);
        const sec = seconds % 60;
        return `${min}m ${sec}s`;
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleString();
    };

    return (
        <div className="space-y-6">
            <Card className="border-border/50 shadow-sm bg-card/50 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <HistoryIcon className="h-5 w-5 text-primary" />
                        Daily History
                    </CardTitle>
                    <CardDescription>
                        Record of past daily scrums.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {history.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                            No meetings recorded yet. Complete a daily to see it here.
                        </div>
                    ) : (
                        <div className="rounded-md border">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b bg-muted/50 transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Date</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Duration</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Team Size</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {history.map((entry) => (
                                        <tr key={entry.id} className="border-b transition-colors hover:bg-muted/50">
                                            <td className="p-4 align-middle">{formatDate(entry.date)}</td>
                                            <td className="p-4 align-middle font-mono">
                                                <div className="flex items-center gap-2">
                                                    <Clock className="w-3 h-3 text-muted-foreground" />
                                                    {formatTime(entry.duration)}
                                                </div>
                                            </td>
                                            <td className="p-4 align-middle">
                                                <div className="flex items-center gap-2">
                                                    <Users className="w-3 h-3 text-muted-foreground" />
                                                    {entry.teamSize} Members
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};
