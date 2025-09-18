import { useMemo } from "react";
import { CalendarEvent } from "../../models";
import { isSameDay } from "../../utils/dates";

type Props = {
    date: Date;
    events: CalendarEvent[];
    hourHeight?: number;
}

function minutesFromStartOfDay(d: Date) {
    return d.getHours() * 60 + d.getMinutes();
}

function timeToString(iso: string) {
    return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
}

const DayColumn: React.FC<Props> = ({ date, events = [], hourHeight = 60 }) => {
    const containerHeight = hourHeight * 24;
    const dayEvents = useMemo(() => {
        return events.filter(e => {
            const s = new Date(e.startTime);
            return isSameDay(s, date);
        });
    }, [events, date]);

    const now = new Date();
    const showNow = isSameDay(now, date);
    const nowTop = (minutesFromStartOfDay(now) / 60) * hourHeight;

    return (
        <div className="day-column">
            <div className="day-header">{date.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}</div>

            <div className="hours-grid" style={{ height: `${containerHeight}px` }}>
                {Array.from({ length: 24 }).map((_, h) => (
                    <div className="hour-row" key={h} style={{ height: `${hourHeight}px` }}>
                        <div className="hour-label">{String(h).padStart(2, '0')}:00</div>
                        <div className="hour-line" />
                    </div>
                ))}

                {dayEvents.map(evt => {
                    const start = new Date(evt.startTime);
                    const end = new Date(evt.endTime);
                    const top = (minutesFromStartOfDay(start) / 60) * hourHeight;
                    const height = ((end.getTime() - start.getTime()) / (1000 * 60)) / 60 * hourHeight;
                    return (
                        <div
                            key={evt.id}
                            className="event-pill"
                            style={{ top: `${top}px`, height: `${Math.max(20, height)}px`, background: evt.color || undefined }}
                            role="button"
                            aria-label={`${evt.title} ${timeToString(evt.startTime)} - ${timeToString(evt.endTime)}`}
                        >
                            <div className="title">{evt.title}</div>
                            <div className="time">{`${timeToString(evt.startTime)} - ${timeToString(evt.endTime)}`}</div>
                        </div>
                    );
                })}

                {showNow && (
                    <div className="now-line" style={{ top: `${nowTop}px` }} aria-hidden="true">
                        <div className="time-bubble">{`${timeToString(now.toISOString())}`}</div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DayColumn;