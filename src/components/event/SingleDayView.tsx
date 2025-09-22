import DayColumn from "./DayColumn";
import { CalendarEvent } from "../../models";

type Props = {
    startDate: Date;
    events: CalendarEvent[];
    onEventClick: (event: CalendarEvent) => void;
}

const SingleDayView: React.FC<Props> = ({ startDate, events, onEventClick }) => {
    return (
        <div className="single-day-view">
            <DayColumn date={startDate} events={events} onEventClick={onEventClick} />
        </div>
    )
}


export default SingleDayView
