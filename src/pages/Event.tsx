import { useEffect, useState } from "react";
import { CalendarEvent, ViewMode } from '../models/event';
import { addDays } from "../utils/dates";

import {
    WeekSlider,
    SingleDayView,
    MultiDayView,
    ViewModeToggle,
    BottomBar
} from "../components/event";

import "../styles/event.scss";
import toast from "react-hot-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import EventService from "../features/events/services/event.service";
import { URLConstants } from "../utils/constants";
import { AuthCookie } from "../utils/AuthCookie";

const sampleEvents: CalendarEvent[] = [
    {
        id: '1',
        title: 'Morning Meeting',
        startDateTime: new Date('2025-09-19T09:00:00+05:30'),
        endDateTime: new Date('2025-09-18T12:00:00+05:30'),
        color: '#d6680eff'
    },
    {
        id: '2',
        title: 'Lunch Break',
        startDateTime: new Date('2025-09-18T15:01:00+05:30'),
        endDateTime: new Date('2025-09-18T17:00:00+05:30'),
        color: '#4ad60eff'

    },
    {
        id: '3',
        title: 'Project Discussion',
        startDateTime: new Date('2025-09-18T15:01:00+05:30'),
        endDateTime: new Date('2025-09-18T17:00:00+05:30'),
        color: '#0ec2d6ff'
    },
    {
        id: '4',
        title: 'Evening Workout',
        startDateTime: new Date('2025-09-18T19:00:00+05:30'),
        endDateTime: new Date('2025-09-18T22:00:00+05:30'),
        color: '#d60e93ff'

    }
];

type Props = {}
const Event: React.FC<Props> = ({ }) => {

    const [centerDate, setCenterDate] = useState<Date>(new Date());
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [mode, setMode] = useState<ViewMode>('single');

    const prevWeek = () => setCenterDate(d => addDays(d, -7));
    const nextWeek = () => setCenterDate(d => addDays(d, 7));

    const monthName = selectedDate.toLocaleString('default', { month: 'long' });

    function formatDate(date: Date): string {
        return date.toLocaleDateString("en-CA"); // en-CA gives YYYY-MM-DD
    }

    const { data: events, error, isLoading } = useQuery<CalendarEvent[], Error>({
        queryKey: ["events", formatDate(selectedDate)],
        queryFn: () => EventService.getEvents(formatDate(selectedDate)),
    });

    useEffect(() => {
        if (error) {
            toast.error("Failed to load events");
        }
    }, [error]);

    return (
        <div className="calendar-shell">

            <header className="calendar-top">
                <div className="left">
                    <h2>{monthName}</h2>
                </div>
                <div className="center">
                    <WeekSlider
                        centerDate={centerDate}
                        selectedDate={selectedDate}
                        onSelect={(d) => setSelectedDate(d)}
                        onPrevWeek={prevWeek}
                        onNextWeek={nextWeek}
                    />
                </div>
                <div className="right">
                    <ViewModeToggle mode={mode} onChange={(m) => setMode(m)} />
                </div>
            </header>

            <main className="calendar-main">
                {isLoading && <div>Loading events...</div>}

                {!isLoading && (
                    <>
                        {mode === "single" && (
                            <SingleDayView startDate={selectedDate} events={events ?? []} />
                        )}
                        {mode === "multi" && (
                            <MultiDayView startDate={selectedDate} events={events ?? []} />
                        )}
                        {mode === "list" && (
                            <div className="list-view">List view not implemented yet</div>
                        )}
                    </>
                )}
            </main>

            <BottomBar
                onToday={() => setSelectedDate(new Date())}
                onAddEvent={() => alert("Add Event clicked")}
            />

        </div>
    );
};

export default Event;