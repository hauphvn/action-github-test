import {Input as InputAnt, InputProps as AntInputProps} from 'antd';

interface InputProps extends Omit<AntInputProps, 'children'> {
    className?: string;
    warning?: boolean;
    onSearch?:(value: string) => void;
}
const {Search} = InputAnt;
const InputSearch = (props: InputProps) => {
    return (
        <Search
            {...props} allowClear />

    // <InputAnt
    //         {...props}
    //         className={`
    //     ${props?.className} box-border w-full max-h-[50px] rounded-[8px] px-[20px] py-[14px] ${props?.warning ? 'border-semantics-red02' : 'border-none'}  `}
    //     />
    );
};

export default InputSearch;