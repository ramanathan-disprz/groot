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

function timeToString(date: Date) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
}

function calculatePosition(start: Date, end: Date, hourHeight: number) {
    const hoursBeforeStart = start.getHours();
    const startMinutes = start.getMinutes();
    const top = hoursBeforeStart * (hourHeight) + (startMinutes / 60) * hourHeight +
        (hoursBeforeStart * 0.9);

    const durationInMs = end.getTime() - start.getTime();
    const durationInHours = durationInMs / (1000 * 60 * 60);
    const hourLinesDuringEvent = Math.max(0, durationInHours - 1);
    const height = Math.max(0, durationInHours * hourHeight + (hourLinesDuringEvent * 0.9));
    return { top, height };
}

const DayColumn: React.FC<Props> = ({ date, events = [], hourHeight = 120 }) => {
    const containerHeight = hourHeight * 24;

    const dayEvents = useMemo(() => {
        return events.filter(e => {
            const s = e.startDateTime;
            return isSameDay(s, date);
        });

    }, [events, date]);

    const now = new Date();
    const showNow = isSameDay(now, date);
    const duration = minutesFromStartOfDay(now) / 60;
    const nowTop = (duration * 0.9) + (duration) * hourHeight;

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
                    const start = evt.startDateTime;
                    const end = evt.endDateTime;
                    const { top, height } = calculatePosition(start, end, hourHeight);
                    return (
                        <div
                            key={evt.id}
                            className="event-pill"
                            style={{ top: `${top}px`, height: `${Math.max(20, height)}px`, background: evt.color || undefined }}
                            role="button"
                            aria-label={`${evt.title} ${timeToString(evt.startDateTime)} - ${timeToString(evt.endDateTime)}`}
                        >
                            <div className="title">{evt.title}</div>
                            <div className="time">{`${timeToString(evt.startDateTime)} - ${timeToString(evt.endDateTime)}`}</div>
                        </div>
                    );
                })}

                {showNow && (
                    <div className="now-line" style={{ top: `${nowTop}px` }} aria-hidden="true">
                        <div className="time-bubble">{`${timeToString(now)}`}</div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DayColumn;