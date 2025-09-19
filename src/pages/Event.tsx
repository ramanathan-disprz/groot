import { useEffect, useState } from "react";
import { CalendarEvent, ViewMode } from '../models/event';
import { addDays } from "../utils/dates";

import {
    WeekSlider,
    SingleDayView,
    MultiDayView,
    ViewModeToggle,
    BottomBar,
    EventModal
} from "../components/event";

import "../styles/event.scss";
import toast from "react-hot-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import EventService from "../features/events/services/event.service";

type Props = {}
const Event: React.FC<Props> = ({ }) => {

    const [centerDate, setCenterDate] = useState<Date>(new Date());
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [mode, setMode] = useState<ViewMode>('single');
    const [modalOpen, setModalOpen] = useState(false);

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
                onAddEvent={() => setModalOpen(true)}
            />

            <EventModal open={modalOpen} onClose={() => setModalOpen(false)} />
        </div>
    );
};

export default Event;