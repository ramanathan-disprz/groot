import DayColumn from './DayColumn';

import {CalendarEvent} from '../../features/events';

import {addDays} from '../../utils/dates';

type Props = {
    startDate: Date;
    events: CalendarEvent[];
    onEventClick: (event: CalendarEvent) => void;
};

const MultiDayView: React.FC<Props> = ({startDate, events, onEventClick}) => {
    const nextDay = addDays(startDate, 1);
    return (
        <div className="multi-day-view">
            <DayColumn date={startDate} events={events} onEventClick={onEventClick}/>
            <DayColumn date={nextDay} events={events} onEventClick={onEventClick}/>
        </div>
    );
};

export default MultiDayView;
