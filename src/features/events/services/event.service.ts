import { ApiService } from "../../../api";
import { CalendarEvent } from "../../../models";
import { URLConstants } from "../../../utils/constants";
import { toDate } from "../../../utils/dates";


import { EventResponse } from "../dtos/event";

export const EventService = {

    getEvents: async (date: string): Promise<CalendarEvent[]> => {
        const response = await ApiService.get<EventResponse[]>(`${URLConstants.EVENTS}?date=${date}`);

        return response.map(event => ({
            id: String(event.id ?? ""),
            title: event.title ?? "",
            startDateTime: toDate(event.startDateTime ?? ""),
            endDateTime: toDate(event.endDateTime ?? ""),
            color: "#09430eff",
        }));
    },
};

export default EventService;