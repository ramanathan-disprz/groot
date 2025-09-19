export interface EventRequest {
    userId?: number;
    title?: string;
    description?: string;
    startDate?: string;
    endDate?: string;
    startTime?: string;
    endTime?: string;
    timeZone?: string;
}

export interface EventResponse {
    id?: number
    userId?: number;
    title?: string;
    description?: string;
    startDateTime?: string;
    endDateTime?: string;
    timeZone?: string;
}
