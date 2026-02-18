import { Link } from 'react-router-dom';
import { HelpCircle, ArrowLeft, LayoutDashboard } from 'lucide-react';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { usePlanningStore } from '../store/usePlanningStore';
import { BacklogInput } from '../components/BacklogInput';
import { SprintBucket } from '../components/SprintBucket';
import { SettingsModal } from '../components/modals/SettingsModal';
import { GanttChartModal } from '../components/modals/GanttChartModal';
import { PlanningReportModal } from '../components/modals/PlanningReportModal';
import { HelpSidebar } from '../components/HelpSidebar';
import { CapacityCharts } from '../components/CapacityCharts';

export const PlanningPage = () => {
    const { toggleHelp, fetchData } = usePlanningStore();

    // Fetch data on mount
    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return (
        <div className="h-screen flex flex-col bg-gray-50 font-sans text-gray-700 overflow-hidden relative">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 shrink-0 z-20">
                {/* Left: Brand Identity */}
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild className="text-gray-400 hover:text-gray-600 transition">
                        <Link to="/">
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                    </Button>
                    <div className="flex items-center gap-3">
                        {/* Logo Icon */}
                        <div className="bg-emerald-50 text-emerald-500 rounded-lg w-10 h-10 flex items-center justify-center text-xl">
                            <LayoutDashboard className="w-5 h-5" />
                        </div>
                        <div>
                            <h1 className="font-bold text-lg leading-tight text-emerald-600">Amazing Planning</h1>
                            <p className="text-sm text-gray-500 font-medium">Scrum Timekeeper</p>
                        </div>
                    </div>
                </div>

                {/* Right: Navigation Actions */}
                <div className="flex items-center gap-6">
                    <GanttChartModal />
                    <PlanningReportModal />

                    <div className="flex items-center gap-4 text-gray-400 border-l border-gray-200 pl-4 h-8">
                        <SettingsModal />
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={toggleHelp}
                            className="text-gray-400 hover:text-gray-600 transition"
                            title="Help & Manual"
                        >
                            <HelpCircle className="w-5 h-5" />
                        </Button>
                    </div>
                </div>
            </header>

            <main className="flex-1 flex overflow-hidden p-6 gap-6 bg-gray-100">
                {/* Left Panel: Backlog (35%) */}
                <div className="flex flex-col w-[35%] bg-white rounded-xl shadow-sm border border-gray-200 h-full overflow-hidden">
                    <BacklogInput />
                </div>

                {/* Right Panel: Charts & Sprint (65%) */}
                <div className="flex flex-col w-[65%] gap-6 h-full overflow-hidden">
                    {/* Top Row: Capacity Charts */}
                    <div>
                        <CapacityCharts />
                    </div>

                    {/* Bottom Row: Sprint Bucket */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col flex-1 overflow-hidden">
                        <SprintBucket />
                    </div>
                </div>
            </main>

            <HelpSidebar />
        </div>
    );
};
