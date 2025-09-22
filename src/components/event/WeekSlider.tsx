import { addDays, formatDayLabel } from "../../utils/dates";

interface Props {
    selectedDate: Date;
    onSelect: (d: Date) => void;
    onChangeWeek: (date: Date) => void;
};

function generate7Days(centerDate: Date): Date[] {
    const dayOfWeek = centerDate.getDay();
    const sunday = new Date(centerDate);
    sunday.setDate(centerDate.getDate() - dayOfWeek);

    return Array.from({ length: 7 }, (_, i) => {
        const d = new Date(sunday);
        d.setDate(sunday.getDate() + i);
        return d;
    });
};

const WeekSlider: React.FC<Props> = ({ selectedDate, onSelect, onChangeWeek }) => {

    const days = generate7Days(selectedDate);

    const prevWeek = () => {
        const newDate = new Date(selectedDate);
        newDate.setDate(selectedDate.getDate() - 7);
        onChangeWeek(newDate);
    };

    const nextWeek = () => {
        const newDate = new Date(selectedDate);
        newDate.setDate(selectedDate.getDate() + 7);
        onChangeWeek(newDate);
    };
    return (
        <div className="week-slider">
            <button
                className="chev"
                onClick={prevWeek}
                aria-label="previous days">‹</button>

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

            <button
                className="chev"
                onClick={nextWeek}
                aria-label="next days">›</button>
        </div>
    );
};

export default WeekSlider;