import { ApiService } from "../../../api";
import { URLConstants } from "../../../utils/constants";


import { AuthCookie } from "../../../utils/AuthCookie";
import { EventResponse } from "../dtos/event";

export const EventService = {

    getEvents: () => () => {
        return ApiService.get<EventResponse[]>(`${URLConstants.EVENTS}`)
    }
};

export default EventService;