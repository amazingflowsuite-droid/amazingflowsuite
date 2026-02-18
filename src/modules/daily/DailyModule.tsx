import { useState, useEffect } from 'react';
import {
    LayoutDashboard,
    Users,
    Clock,
    Settings,
    PlayCircle,
    RotateCcw
} from 'lucide-react';
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ActiveSpeaker } from './components/ActiveSpeaker';
import { TeamQueue } from './components/TeamQueue';
import { TeamView } from './components/TeamView';
import { HistoryView } from './components/HistoryView';
import { SettingsView } from './components/SettingsView';
import { AudioController } from './components/AudioController';
import { useDailyStore } from './store/useDailyStore';

export const DailyModule = () => {
    const [isSidebarOpen] = useState(true);
    const { startDaily, status, resetDaily, currentView, setCurrentView, tick, globalSecondsRemaining } = useDailyStore();

    // Load Data
    useEffect(() => {
        const { fetchData, subscribeToChanges, unsubscribe } = useDailyStore.getState();
        fetchData();
        subscribeToChanges();
        return () => unsubscribe();
    }, []);

    // Global Timer Loop
    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        if (status === 'running') {
            interval = setInterval(() => {
                tick();
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [status, tick]);

    const renderContent = () => {
        switch (currentView) {
            case 'team':
                return <TeamView />;
            case 'history':
                return <HistoryView />;
            case 'settings':
                return <SettingsView />;
            case 'dashboard':
            default:
                return (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
                        <div className="lg:col-span-2 space-y-6">
                            <ActiveSpeaker />
                        </div>
                        <div className="space-y-6">
                            <TeamQueue />
                        </div>
                    </div>
                );
        }
    };

    const getPageTitle = () => {
        switch (currentView) {
            case 'team': return 'Team Management';
            case 'settings': return 'Settings';
            case 'history': return 'History';
            default: return 'Daily Scrum';
        }
    };

    return (
        <div className="min-h-screen bg-background flex text-foreground font-sans">
            <AudioController />
            {/* Sidebar */}
            <aside className={`w-64 border-r border-border bg-card/50 flex-col ${isSidebarOpen ? 'flex' : 'hidden'} md:flex transition-all duration-300`}>
                <div className="h-16 flex items-center px-6 border-b border-border">
                    <div className="rounded-full bg-primary/20 p-2 mr-3">
                        <div className="w-4 h-4 rounded-full bg-primary animate-pulse" />
                    </div>
                    <span className="font-bold text-lg tracking-tight">Amazing Daily</span>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <Button
                        variant={currentView === 'dashboard' ? "secondary" : "ghost"}
                        className="w-full justify-start font-medium"
                        onClick={() => setCurrentView('dashboard')}
                    >
                        <LayoutDashboard className="mr-2 h-4 w-4" /> Daily Board
                    </Button>
                    <Button
                        variant={currentView === 'team' ? "secondary" : "ghost"}
                        className="w-full justify-start font-medium"
                        onClick={() => setCurrentView('team')}
                    >
                        <Users className="mr-2 h-4 w-4" /> Team
                    </Button>
                    <Button
                        variant={currentView === 'history' ? "secondary" : "ghost"}
                        className="w-full justify-start font-medium"
                        onClick={() => setCurrentView('history')}
                    >
                        <Clock className="mr-2 h-4 w-4" /> History
                    </Button>
                    <Button
                        variant={currentView === 'settings' ? "secondary" : "ghost"}
                        className="w-full justify-start font-medium"
                        onClick={() => setCurrentView('settings')}
                    >
                        <Settings className="mr-2 h-4 w-4" /> Settings
                    </Button>
                </nav>

                <div className="p-4 border-t border-border">
                    <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 border border-border">
                            <AvatarImage src="https://github.com/shadcn.png" />
                            <AvatarFallback>AD</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                            <span className="text-sm font-medium">Admin User</span>
                            <span className="text-xs text-muted-foreground">admin@amazing.flow</span>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="h-16 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex items-center justify-between px-6 sticky top-0 z-50">
                    <div className="flex items-center gap-4">
                        <h1 className="text-xl font-semibold tracking-tight">{getPageTitle()}</h1>
                        {status !== 'idle' && (
                            <div className="flex items-center gap-2 px-3 py-1 bg-accent/50 rounded-full border border-border/50">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <span className="font-mono font-medium">
                                    {Math.floor(globalSecondsRemaining / 60).toString().padStart(2, '0')}:
                                    {(globalSecondsRemaining % 60).toString().padStart(2, '0')}
                                </span>
                                <span className="text-xs text-muted-foreground ml-1">/ 15:00</span>
                            </div>
                        )}
                    </div>
                    <div className="flex items-center gap-4">
                        {currentView === 'dashboard' && (
                            status === 'idle' || status === 'finished' ? (
                                <Button variant="default" size="sm" onClick={startDaily} className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg shadow-primary/20">
                                    <PlayCircle className="mr-2 h-4 w-4" /> Start Daily
                                </Button>
                            ) : (
                                <Button variant="ghost" size="sm" onClick={resetDaily} className="text-muted-foreground hover:text-destructive">
                                    <RotateCcw className="mr-2 h-4 w-4" /> Reset
                                </Button>
                            )
                        )}
                    </div>
                </header>

                {/* Content Area */}
                <div className="flex-1 overflow-auto p-6 lg:p-10">
                    {renderContent()}
                </div>
            </main>
        </div>
    );
};
