import React from 'react';
import DayColumn from './DayColumn';
import { CalendarEvent } from '../../models';
import { addDays } from '../../utils/dates';

type Props = {
    startDate: Date;
    events: CalendarEvent[];
};

const MultiDayView: React.FC<Props> = ({ startDate, events }) => {
    const nextDay = addDays(startDate, 1);
    return (
        <div className="multi-day-view">
            <DayColumn date={startDate} events={events} />
            <DayColumn date={nextDay} events={events} />
        </div>
    );
};

export default MultiDayView;
