import DayColumn from "./DayColumn";
import { CalendarEvent } from "../../models";

type Props = {
    startDate: Date;
    events: CalendarEvent[]
}

const SingleDayView: React.FC<Props> = ({ startDate, events }) => {
    return (
        <div className="single-day-view">
            <DayColumn date={startDate} events={events} />
        </div>
    )
}


export default SingleDayView
