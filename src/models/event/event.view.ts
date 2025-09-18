export type ViewMode = 'single' | 'multi' | 'list';

export type CalendarEvent = {
    id: string;
    title: string;
    startTime: string;
    endTime: string;
    color?: string;
}