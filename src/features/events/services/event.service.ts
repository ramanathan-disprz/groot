import { ApiService } from "../../../api";
import { CalendarEvent } from "../../../models";
import { URLConstants } from "../../../utils/constants";
import { toDate } from "../../../utils/dates";

import { EventRequest, EventResponse } from "../dtos/event";

export const EventService = {

    getEvents: async (date: string): Promise<CalendarEvent[]> => {
        const events = await ApiService.get<EventResponse[]>(`${URLConstants.EVENTS}?date=${date}`);
        return events.map(event => ({
            id: String(event.id ?? ""),
            title: event.title ?? "",
            startDateTime: toDate(event.startDateTime ?? ""),
            endDateTime: toDate(event.endDateTime ?? ""),
            color: "#09430eff",
        }));
    },

    addEvent: (payload: EventRequest) => {
        return ApiService.post<EventResponse, EventRequest>(`${URLConstants.EVENTS}`, payload);
    }
};

export default EventService;