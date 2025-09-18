import { ViewMode } from "../../models";

type Props = {
    mode: ViewMode;
    onChange: (m: ViewMode) => void;
};


const ViewModeToggle: React.FC<Props> = ({ mode, onChange }) => {

    return (
        <div className="view-toggle" role="radiogroup" aria-label="View mode">
            <button className={mode === 'single' ? 'active' : ''} onClick={() => onChange('single')}>Single Day</button>
            <button className={mode === 'multi' ? 'active' : ''} onClick={() => onChange('multi')}>Multi Day</button>
            <button className={mode === 'list' ? 'active' : ''} onClick={() => onChange('list')}>List</button>
        </div>
    );
};

export default ViewModeToggle;