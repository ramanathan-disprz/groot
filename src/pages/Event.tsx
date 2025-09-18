import { useState } from "react";
import { CalendarEvent, ViewMode } from '../models/event';
import { addDays } from "../utils/dates";
import WeekSlider from "../components/event/WeekSlider";
import ViewModeToggle from "../components/event/ViewModeToggle";
import MultiDayView from "../components/event/MultiDayView";
import SingleDayView from "../components/event/SingleDayView";
import "../styles/event.scss";

const sampleEvents: CalendarEvent[] = [
    {
        id: '1',
        title: 'Morning Meeting',
        startTime: new Date('2025-09-17T00:00:00').toISOString(),
        endTime: new Date('2025-09-17T01:00:00').toISOString(),
        color: '#d6680eff'
    },
    {
        id: '2',
        title: 'Lunch Break',
        startTime: new Date('2025-09-17T12:00:00').toISOString(),
        endTime: new Date('2025-09-17T13:00:00').toISOString(),
        color: '#d6680eff'
        
    },
    {
        id: '3',
        title: 'Project Discussion',
        startTime: new Date('2025-09-17T15:00:00').toISOString(),
        endTime: new Date('2025-09-17T16:30:00').toISOString(),
        color: '#d6680eff'
    },
    {
        id: '4',
        title: 'Evening Workout',
        startTime: new Date('2025-09-17T18:00:00').toISOString(),
        endTime: new Date('2025-09-17T19:00:00').toISOString(),
        color: '#d6680eff'

    }
];

type Props = {}
const Event: React.FC<Props> = ({ }) => {
    const [centerDate, setCenterDate] = useState<Date>(new Date());
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [mode, setMode] = useState<ViewMode>('multi');

    const prevWeek = () => setCenterDate(d => addDays(d, -7));
    const nextWeek = () => setCenterDate(d => addDays(d, 7));

    const monthName = selectedDate.toLocaleString('default', { month: 'long' });

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
                {mode === 'single' && <SingleDayView startDate={selectedDate} events={sampleEvents} />}
                {mode === 'multi' && <MultiDayView startDate={selectedDate} events={sampleEvents} />}
                {mode === 'list' && <div className="list-view">List view not implemented yet</div>}
            </main>
        </div>
    );
};

export default Event;