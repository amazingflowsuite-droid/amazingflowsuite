import type { TeamMember, SprintSettings, Story } from '../store/usePlanningStore';

export const calculateMemberCapacity = (
    member: TeamMember,
    settings: SprintSettings
): { totalCapacity: number; ritualsDeduction: number; availableCapacity: number } => {
    // 1. Total Work Hours
    const totalWorkHours = settings.sprintDurationDays * member.dailyHours * (member.allocation / 100);

    // 2. Rituals
    const totalRituals =
        settings.dailyScrumDuration +
        settings.planningDuration +
        settings.reviewDuration +
        settings.retroDuration +
        settings.refinementDuration +
        settings.otherRitualsDuration;

    // 3. Deductions
    const availableCapacity = totalWorkHours - member.daysOff - totalRituals;

    return {
        totalCapacity: totalWorkHours,
        ritualsDeduction: totalRituals,
        availableCapacity: Math.max(0, availableCapacity),
    };
};

export const calculateTeamCapacityByRole = (members: TeamMember[], settings: SprintSettings) => {
    const buckets: Record<string, number> = {
        Dev: 0,
        QA: 0,
        Other: 0
    };

    members.forEach(m => {
        const { availableCapacity } = calculateMemberCapacity(m, settings);
        const roleKey = (buckets[m.roleType] !== undefined) ? m.roleType : 'Other';
        buckets[roleKey] += availableCapacity;
    });

    return buckets;
};

export const calculateSprintLoadByRole = (stories: Story[]) => {
    const loads = {
        Dev: 0,
        QA: 0
    };

    stories.filter(s => s.in_sprint).forEach(story => {
        story.subTasks.forEach(task => {
            if (task.category === 'Implementation') {
                loads.Dev += task.estimate;
            } else if (task.category === 'Test') {
                loads.QA += task.estimate;
            } else {
                // Defaulting undefined to Dev
                loads.Dev += task.estimate;
            }
        });
    });

    return loads;
};
