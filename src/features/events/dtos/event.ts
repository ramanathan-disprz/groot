export interface EventRequest {
    userId?: number;
    title?: string;
    description?: string;
    eventDate?: string;
    startTime?: string;
    endTime?: string;
    timeZone?: string;
}

export interface EventResponse {
    id?: number
    userId?: number;
    title?: string;
    description?: string;
    eventDate?: string;
    startTime?: string;
    endTime?: string;
    timeZone?: string;
}
