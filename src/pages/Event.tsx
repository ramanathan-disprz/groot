import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { CalendarEvent, ViewMode } from '../models/event';

import {
    WeekSlider,
    SingleDayView,
    MultiDayView,
    ViewModeToggle,
    BottomBar,
    AddEventModal,
    UpdateEventModal
} from "../components/event";

import "../styles/event.scss";
import EventService from "../features/events/services/event.service";
import { Header } from "../components/home";
import { AuthService } from "../features/auth";
import { useKeyboardShortcuts } from "../hooks/useKeyboardShortcuts";
import ListView from "../components/event/ListView";

type Props = {}
const Event: React.FC<Props> = ({ }) => {

    const navigate = useNavigate();

    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [mode, setMode] = useState<ViewMode>('single');
    const [addEventModalOpen, setAddEventModalOpen] = useState(false);
    const [updateEventModalOpen, setUpdateEventModalOpen] = useState(false);

    const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

    useKeyboardShortcuts({
        s: () => setMode("single"),
        m: () => setMode("multi"),
        l: () => setMode("list")
    });

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

    const onLogout = async () => {
        try {
            await AuthService.logout();
            navigate("/login");
            toast.success("Logout successful");
        } catch (err) {
            toast.error("Logout failed");
        }
    };

    const handleEventClick = (event: CalendarEvent) => {
        setSelectedEvent(event);
        setUpdateEventModalOpen(true);
    };

    return (
        <>
            <div className="calendar-shell">
                <Header showLogout={true} onLogout={onLogout} />

                <header className="calendar-top">
                    <div className="left">
                        <h2>{monthName}</h2>
                    </div>
                    <div className="center">
                        <WeekSlider
                            selectedDate={selectedDate}
                            onSelect={(d) => setSelectedDate(d)}
                            onChangeWeek={setSelectedDate}
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
                                <SingleDayView
                                    startDate={selectedDate}
                                    events={events ?? []}
                                    onEventClick={handleEventClick} />
                            )}
                            {mode === "multi" && (
                                <MultiDayView
                                    startDate={selectedDate}
                                    events={events ?? []}
                                    onEventClick={handleEventClick} />
                            )}
                            {mode === "list" && (
                                <ListView events={events ?? []} />
                            )}
                        </>
                    )}
                </main>

                <BottomBar
                    onToday={() => setSelectedDate(new Date())}
                    onAddEvent={() => setAddEventModalOpen(true)}
                />

                <AddEventModal open={addEventModalOpen} onClose={() => setAddEventModalOpen(false)} />
                <UpdateEventModal open={updateEventModalOpen} onClose={() => setUpdateEventModalOpen(false)} currentEvent={selectedEvent} />
            </div>
        </>
    );
};

export default Event;