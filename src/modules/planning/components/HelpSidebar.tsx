import { useState } from 'react';
import { usePlanningStore } from '../store/usePlanningStore';
import { X, ChevronDown, ChevronRight, BookOpen, Calculator, Layout, FileSpreadsheet, Save } from 'lucide-react';
import { clsx } from 'clsx';

type HelpSection = {
    id: string;
    title: string;
    icon: React.ReactNode;
    content: React.ReactNode;
};

export const HelpSidebar = () => {
    const { isHelpOpen, toggleHelp } = usePlanningStore();
    const [openSection, setOpenSection] = useState<string | null>('capacity');

    const sections: HelpSection[] = [
        {
            id: 'capacity',
            title: 'Team & Capacity',
            icon: <Calculator className="w-4 h-4 text-blue-400" />,
            content: (
                <div className="space-y-3 text-sm text-gray-300">
                    <p>
                        Manage your team's availability to calculate the <strong>Net Capacity</strong> for the sprint.
                    </p>
                    <ul className="list-disc pl-4 space-y-1 text-gray-400">
                        <li><strong>Allocation</strong>: % of time dedicated to this project.</li>
                        <li><strong>Days Off</strong>: Total hours of absence (vacation, holidays).</li>
                        <li><strong>Role Type</strong>: 'Dev' or 'QA'. Capacities are summed separately into the Buckets.</li>
                    </ul>
                    <div className="bg-white/5 p-2 rounded border border-white/5 text-xs">
                        <strong>Formula:</strong><br />
                        (Daily Hours × Allocation × Sprint Days) - Days Off - Rituals
                    </div>
                </div>
            )
        },
        {
            id: 'backlog',
            title: 'Backlog Management',
            icon: <Layout className="w-4 h-4 text-purple-400" />,
            content: (
                <div className="space-y-3 text-sm text-gray-300">
                    <p>
                        Import or create stories to build your product backlog.
                    </p>
                    <ul className="list-disc pl-4 space-y-1 text-gray-400">
                        <li><strong>Import</strong>: Use the "Import" button to paste issues from Jira. Format supported: <em>Key - Summary - ...</em></li>
                        <li><strong>Add Story</strong>: Type a name and press Enter to create a new User Story.</li>
                        <li><strong>Sub-tasks</strong>: Click a story card to expand it, then add sub-tasks (Dev/QA) with hour estimates.</li>
                    </ul>
                </div>
            )
        },
        {
            id: 'sprint',
            title: 'The Sprint Bucket',
            icon: <Layout className="w-4 h-4 text-green-400" />,
            content: (
                <div className="space-y-3 text-sm text-gray-300">
                    <p>
                        This is your planning "Tank". Visualize if your selected stories fit the team's capacity.
                    </p>
                    <ul className="list-disc pl-4 space-y-1 text-gray-400">
                        <li><strong>Add to Sprint</strong>: Click the "Add" button on any backlog story.</li>
                        <li><strong>Progress Bars</strong>: The Dev and QA bars fill up as you add tasks.
                            <br /><span className="text-green-400">Green</span> = Safe
                            <br /><span className="text-red-400">Red</span> = Overloaded
                        </li>
                    </ul>
                </div>
            )
        },
        {
            id: 'export',
            title: 'Reports & Export',
            icon: <FileSpreadsheet className="w-4 h-4 text-yellow-400" />,
            content: (
                <div className="space-y-3 text-sm text-gray-300">
                    <p>
                        Generate the necessary documentation for your rituals.
                    </p>
                    <ul className="list-disc pl-4 space-y-1 text-gray-400">
                        <li><strong>Planning Report</strong>: Summary of the sprint goal, capacity, and selected stories. Can be copied to clipboard.</li>
                        <li><strong>Excel Export</strong>: Generates a TSV raw format to copy-paste into Excel for automation scripts. Contains columns: Issue Type, Summary, Description (Blank), Estimate.</li>
                    </ul>
                </div>
            )
        },
        {
            id: 'safety',
            title: 'Data Safety',
            icon: <Save className="w-4 h-4 text-emerald-400" />,
            content: (
                <div className="space-y-3 text-sm text-gray-300">
                    <p>
                        Your work is safe!
                    </p>
                    <ul className="list-disc pl-4 space-y-1 text-gray-400">
                        <li><strong>Auto-Save</strong>: Everything is saved to your browser automatically.</li>
                        <li><strong>Offline</strong>: You can close the tab and reopen it later; the data will persist.</li>
                        <li><strong>Warning</strong>: If you try to refresh with unsaved items, the app will warn you.</li>
                    </ul>
                </div>
            )
        }
    ];

    return (
        <>
            {/* Backdrop */}
            {isHelpOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity"
                    onClick={toggleHelp}
                />
            )}

            {/* Sidebar */}
            <div
                className={clsx(
                    "fixed top-0 right-0 bottom-0 w-[400px] bg-[#0f172a] border-l border-white/10 shadow-2xl z-50 transition-transform duration-300 ease-in-out flex flex-col",
                    isHelpOpen ? "translate-x-0" : "translate-x-full"
                )}
            >
                <div className="p-4 border-b border-white/10 flex justify-between items-center bg-[#0f172a]">
                    <h2 className="text-lg font-bold flex items-center gap-2 text-white">
                        <BookOpen className="w-5 h-5 text-blue-400" />
                        Scrum Timekeeper Manual
                    </h2>
                    <button
                        onClick={toggleHelp}
                        className="p-1 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
                    {sections.map(section => (
                        <div key={section.id} className="border border-white/5 rounded-lg overflow-hidden bg-white/5">
                            <button
                                onClick={() => setOpenSection(openSection === section.id ? null : section.id)}
                                className="w-full flex items-center justify-between p-3 hover:bg-white/5 transition text-left"
                            >
                                <div className="flex items-center gap-2 font-medium text-slate-200">
                                    {section.icon}
                                    {section.title}
                                </div>
                                {openSection === section.id ? (
                                    <ChevronDown className="w-4 h-4 text-gray-400" />
                                ) : (
                                    <ChevronRight className="w-4 h-4 text-gray-400" />
                                )}
                            </button>

                            {openSection === section.id && (
                                <div className="p-3 pt-0 animate-in slide-in-from-top-1">
                                    <div className="pt-3 border-t border-white/5">
                                        {section.content}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}

                    <div className="mt-8 p-4 bg-blue-500/10 rounded-lg border border-blue-500/20 text-center">
                        <p className="text-xs text-blue-300 font-semibold mb-1">Need more help?</p>
                        <p className="text-xs text-blue-400/80">
                            Check the project documentation.
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};
