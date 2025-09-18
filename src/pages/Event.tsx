import { useState } from "react";
import { CalendarEvent, ViewMode } from '../models/event';
import { addDays } from "../utils/dates";

import {
    WeekSlider,
    SingleDayView, 
    MultiDayView, 
    ViewModeToggle
} from "../components/event";

import "../styles/event.scss";

const sampleEvents: CalendarEvent[] = [
    {
        id: '1',
        title: 'Morning Meeting',
        startTime: new Date('2025-09-18T00:00:00').toISOString(),
        endTime: new Date('2025-09-18T02:00:00').toISOString(),
        color: '#d6680eff'
    },
    {
        id: '2',
        title: 'Lunch Break',
        startTime: new Date('2025-09-18T02:00:00').toISOString(),
        endTime: new Date('2025-09-18T19:00:00').toISOString(),
        color: '#4ad60eff'

    },
    {
        id: '3',
        title: 'Project Discussion',
        startTime: new Date('2025-09-18T21:00:00').toISOString(),
        endTime: new Date('2025-09-18T24:00:00').toISOString(),
        color: '#0ec2d6ff'
    },
    {
        id: '4',
        title: 'Evening Workout',
        startTime: new Date('2025-09-18T00:00:00').toISOString(),
        endTime: new Date('2025-09-18T03:00:00').toISOString(),
        color: '#d60e93ff'

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