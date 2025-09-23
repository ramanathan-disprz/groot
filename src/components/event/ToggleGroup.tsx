type ToggleOption<T extends string> = {
    value: T;
    label: string;
};

interface ToggleGroupProps<T extends string> {
    options: ToggleOption<T>[];
    selected: T;
    onChange: (val: T) => void;
    className?: string;
    ariaLabel?: string;
}

function ToggleGroup<T extends string>({
    options,
    selected,
    onChange,
    className = "",
    ariaLabel,
}: ToggleGroupProps<T>) {
    return (
        <div className={`toggle-group ${className}`} role="radiogroup" aria-label={ariaLabel}>
            {options.map((opt) => (
                <button
                    key={opt.value}
                    type="button"
                    className={selected === opt.value ? "active" : ""}
                    onClick={() => onChange(opt.value)}
                >
                    {opt.label}
                </button>
            ))}
        </div>
    );
}

export default ToggleGroup;
