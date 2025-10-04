import {useEffect, useState} from "react";
import toast from "react-hot-toast";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {useNavigate} from "react-router-dom";

import {
    AddEventModal,
    BottomBar,
    MultiDayView,
    SingleDayView,
    UpdateEventModal,
    ViewModeToggle,
    WeekSlider
} from "../components/event";
import {ListView} from "../components/event";
import {Header} from "../components/home";
import {useKeyboardShortcuts} from "../hooks/useKeyboardShortcuts";
import {AuthService} from "../features/auth";
import {EventService} from "../features/events/services";
import {CalendarEvent, ViewMode} from "../features/events/dtos/event.view";
import {addDays} from "../utils/dates";

import "../styles/event.scss";

type Props = {}

const EventPage: React.FC<Props> = ({}) => {

    const navigate = useNavigate();
    const queryClient = useQueryClient();

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

    const monthName = selectedDate.toLocaleString('default', {month: 'long'});

    function formatDate(date: Date): string {
        return date.toLocaleDateString("en-CA"); // en-CA gives YYYY-MM-DD
    }

    const getDayWindow = (selectedDate: Date, mode: ViewMode): { start: Date, end: Date } => {
        if (mode == "multi") {
            const start = selectedDate;
            const end = addDays(start, 1);
            return {start, end};
        }
        return {start: selectedDate, end: selectedDate};
    }

    const {start, end} = getDayWindow(selectedDate, mode);

    const fetchEvent = useQuery<CalendarEvent[], Error>({
        queryKey: ["events", formatDate(start), formatDate(end)],
        queryFn: () => EventService.getEventsOnRange(formatDate(start), formatDate(end)),
        staleTime: 1000 * 60 * 5,
    });

    useEffect(() => {
        if (fetchEvent.error) {
            toast.error("Failed to load events");
        }
    }, [fetchEvent.error]);


    useEffect(() => {
        if (mode !== "multi") return; // only prefetch in multi-day view

        // Prefetch next 2-day window
        const nextStart = addDays(end, 1);
        const nextEnd = addDays(end, 2);

        // Prefetch previous 2-day window
        const prevStart = addDays(start, -2);
        const prevEnd = addDays(start, -1);

        // Prefetch next window only if not cached
        if (!queryClient.getQueryData(["events", formatDate(nextStart), formatDate(nextEnd)])) {
            queryClient.prefetchQuery({
                queryKey: ["events", formatDate(nextStart), formatDate(nextEnd)],
                queryFn: () => EventService.getEventsOnRange(formatDate(nextStart), formatDate(nextEnd)),
                staleTime: 1000 * 60 * 5,
            });
        }

        // Prefetch previous window only if not cached
        if (!queryClient.getQueryData(["events", formatDate(prevStart), formatDate(prevEnd)])) {
            queryClient.prefetchQuery({
                queryKey: ["events", formatDate(prevStart), formatDate(prevEnd)],
                queryFn: () => EventService.getEventsOnRange(formatDate(prevStart), formatDate(prevEnd)),
                staleTime: 1000 * 60 * 5,
            });
        }

    }, [start, end, mode, queryClient]);

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
                <Header showLogout={true} onLogout={onLogout}/>

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
                        <ViewModeToggle mode={mode} onChange={(m) => setMode(m)}/>
                    </div>
                </header>

                <main className="calendar-main">
                    {fetchEvent.isLoading && <div>Loading events...</div>}

                    {!fetchEvent.isLoading && (
                        <>
                            {mode === "single" && (
                                <SingleDayView
                                    startDate={selectedDate}
                                    events={fetchEvent.data ?? []}
                                    onEventClick={handleEventClick}/>
                            )}
                            {mode === "multi" && (
                                <MultiDayView
                                    startDate={selectedDate}
                                    events={fetchEvent.data ?? []}
                                    onEventClick={handleEventClick}/>
                            )}
                            {mode === "list" && (
                                <ListView events={fetchEvent.data ?? []}/>
                            )}
                        </>
                    )}
                </main>

                <BottomBar
                    onToday={() => setSelectedDate(new Date())}
                    onAddEvent={() => setAddEventModalOpen(true)}
                />

                <AddEventModal open={addEventModalOpen} onClose={() => setAddEventModalOpen(false)}/>
                <UpdateEventModal open={updateEventModalOpen} onClose={() => setUpdateEventModalOpen(false)}
                                  currentEvent={selectedEvent}/>
            </div>
        </>
    );
};

export default EventPage;