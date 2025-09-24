import {ViewMode} from '../../features/events';

import '../../styles/DropDown.scss'; 

const ViewDropdown: React.FC<{ mode: ViewMode, onChange: (mode: ViewMode) => void }> = ({mode, onChange}) => {
    return (
        <select className="view-dropdown" value={mode} onChange={(e) => onChange(e.target.value as ViewMode)}>
            <option value="single">Single Day</option>
            <option value="multi">Multi Day</option>
            <option value="list">List View</option>
        </select>
    );
};

export default ViewDropdown;
