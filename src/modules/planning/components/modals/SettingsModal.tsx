import { useState } from 'react';
import { usePlanningStore } from '../../store/usePlanningStore';
import type { SprintSettings, RoleType } from '../../store/usePlanningStore';
import { calculateMemberCapacity } from '../../utils/capacity';
import { Settings, Users, Calendar, Plus, Trash2, User, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export const SettingsModal = () => {
    const { settings, updateSettings, members, addMember, updateMember, removeMember, migrateFromLocal } = usePlanningStore();
    const [open, setOpen] = useState(false);
    const [localSettings, setLocalSettings] = useState<SprintSettings>(settings);
    const [newItem, setNewItem] = useState({ name: '', role: 'Dev', roleType: 'Dev' as RoleType, allocation: 100, daysOff: 0, dailyHours: 8 });

    const handleOpenChange = (val: boolean) => {
        setOpen(val);
        if (val) {
            setLocalSettings(settings); // Sync on open
        }
    };

    const handleSave = () => {
        updateSettings(localSettings);
        setOpen(false);
    };

    const handleMigrate = async () => {
        const raw = localStorage.getItem('amazing-planning-storage');
        if (!raw) {
            alert('No local data found in browser storage.');
            return;
        }

        try {
            const parsed = JSON.parse(raw);
            if (parsed && parsed.state) {
                if (confirm('This will attempt to merge your local data (Stories, Members, Settings) into the database. Continue?')) {
                    await migrateFromLocal(parsed.state);
                    alert('Migration started. Please check the board.');
                    setOpen(false);
                }
            }
        } catch (e) {
            console.error(e);
            alert('Failed to parse local data.');
        }
    };

    const handleAddMember = () => {
        if (newItem.name) {
            addMember(newItem);
            setNewItem({ name: '', role: 'Dev', roleType: 'Dev', allocation: 100, daysOff: 0, dailyHours: 8 });
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary" title="Sprint Configuration">
                    <Settings className="w-5 h-5" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px] max-h-[80vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>Sprint Context</DialogTitle>
                    <DialogDescription>
                        Configure your sprint rules and team capacity.
                    </DialogDescription>
                </DialogHeader>

                <Tabs defaultValue="team" className="flex-1 flex flex-col min-h-0">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="team" className="flex items-center gap-2">
                            <Users className="w-4 h-4" /> Team & Capacity
                        </TabsTrigger>
                        <TabsTrigger value="settings" className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" /> Rituals & Duration
                        </TabsTrigger>
                        <TabsTrigger value="data" className="flex items-center gap-2">
                            <Database className="w-4 h-4" /> Data & Sync
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="team" className="flex-1 flex flex-col min-h-0 space-y-4 pt-4">
                        <div className="flex-1 overflow-y-auto pr-2 space-y-3 min-h-0 p-1">
                            {members.map(member => {
                                const { availableCapacity } = calculateMemberCapacity(member, settings);
                                const isQA = member.roleType === 'QA';

                                return (
                                    <div key={member.id} className="p-3 rounded-lg border border-border bg-muted/50 hover:bg-muted/80 transition group relative">
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2 rounded-full ${isQA ? 'bg-emerald-500/10 text-emerald-500' : 'bg-blue-500/10 text-blue-500'}`}>
                                                    <User className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-sm">{member.name}</div>
                                                    <div className="flex gap-2 items-center mt-0.5">
                                                        <Badge variant={isQA ? "secondary" : "default"} className="text-[10px] px-1.5 h-5 font-normal">
                                                            {member.roleType}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => removeMember(member.id)}
                                                className="h-8 w-8 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity absolute top-2 right-2"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3 mb-3">
                                            <div className="space-y-1">
                                                <Label className="text-[10px] text-muted-foreground uppercase tracking-wider">Allocation %</Label>
                                                <Input
                                                    type="number"
                                                    className="h-8 text-xs font-mono"
                                                    value={member.allocation}
                                                    onChange={e => updateMember(member.id, { allocation: Number(e.target.value) })}
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <Label className="text-[10px] text-muted-foreground uppercase tracking-wider">Days Off (h)</Label>
                                                <Input
                                                    type="number"
                                                    className="h-8 text-xs font-mono"
                                                    value={member.daysOff}
                                                    onChange={e => updateMember(member.id, { daysOff: Number(e.target.value) })}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-1">
                                            <Label className="text-[10px] text-muted-foreground uppercase tracking-wider">Role Type</Label>
                                            <Select
                                                value={member.roleType}
                                                onValueChange={(val: RoleType) => updateMember(member.id, { roleType: val })}
                                            >
                                                <SelectTrigger className="h-8 text-xs">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Dev">Dev</SelectItem>
                                                    <SelectItem value="QA">QA</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <Separator className="my-3" />

                                        <div className="flex justify-between items-center">
                                            <span className="text-xs text-muted-foreground">Net Capacity</span>
                                            <span className="text-sm font-bold text-primary">{availableCapacity.toFixed(1)}h</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="flex gap-2 w-full pt-2 border-t">
                            <Input
                                className="h-9 flex-1"
                                placeholder="New Member Name"
                                value={newItem.name}
                                onChange={e => setNewItem({ ...newItem, name: e.target.value })}
                                onKeyDown={e => e.key === 'Enter' && handleAddMember()}
                            />
                            <Select
                                value={newItem.roleType}
                                onValueChange={(val: RoleType) => setNewItem({ ...newItem, roleType: val, role: val })}
                            >
                                <SelectTrigger className="w-[100px] h-9">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Dev">Dev</SelectItem>
                                    <SelectItem value="QA">QA</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button onClick={handleAddMember} disabled={!newItem.name}>
                                <Plus className="w-4 h-4" />
                            </Button>
                        </div>
                    </TabsContent>

                    <TabsContent value="settings" className="space-y-4 pt-4">
                        {/* ... Existing Settings ... */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="sprintDuration">Sprint Duration (Days)</Label>
                                <Input
                                    id="sprintDuration"
                                    type="number"
                                    value={localSettings.sprintDurationDays}
                                    onChange={e => setLocalSettings({ ...localSettings, sprintDurationDays: Number(e.target.value) })}
                                />
                                <p className="text-[10px] text-muted-foreground">e.g. 10 for 2 weeks</p>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="dailyScrum">Daily Scrum (Hours)</Label>
                                <Input
                                    id="dailyScrum"
                                    type="number"
                                    step="0.1"
                                    value={localSettings.dailyScrumDuration}
                                    onChange={e => setLocalSettings({ ...localSettings, dailyScrumDuration: Number(e.target.value) })}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="planning">Planning (Hours)</Label>
                                <Input
                                    id="planning"
                                    type="number"
                                    value={localSettings.planningDuration}
                                    onChange={e => setLocalSettings({ ...localSettings, planningDuration: Number(e.target.value) })}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="review">Review (Hours)</Label>
                                <Input
                                    id="review"
                                    type="number"
                                    value={localSettings.reviewDuration}
                                    onChange={e => setLocalSettings({ ...localSettings, reviewDuration: Number(e.target.value) })}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="retro">Retro (Hours)</Label>
                                <Input
                                    id="retro"
                                    type="number"
                                    value={localSettings.retroDuration}
                                    onChange={e => setLocalSettings({ ...localSettings, retroDuration: Number(e.target.value) })}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="refinement">Refinement (Hours)</Label>
                                <Input
                                    id="refinement"
                                    type="number"
                                    value={localSettings.refinementDuration}
                                    onChange={e => setLocalSettings({ ...localSettings, refinementDuration: Number(e.target.value) })}
                                />
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="other">Other Rituals / Buffer (Hours)</Label>
                            <Input
                                id="other"
                                type="number"
                                value={localSettings.otherRitualsDuration}
                                onChange={e => setLocalSettings({ ...localSettings, otherRitualsDuration: Number(e.target.value) })}
                            />
                        </div>
                        <DialogFooter className="mt-4">
                            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                            <Button onClick={handleSave}>Save changes</Button>
                        </DialogFooter>
                    </TabsContent>

                    <TabsContent value="data" className="space-y-4 pt-4">
                        <div className="p-4 border rounded-lg bg-yellow-500/5 border-yellow-500/20">
                            <h3 className="font-semibold flex items-center gap-2 text-yellow-500">
                                <Database className="w-4 h-4" />
                                Legacy Data Migration
                            </h3>
                            <p className="text-sm text-muted-foreground mt-1 mb-4">
                                If you have data stored in your browser from the previous version, you can attempt to migrate it to the Cloud Database.
                            </p>
                            <Button onClick={handleMigrate} variant="secondary" className="w-full">
                                Restore from Local Storage
                            </Button>
                        </div>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
};
