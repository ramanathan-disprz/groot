import { EVENT_TYPE_META, EventType } from '../../utils/constants';

interface SelectEventTypeProps {
    value: string;
    onChange: (value: string) => void;
}

const SelectEventType: React.FC<SelectEventTypeProps> = ({ value, onChange }) => {


    const options = (Object.keys(EVENT_TYPE_META) as EventType[]).map((key) => ({
        value: key,
        label: EVENT_TYPE_META[key].label,
        icon: EVENT_TYPE_META[key].icon,
        color: EVENT_TYPE_META[key].color,
    }));

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onChange(e.target.value);
    };

    return (
        <select value={value} onChange={handleSelectChange}>
            {
                options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))
            }
        </select>
    );
};

export default SelectEventType;
