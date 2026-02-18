import { useState } from 'react';
import { usePlanningStore } from '../../store/usePlanningStore';
import { Upload, ArrowRight, Check } from 'lucide-react';
import { clsx } from 'clsx';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

type ColumnMapping = 'Ignore' | 'ID' | 'Title' | 'Type' | 'Estimate' | 'Description' | 'Parent ID' | 'Status';

export const ImportModal = ({ children }: { children?: React.ReactNode }) => {
    const { importStories } = usePlanningStore();
    const [open, setOpen] = useState(false);
    const [step, setStep] = useState<'paste' | 'map'>('paste');
    const [rawText, setRawText] = useState('');
    const [parsedData, setParsedData] = useState<string[][]>([]);
    const [headerMapping, setHeaderMapping] = useState<ColumnMapping[]>([]);

    const handleParse = () => {
        // ... function content remains same, just ensuring correct scope ...
        // Note: for replace_file_content, I need to be careful not to cut off the function body if I don't provide it all.
        // Actually, I should just replace the signature and the return statement part.
        // But replacing multiple parts with one call requires multi_replace.
        // I will use multi_replace for safety.

        if (!rawText.trim()) return;

        // Robust CSV Parser (Handle quotes and newlines)
        const parseCSV = (text: string): string[][] => {
            const rows: string[][] = [];
            let currentRow: string[] = [];
            let currentCell = '';
            let insideQuotes = false;

            // Auto-detect delimiter
            const firstLine = text.split('\n')[0];
            let delimiter = '\t';
            if (firstLine.includes('\t')) delimiter = '\t';
            else if (firstLine.includes(';')) delimiter = ';';
            else if (firstLine.includes(',')) delimiter = ',';

            for (let i = 0; i < text.length; i++) {
                const char = text[i];
                const nextChar = text[i + 1];

                if (char === '"') {
                    if (insideQuotes && nextChar === '"') {
                        currentCell += '"'; // Escaped quote
                        i++;
                    } else {
                        insideQuotes = !insideQuotes;
                    }
                } else if (char === delimiter && !insideQuotes) {
                    // Push cell, strip quotes
                    currentRow.push(currentCell.trim().replace(/^"|"$/g, ''));
                    currentCell = '';
                } else if ((char === '\n' || char === '\r') && !insideQuotes) {
                    if (char === '\r' && nextChar === '\n') i++; // Handle CRLF
                    currentRow.push(currentCell.trim().replace(/^"|"$/g, ''));
                    if (currentRow.some(c => c)) rows.push(currentRow); // Skip empty rows
                    currentRow = [];
                    currentCell = '';
                } else {
                    currentCell += char;
                }
            }
            // Push last cell/row
            if (currentCell || currentRow.length > 0) {
                currentRow.push(currentCell.trim().replace(/^"|"$/g, ''));
                if (currentRow.some(c => c)) rows.push(currentRow);
            }
            return rows;
        };

        const rows = parseCSV(rawText);

        // Initial Mapping Guess
        const initialMapping: ColumnMapping[] = rows[0]?.map((val, idx) => {
            const v = val.toLowerCase();
            if (v === 'key' || v === 'issue key' || v === 'id') return 'ID';
            if (v.includes('summary') || v.includes('título') || v.includes('title') || v.includes('nome')) return 'Title';
            if (v.includes('type') || v.includes('tipo')) return 'Type';
            if (v.includes('story points') || v.includes('estimate') || v.includes('pontos') || v.includes('estimativa')) return 'Estimate';
            if (v.includes('description') || v.includes('descrição')) return 'Description';
            if (v.includes('parent') || v.includes('pai')) return 'Parent ID';
            if (v.includes('status') || v.includes('estado') || v.includes('situação') || v.includes('situacao')) return 'Status';

            // Fallback for common column positions if no header match
            if (idx === 0) return 'ID'; // Often ID
            if (idx === 1) return 'Title';
            return 'Ignore';
        }) || [];

        setParsedData(rows);
        setHeaderMapping(initialMapping);
        setStep('map');
    };

    const handleImport = () => {
        const storiesToImport: any[] = []; // Using any temporarily to construct nested objects before casting
        const storyMap = new Map<string, any>(); // Map ID or Title -> Story Object
        let lastStory: any = null; // For sequential fallback

        const hasParentIdColumn = headerMapping.includes('Parent ID');

        parsedData.forEach((row, rowIndex) => {
            // Extract Row Data
            let id = '';
            let title = '';
            let type: any = 'User Story'; // Default
            let estimate = 0;
            let parentId = '';
            let status = '';

            headerMapping.forEach((map, colIndex) => {
                const val = row[colIndex] || '';
                if (map === 'ID') id = val;
                if (map === 'Title') title = val;
                if (map === 'Parent ID') parentId = val;
                if (map === 'Status') status = val;
                if (map === 'Type') {
                    const lowerVal = val.toLowerCase();
                    if (lowerVal.includes('bug')) type = 'Bug';
                    else if (
                        lowerVal.includes('task') ||
                        lowerVal.includes('sub-task') ||
                        lowerVal.includes('subtask') ||
                        lowerVal.startsWith('sub') ||
                        lowerVal.includes('sub-')
                    ) type = 'Task';
                    else type = 'User Story';
                }
                if (map === 'Estimate') {
                    const num = parseFloat(val.replace(',', '.'));
                    if (!isNaN(num)) estimate = num;
                }
            });

            if (!title) return; // Skip rows without title

            // FILTER: Skip Cancelled Items
            if (status.trim().toLowerCase() === 'cancelado') {
                return;
            }

            // Skip header row heuristic
            // Only skip if estimate is NaN AND title includes specific keywords or is generic
            if (rowIndex === 0 && isNaN(parseFloat(row[headerMapping.indexOf('Estimate')] || '0')) && estimate === 0) {
                const lowerTitle = title.toLowerCase();
                if (lowerTitle === 'title' || lowerTitle === 'summary' || lowerTitle === 'título' || lowerTitle.includes('column')) {
                    return;
                }
            }

            // --- LOGIC ---

            // Detect if this is a Sub-task
            const isSubTaskByType = type === 'Task';

            // Determine Category based on raw row data (not the normalized 'type')
            // We need to look at the raw 'Type' column again to decide if it's Test or Imp
            let calculatedCategory: 'Implementation' | 'Test' = 'Implementation';
            const typeColIndex = headerMapping.indexOf('Type');
            if (typeColIndex !== -1) {
                const rawType = (row[typeColIndex] || '').toLowerCase();
                if (rawType.includes('test') || rawType.includes('qa') || rawType.includes('homolog')) {
                    calculatedCategory = 'Test';
                }
            }

            // Strategy 1: Explicit Parent ID
            if (hasParentIdColumn && parentId) {
                const parent = storyMap.get(parentId);
                if (parent) {
                    parent.subTasks.push({
                        title: title,
                        estimate: estimate,
                        category: calculatedCategory
                    });
                    return; // It's a match, done.
                }
            }

            // Strategy 2: Sequential (Cascata)
            // If NO Explicit Parent ID was used (or column doesn't exist) AND it is a Sub-task type
            if ((!hasParentIdColumn || !parentId) && isSubTaskByType && lastStory) {
                lastStory.subTasks.push({
                    title: title,
                    estimate: estimate,
                    category: calculatedCategory
                });
                return;
            }

            // If neither, it's a new Story
            const newStory = {
                id: id || `temp-${rowIndex}`, // Use imported ID or temp
                title,
                type: isSubTaskByType ? 'User Story' : type, // Force to US if it was a Task but had no parent (orphan task becomes story)
                subTasks: [] as any[]
            };

            // Optional: if estimate > 0, and no subtasks were added yet, add a default subtask
            if (estimate > 0 && newStory.subTasks.length === 0) {
                newStory.subTasks.push({
                    title: 'Implementation',
                    estimate: estimate,
                    category: 'Implementation'
                });
            }

            storiesToImport.push(newStory);
            storyMap.set(newStory.id, newStory); // Map by ID
            storyMap.set(newStory.title, newStory); // Map by Title (fallback for Parent ID looking up Name)
            lastStory = newStory;
        });

        if (storiesToImport.length > 0) {
            importStories(storiesToImport);
            setOpen(false);
            setRawText('');
            setStep('paste');
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children || (
                    <Button variant="outline" size="sm" className="h-8 text-xs gap-2 border-border/50 bg-background/50">
                        <Upload className="w-3.5 h-3.5" />
                        Import
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-0 gap-0 overflow-hidden">
                <DialogHeader className="p-6 border-b shrink-0">
                    <DialogTitle className="flex items-center gap-2">
                        <Upload className="w-5 h-5 text-primary" />
                        Smart Import
                    </DialogTitle>
                    <DialogDescription>
                        {step === 'paste' ? 'Paste your data from Jira or Excel (Ctrl+V)' : 'Map columns to Scrum Timekeeper fields'}
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-auto p-0 min-h-0 bg-muted/10">
                    {step === 'paste' ? (
                        <div className="h-full p-4">
                            <Textarea
                                className="w-full h-full font-mono text-xs resize-none bg-background border-border"
                                placeholder={`Example:\nSTORY-1\tImplement Login\tUser Story\t5\t...\n...`}
                                value={rawText}
                                onChange={e => setRawText(e.target.value)}
                                autoFocus
                            />
                        </div>
                    ) : (
                        <div className="h-full overflow-auto">
                            <Table>
                                <TableHeader className="sticky top-0 z-10 bg-background shadow-sm">
                                    <TableRow>
                                        {parsedData[0]?.map((_, idx) => (
                                            <TableHead key={idx} className="min-w-[150px] p-2">
                                                <Select
                                                    value={headerMapping[idx]}
                                                    onValueChange={(val: ColumnMapping) => {
                                                        const newMap = [...headerMapping];
                                                        newMap[idx] = val;
                                                        setHeaderMapping(newMap);
                                                    }}
                                                >
                                                    <SelectTrigger className="h-7 text-xs">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="Ignore">Ignore</SelectItem>
                                                        <SelectItem value="Title">Title (Required)</SelectItem>
                                                        <SelectItem value="Type">Type</SelectItem>
                                                        <SelectItem value="Estimate">Estimate</SelectItem>
                                                        <SelectItem value="ID">ID / Key</SelectItem>
                                                        <SelectItem value="Parent ID">Parent ID</SelectItem>
                                                        <SelectItem value="Status">Status</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </TableHead>
                                        ))}
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {parsedData.slice(0, 50).map((row, rIdx) => (
                                        <TableRow key={rIdx}>
                                            {row.map((cell, cIdx) => (
                                                <TableCell key={cIdx} className={clsx("text-xs py-2 px-4 truncate max-w-[200px]", headerMapping[cIdx] === 'Ignore' && "opacity-30 text-muted-foreground")}>
                                                    {cell}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </div>

                <DialogFooter className="p-4 border-t bg-background shrink-0 gap-2">
                    {step === 'map' && (
                        <Button variant="outline" onClick={() => setStep('paste')}>
                            Back
                        </Button>
                    )}
                    <Button onClick={step === 'paste' ? handleParse : handleImport} disabled={!rawText}>
                        {step === 'paste' ? (
                            <>Preview <ArrowRight className="w-4 h-4 ml-2" /></>
                        ) : (
                            <>Import Stories <Check className="w-4 h-4 ml-2" /></>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
