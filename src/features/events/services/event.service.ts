import { ApiService } from "../../../api";
import { CalendarEvent } from "../dtos";
import { URLConstants } from "../../../utils/constants";
import { toDate } from "../../../utils/dates";

import { EventRequest, EventResponse } from "../dtos/event";

export const EventService = {

    getEvents: async (date: string): Promise<CalendarEvent[]> => {
        const events = await ApiService.get<EventResponse[]>(`${URLConstants.EVENTS}?date=${date}`);
        return events.map(event => ({
            id: String(event.id ?? ""),
            title: event.title ?? "",
            description: event.description ?? "",
            startDateTime: toDate(event.startDateTime ?? ""),
            endDateTime: toDate(event.endDateTime ?? ""),
            eventType: event.eventType ?? "Work",
        }));
    },

    getEventsOnRange: async (start: string, end: string): Promise<CalendarEvent[]> => {
        const events = await ApiService.get<EventResponse[]>(`${URLConstants.EVENTS}?start=${start}&end=${end}`);
        return events.map(event => ({
            id: String(event.id ?? ""),
            title: event.title ?? "",
            description: event.description ?? "",
            startDateTime: toDate(event.startDateTime ?? ""),
            endDateTime: toDate(event.endDateTime ?? ""),
            eventType: event.eventType ?? "Work",
        }));
    },

    addEvent: (payload: EventRequest) => {
        return ApiService.post<EventResponse, EventRequest>(`${URLConstants.EVENTS}`, payload);
    },

    updateEvent: (id: string, payload: EventRequest) => {
        const eventId: number = Number.parseInt(id);
        return ApiService.put<EventResponse, EventRequest>(`${URLConstants.EVENTS}/${eventId}`, payload);
    },
    deleteEvent: (id: string) => {
        const eventId: number = Number.parseInt(id);
        return ApiService.delete(`${URLConstants.EVENTS}/${eventId}`);
    }
};

export default EventService;