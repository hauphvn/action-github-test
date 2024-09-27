interface SwitchProps {
    size?: 'small' | 'medium';
    checked?: boolean;
    onChange?: (checked: boolean) => void;
}
const Switch = (props: SwitchProps) => {

    return (
        <div
            className={`switch-root ${props.size === 'small' ? 'switch-root-small' : 'switch-root-medium'}`}
             >
            <label className="switch">
                <input checked={props.checked} onChange={(e) => props?.onChange ? props?.onChange(e?.target?.checked) : null} type="checkbox"/>
                <span className="slider round"></span>
            </label>
        </div>
    );
};

export default Switch;