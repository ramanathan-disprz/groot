import {ViewMode} from "../../features/events";
import ToggleGroup from "./ToggleGroup";

type Props = {
    mode: ViewMode;
    onChange: (m: ViewMode) => void;
};


const ViewModeToggle: React.FC<Props> = ({mode, onChange}) => {

    const options = [
        {value: "single" as ViewMode, label: "Single Day"},
        {value: "multi" as ViewMode, label: "Multi Day"},
        {value: "list" as ViewMode, label: "List"},
    ];

    return (
        <ToggleGroup
            options={options}
            selected={mode}
            onChange={onChange}
            className="view-toggle"
            ariaLabel="View mode"
        />
    );
};

export default ViewModeToggle;