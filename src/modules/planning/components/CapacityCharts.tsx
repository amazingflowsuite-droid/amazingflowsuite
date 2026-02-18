import React, { useMemo } from 'react';
import { Settings, Code, CheckCircle2 } from 'lucide-react';
import { usePlanningStore } from '../store/usePlanningStore';

interface ChartProps {
    title: string;
    icon: React.ReactNode;
    percentage: number;
    current: number;
    total: number;
    trackColorClass: string;
}

const LinearChart = ({ title, icon, percentage, current, total, trackColorClass }: ChartProps) => {
    return (
        <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center text-sm font-semibold text-gray-700">
                <div className="flex items-center gap-2">
                    {icon}
                    <span>{title}</span>
                </div>
                <Settings className="w-3 h-3 text-gray-300 hover:text-gray-500 cursor-pointer" />
            </div>

            <div className="relative w-full h-4 bg-gray-100 rounded-full overflow-hidden">
                <div
                    className={`absolute top-0 left-0 h-full ${trackColorClass} transition-all duration-500 ease-out`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                >
                    {/* Optional stripe pattern can be added here via CSS if needed */}
                </div>
            </div>

            <div className="flex justify-end">
                <span className="text-xs font-medium text-gray-500">
                    {percentage.toFixed(0)}% <span className="mx-1 text-gray-300">|</span> {current.toFixed(1)}h / {total.toFixed(0)}h
                </span>
            </div>
        </div>
    );
};

export const CapacityCharts = () => {
    const { members, stories, settings } = usePlanningStore();

    const stats = useMemo(() => {
        let totalDevCapacity = 0;
        let totalQaCapacity = 0;
        let currentDevEffort = 0;
        let currentQaEffort = 0;

        // 1. Calculate Total Capacity
        members.forEach(member => {
            // Days available = Sprint Duration - Days Off
            // Effective days cannot be negative
            const daysAvailable = Math.max(0, settings.sprintDurationDays - member.daysOff);

            // Capacity = Days * Daily Hours * (Allocation %)
            const capacity = daysAvailable * member.dailyHours * (member.allocation / 100);

            if (member.roleType === 'Dev') {
                totalDevCapacity += capacity;
            } else if (member.roleType === 'QA') {
                totalQaCapacity += capacity;
            }
        });

        // 2. Calculate Current Effort (from Sprint Stories)
        const sprintStories = stories.filter(s => s.in_sprint);

        sprintStories.forEach(story => {
            story.subTasks.forEach(task => {
                const estimate = task.estimate || 0;
                if (task.category === 'Implementation') {
                    currentDevEffort += estimate;
                } else if (task.category === 'Test') {
                    currentQaEffort += estimate;
                }
            });
        });

        return {
            dev: {
                total: totalDevCapacity,
                current: currentDevEffort,
                percentage: totalDevCapacity > 0 ? (currentDevEffort / totalDevCapacity) * 100 : 0
            },
            qa: {
                total: totalQaCapacity,
                current: currentQaEffort,
                percentage: totalQaCapacity > 0 ? (currentQaEffort / totalQaCapacity) * 100 : 0
            }
        };
    }, [members, stories, settings]);

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 shrink-0 z-0 relative">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <LinearChart
                    title="Dev Capacity"
                    icon={<Code className="w-3 h-3 text-gray-400" />}
                    percentage={stats.dev.percentage}
                    current={stats.dev.current}
                    total={stats.dev.total}
                    trackColorClass="bg-emerald-500"
                />
                <LinearChart
                    title="QA Capacity"
                    icon={<CheckCircle2 className="w-3 h-3 text-gray-400" />}
                    percentage={stats.qa.percentage}
                    current={stats.qa.current}
                    total={stats.qa.total}
                    trackColorClass="bg-emerald-500 opacity-80"
                />
            </div>
        </div>
    );
};

