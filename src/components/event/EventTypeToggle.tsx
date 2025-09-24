import {EVENT_TYPE_META, EventType} from "../../utils/constants";
import ToggleGroup from "./ToggleGroup";

interface EventTypeToggleProps {
    type: EventType;
    onChange: (t: EventType) => void;
}

const EventTypeToggle: React.FC<EventTypeToggleProps> = ({type, onChange}) => {

    const options = (Object.keys(EVENT_TYPE_META) as EventType[]).map((key) => ({
        value: key,
        label: EVENT_TYPE_META[key].label,
        icon: EVENT_TYPE_META[key].icon,
        color: EVENT_TYPE_META[key].color,
    }));
    return (
        <ToggleGroup<EventType>
            options={options}
            selected={type}
            onChange={onChange}
            className="view-toggle"
            ariaLabel="Event type"
        />
    );

};

export default EventTypeToggle;