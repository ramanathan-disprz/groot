export type ViewMode = 'single' | 'multi' | 'list';

export type CalendarEvent = {
    id: string;
    title: string;
    description?: string;
    startDateTime: Date;
    endDateTime: Date;
    color?: string;
}