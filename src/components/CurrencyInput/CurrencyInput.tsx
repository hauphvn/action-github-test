import {Input as InputAnt} from 'antd';
import React, {useEffect, useState} from "react";
import { FormatNumber, ParseCurrency} from "../../constants";

interface CurrencyInputProps {
    value:  string | null | undefined;
    onChange: (value:  string | null | undefined) => void;
    className?: string;
    warning?: string;
    disabled?: boolean;
    id?: string;
    placeholder?: string;
    onBlur?: () => void;
}

const CurrencyInput = (props: CurrencyInputProps) => {
    const [displayValue, setDisplayValue] = useState(FormatNumber(props.value))
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        const numericValue = ParseCurrency(inputValue);
        props.onChange ? props.onChange(numericValue) : null;

        setDisplayValue(FormatNumber(numericValue));
    }
    useEffect(() => {
        setDisplayValue(FormatNumber(props.value));
    }, [props.value]);
    return (
        <InputAnt
            className={`
         box-border max-h-[50px] px-[20px] py-[14px] ${props?.warning ? 'border-semantics-red02' : 'border-none '} 
            ${props?.className}
             
            `}
            {...props}
            allowClear
            value={displayValue}
            onChange={handleChange}
        />
    )
        ;
};

export default CurrencyInput;