import { Select as SelectAnt } from 'antd';
import {ReactNode} from "react";
import {IconSelectArrowButton} from "../../assets/svgs/SVGIcon.tsx";
import './selectCustom.css';

export interface SelectOption {
    label: string,
    value: string
}
interface SelectProps{
    className?: string,
    placeholder?: string,
    options: SelectOption[],
    id?:string
    suffixIcon?: ReactNode,
    maxTagCount?: number,
    isDarkMode?: boolean,
    mode?: 'multiple' | 'tags' |'single',
    value?: string | string[],
    onChange?: (value: string | string[]) => void
}
// const options: SelectAntProps['options'] = [];
const Select = (props: SelectProps) => {
    const {
        options,
        placeholder,
        suffixIcon,
        maxTagCount,
        isDarkMode,
        className,
        mode = 'single',
        value = '',
        onChange
        
    } = props;
    return (
        // <Space className={'w-full flex items-center'} direction="vertical">
            <SelectAnt
                onChange={onChange}
                value={value}
                suffixIcon={suffixIcon ? props.suffixIcon : <IconSelectArrowButton/>}
                mode={mode === 'single' ? undefined : mode}
                maxTagCount={maxTagCount}
                allowClear
                placeholder={placeholder}
                options={options}
                style={{ width: '100%' }}
                className={` rounded-[8px] ${className}`}
                getPopupContainer={trigger => trigger.parentElement}
                popupClassName={isDarkMode ? 'select-dark-content' : ''}
            />
        // </Space>
    );
};

export default Select;