import { useMemo, useState } from "react";
import { CalendarEvent } from "../../features/events";
import { EVENT_TYPE_META, EventType, EventTypeMeta } from "../../utils/constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface EventListProps {
    events: CalendarEvent[];
}

const ListView: React.FC<EventListProps> = ({ events }) => {

    const [searchParam, setSearchParam] = useState("");
    const filteredEvents = useMemo(() => {
        const lowerSearch = searchParam.toLowerCase();

        return events.filter(
            (event) =>
                event.title.toLowerCase().includes(lowerSearch)
        );
    }, [events, searchParam]);

    function formatDate(dateInput: string | Date): string {
        const date = new Date(dateInput);
        const hours = date.getHours().toString().padStart(2, "0");
        const minutes = date.getMinutes().toString().padStart(2, "0");
        return `${hours}:${minutes}`;
    }

    function getEventTypeMeta(type?: string): EventTypeMeta {
        const key = type as EventType;
        return EVENT_TYPE_META[key] ?? EVENT_TYPE_META.Other;
    }

    type TimeStatus =
        | "Completed"
        | "Ongoing"
        | "Upcoming";
    
    const TimeStatusColor: Record<TimeStatus, string> = {
        Completed: "#A0AEC0", 
        Ongoing: "#38A169",  
        Upcoming: "#3182CE", 
    };

    function getTimeStatus(startDateTime: Date, endDateTime: Date): TimeStatus {
        const now = new Date().getTime();
        const start = new Date(startDateTime).getTime();
        const end = endDateTime ? new Date(endDateTime).getTime() : start + 60 * 60 * 1000; // default 1hr

        if (now < start) {
            return "Upcoming";
        } else if (now >= start && now <= end) {
            return "Ongoing";
        } else {
            return "Completed";
        }
    }

    return (
        <div className="list-view">

            <h2> Recent & Upcoming Events</h2>

            <div className="event-list-container">
                <div className="search-container">
                    <input
                        type="text"
                        className="search-bar"
                        placeholder="Search events..."
                        value={searchParam}
                        onChange={(e) => setSearchParam(e.target.value)}
                    />
                    {searchParam && (
                        <button
                            type="button"
                            className="clear-btn"
                            onClick={() => setSearchParam("")}
                        >
                            ×
                        </button>
                    )}
                </div>

                <div className="event-cards">
                    {filteredEvents.length > 0 ? (
                        filteredEvents.map((event) => {
                            const eventMeta = getEventTypeMeta(event.eventType);
                            const timeStatus = getTimeStatus(event.startDateTime, event.endDateTime);
                            return (
                                <div
                                    key={event.id}
                                    className="event-card"
                                    onClick={() => console.log(event)}
                                    style={{ borderLeft: `2px solid ${eventMeta.color}` }}
                                >
                                    <div 
                                        className="event-time-status"
                                        style={{ backgroundColor: TimeStatusColor[timeStatus]}}>
                                        {timeStatus}
                                    </div>
                                    <p className="event-time">{formatDate(event.startDateTime)}</p>
                                    <div className="event-title-icon">
                                        <FontAwesomeIcon icon={eventMeta.icon} />
                                        <h4 className="event-title">{event.title}</h4>
                                    </div>
                                    <p className="event-description">Created by You</p>
                                </div>
                            );
                        })
                    ) : (
                        <p className="no-events">No events found.</p>
                    )}
                </div>
            </div>
        </div>
    );
};


export default ListView;