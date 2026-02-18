import { useState, useMemo } from 'react';
import { usePlanningStore } from '../../store/usePlanningStore';
import { FileText, Copy, Check, AlertTriangle } from 'lucide-react';
import { clsx } from 'clsx';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";

export const PlanningReportModal = () => {
    const [copied, setCopied] = useState(false);
    const [activeTab, setActiveTab] = useState('report');

    // Toggles for Report Sections
    const [includeSummary, setIncludeSummary] = useState(true);
    const [includeDetails, setIncludeDetails] = useState(true);
    const [includeRisks, setIncludeRisks] = useState(true);

    const { stories, members, settings } = usePlanningStore();

    // --- Data Calculation Logic (Reused from other components) ---
    const sprintStories = useMemo(() =>
        stories.filter(s => s.in_sprint),
        [stories]
    );

    const calculateStoryPoints = (story: any) => {
        if (story.type === 'Task') return 0;
        const totalHours = story.subTasks.reduce((acc: number, t: any) => acc + (t.estimate || 0), 0);
        return totalHours;
    };

    const totalCommittedHours = useMemo(() =>
        sprintStories.reduce((acc, s) => acc + calculateStoryPoints(s), 0),
        [sprintStories]
    );

    const totalCapacity = useMemo(() => {
        const totalDev = members.filter(m => m.roleType === 'Dev').reduce((acc, m) => {
            const days = settings.sprintDurationDays - (m.daysOff / m.dailyHours);
            return acc + (days * m.dailyHours * (m.allocation / 100));
        }, 0);
        const totalQA = members.filter(m => m.roleType === 'QA').reduce((acc, m) => {
            const days = settings.sprintDurationDays - (m.daysOff / m.dailyHours);
            return acc + (days * m.dailyHours * (m.allocation / 100));
        }, 0);
        // Subtract rituals
        const netDev = totalDev - (settings.dailyScrumDuration + settings.planningDuration + settings.reviewDuration + settings.retroDuration + settings.refinementDuration);
        const netQA = totalQA - (settings.dailyScrumDuration + settings.planningDuration + settings.reviewDuration + settings.retroDuration + settings.refinementDuration);

        return Math.max(0, netDev + netQA); // Simplified total
    }, [members, settings]);

    // Risks Logic
    const overloadedMembers = useMemo(() => {
        return totalCommittedHours > totalCapacity ? [{ name: 'Team', allocation: (totalCommittedHours / totalCapacity) * 100 }] : [];
    }, [totalCommittedHours, totalCapacity]);


    // --- HTML Generation ---
    const generateHTML = () => {
        let html = `<div style="font-family: Arial, sans-serif; color: #333; max-width: 800px;">`;

        // Header
        html += `
            <h2 style="color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">
                🚀 Sprint Planning Report
            </h2>
            <p style="color: #666; font-size: 14px;">
                <strong>Generated:</strong> ${new Date().toLocaleDateString()} <br/>
                <strong>Sprint Duration:</strong> ${settings.sprintDurationDays} Days
            </p>
        `;

        // Summary Section
        if (includeSummary) {
            const percent = Math.round((totalCommittedHours / totalCapacity) * 100);
            const color = percent > 100 ? '#dc2626' : '#16a34a';

            html += `
                <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                    <h3 style="margin-top: 0;">📊 Capacity Summary</h3>
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <td style="padding: 8px; color: #64748b;">Total Capacity:</td>
                            <td style="padding: 8px; font-weight: bold;">${Math.round(totalCapacity)}h</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px; color: #64748b;">Committed Work:</td>
                            <td style="padding: 8px; font-weight: bold; color: ${color};">
                                ${Math.round(totalCommittedHours)}h (${percent}%)
                            </td>
                        </tr>
                    </table>
                </div>
            `;
        }

        // Risks Section
        if (includeRisks && overloadedMembers.length > 0) {
            html += `
                <div style="border: 1px solid #fca5a5; background-color: #fef2f2; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                    <h3 style="margin-top: 0; color: #dc2626;">⚠️ Risks & Alerts</h3>
                    <ul style="margin: 0; padding-left: 20px; color: #b91c1c;">
                        ${overloadedMembers.map(m => `<li><strong>${m.name}</strong> is overloaded (${Math.round(m.allocation)}% of capacity).</li>`).join('')}
                    </ul>
                </div>
            `;
        }

        // Details Section (Backlog)
        if (includeDetails) {
            html += `
                <h3 style="margin-bottom: 10px;">📝 Committed Items</h3>
                <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                    <thead style="background-color: #e2e8f0;">
                        <tr>
                            <th style="padding: 10px; text-align: left; border: 1px solid #cbd5e1;">Type</th>
                            <th style="padding: 10px; text-align: left; border: 1px solid #cbd5e1;">Title</th>
                            <th style="padding: 10px; text-align: center; border: 1px solid #cbd5e1;">Est (h)</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${sprintStories.map(story => `
                            <tr>
                                <td style="padding: 8px; border: 1px solid #e2e8f0; width: 100px;">
                                    <span style="
                                        display: inline-block; 
                                        padding: 2px 6px; 
                                        border-radius: 4px; 
                                        font-size: 11px; 
                                        background-color: ${story.type === 'Bug' ? '#fee2e2' : '#dbeafe'}; 
                                        color: ${story.type === 'Bug' ? '#991b1b' : '#1e40af'};
                                    ">
                                        ${story.type}
                                    </span>
                                </td>
                                <td style="padding: 8px; border: 1px solid #e2e8f0;">
                                    <strong>${story.title}</strong>
                                    ${story.subTasks.length > 0 ? `
                                        <ul style="margin: 5px 0 0 0; padding-left: 15px; font-size: 12px; color: #64748b;">
                                            ${story.subTasks.map(t => `<li>${t.title} (${t.estimate}h)</li>`).join('')}
                                        </ul>
                                    ` : ''}
                                </td>
                                <td style="padding: 8px; border: 1px solid #e2e8f0; text-align: center;">
                                    ${calculateStoryPoints(story)}
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;
        }

        html += `</div>`;
        return html;
    };

    // --- Excel (TSV) Generation ---
    const generateTSV = useMemo(() => {
        let tsv = `Issue Type\tSummary\tDescription\tEstimativa\n`;

        sprintStories.forEach(story => {
            // Story Row
            const storyPoints = calculateStoryPoints(story);
            tsv += `${story.type}\t${story.title}\t\t${storyPoints}\n`;

            // Subtasks Rows
            story.subTasks.forEach(task => {
                const subType = task.category === 'Test' ? 'Sub-Test' : 'Sub-Imp';
                tsv += `${subType}\t${task.title}\t\t${task.estimate}\n`;
            });
        });

        return tsv;
    }, [sprintStories]);

    const handleCopy = () => {
        let content = '';
        let htmlBlob = null;

        if (activeTab === 'report') {
            content = generateHTML();
            htmlBlob = new Blob([content], { type: 'text/html' });
        } else {
            content = generateTSV;
        }

        const textBlob = new Blob([content], { type: 'text/plain' });

        const clipboardData: Record<string, Blob> = {
            'text/plain': textBlob
        };

        if (htmlBlob) {
            clipboardData['text/html'] = htmlBlob;
        }

        navigator.clipboard.write([new ClipboardItem(clipboardData)]).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    const tsvPreview = generateTSV;

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="h-7 text-xs gap-2 border border-border/10">
                    <FileText className="w-3.5 h-3.5" />
                    Report
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[90vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-blue-500" />
                        Planning Report
                    </DialogTitle>
                </DialogHeader>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="report">HTML Report</TabsTrigger>
                        <TabsTrigger value="excel">Excel Data</TabsTrigger>
                    </TabsList>

                    <div className="flex-1 overflow-y-auto mt-4 min-h-0">
                        <TabsContent value="report" className="mt-0 space-y-4">
                            <p className="text-sm text-muted-foreground">
                                Select sections to include in the email report:
                            </p>
                            <div className="grid gap-4">
                                <div className="flex items-start space-x-3 p-3 rounded-lg border bg-card">
                                    <Checkbox id="summary" checked={includeSummary} onCheckedChange={(c: boolean | 'indeterminate') => setIncludeSummary(!!c)} />
                                    <div className="grid gap-1.5 leading-none">
                                        <Label htmlFor="summary" className="font-medium cursor-pointer">Capacity Summary</Label>
                                        <p className="text-xs text-muted-foreground">Total hours, usage percentage</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3 p-3 rounded-lg border bg-card">
                                    <Checkbox id="risks" checked={includeRisks} onCheckedChange={(c: boolean | 'indeterminate') => setIncludeRisks(!!c)} />
                                    <div className="grid gap-1.5 leading-none">
                                        <Label htmlFor="risks" className="font-medium cursor-pointer flex items-center gap-2">
                                            Risks & Alerts <AlertTriangle className="w-3 h-3 text-destructive" />
                                        </Label>
                                        <p className="text-xs text-muted-foreground">Overloaded members, missing estimates</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3 p-3 rounded-lg border bg-card">
                                    <Checkbox id="details" checked={includeDetails} onCheckedChange={(c: boolean | 'indeterminate') => setIncludeDetails(!!c)} />
                                    <div className="grid gap-1.5 leading-none">
                                        <Label htmlFor="details" className="font-medium cursor-pointer">Committed Items</Label>
                                        <p className="text-xs text-muted-foreground">Full list of stories and sub-tasks</p>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>
                        <TabsContent value="excel" className="mt-0 h-full flex flex-col">
                            <p className="text-sm text-muted-foreground mb-2">
                                Raw TSV data for Excel Automation:
                            </p>
                            <Textarea
                                readOnly
                                value={tsvPreview}
                                className="font-mono text-xs h-[250px] resize-none"
                            />
                            <p className="text-xs text-muted-foreground mt-2 italic">
                                Tip: Press Copy below and map directly to your Excel template.
                            </p>
                        </TabsContent>
                    </div>
                </Tabs>

                <div className="pt-4 flex justify-end">
                    <Button
                        onClick={handleCopy}
                        className={clsx("w-full transition-all", copied && "bg-green-600 hover:bg-green-500")}
                    >
                        {copied ? (
                            <>Copied to Clipboard! <Check className="w-4 h-4 ml-2" /></>
                        ) : (
                            <>
                                {activeTab === 'report' ? 'Copy HTML Report' : 'Copy Excel Data'}
                                <Copy className="w-4 h-4 ml-2" />
                            </>
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};
