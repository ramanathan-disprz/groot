

interface EventBottomBarProps {
    onToday: () => void;
    onAddEvent: () => void;
}

const EventBottomBar: React.FC<EventBottomBarProps> = ({ onToday, onAddEvent }) => {
    return (
        <nav className="event-bottom-bar">
            <button className="event-bottom-bar__btn" onClick={onToday}>
                Today
            </button>
            <button
                className="event-bottom-bar__btn event-bottom-bar__btn--add"
                onClick={onAddEvent}
            >
                + Add Event
            </button>
        </nav>
    );
};

export default EventBottomBar;