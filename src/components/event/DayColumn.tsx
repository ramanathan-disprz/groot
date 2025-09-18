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

function calculatePosition(start: Date, end: Date, hourHeight: number) {
    const hoursBeforeStart = start.getHours();
    const top = hoursBeforeStart * (hourHeight) + (hoursBeforeStart * 0.9);

    const durationInHours = Math.floor((end.getTime() - start.getTime()) / 3600000);
    const hourLinesDuringEvent = Math.max(0, durationInHours - 1);
    const height = Math.max(0, durationInHours * hourHeight + (hourLinesDuringEvent * 0.9));
    return { top, height };
}

const DayColumn: React.FC<Props> = ({ date, events = [], hourHeight = 120 }) => {
    const containerHeight = hourHeight * 24;

    const dayEvents = useMemo(() => {
        return events.filter(e => {
            const s = new Date(e.startTime);
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
                    const start = new Date(evt.startTime);
                    const end = new Date(evt.endTime);
                    const { top, height } = calculatePosition(start, end, hourHeight);
                    console.log(`Event: ${evt.title}, Start: ${start}, Top: ${top}px, Height: ${height}px`);
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