import { addDays, formatDayLabel } from "../../utils/dates";

type Props = {
    centerDate: Date;
    selectedDate: Date;
    onSelect: (d: Date) => void;
    onPrevWeek?: () => void;
    onNextWeek?: () => void;
};

function generate7Days(center: Date) {
    const days = [];
    const start = addDays(center, -3);
    for (let i = 0; i < 7; i++) {
        days.push(addDays(start, i));
    }
    return days
}

const WeekSlider: React.FC<Props> = ({ centerDate, selectedDate, onSelect, onPrevWeek, onNextWeek }) => {
    const days = generate7Days(centerDate);
    return (
        <div className="week-slider">
            <button className="chev" onClick={onPrevWeek} aria-label="previous days">‹</button>
            <div className="days-scroll" role="tablist" aria-label="Week days">
                {days.map(d => {
                    const isSelected =
                        d.getFullYear() === selectedDate.getFullYear() &&
                        d.getMonth() === selectedDate.getMonth() &&
                        d.getDate() === selectedDate.getDate();

                    return (
                        <button
                            key={d.toISOString()}
                            className={`day ${isSelected ? 'selected' : ''}`}
                            onClick={() => onSelect(d)}
                            role="tab"
                            aria-pressed={isSelected}
                        >
                            <div className="dow">{d.toLocaleDateString(undefined, { weekday: 'short' }).slice(0, 1)}</div>
                            <div className="date">{d.getDate()}</div>
                        </button>
                    );
                })}
            </div>
            <button className="chev" onClick={onNextWeek} aria-label="next days">›</button>
        </div>
    );
};

export default WeekSlider;