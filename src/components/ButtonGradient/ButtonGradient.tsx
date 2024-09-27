import {ReactNode} from "react";

interface ButtonGradientProps {
    className?: string,
    name: string,
    onClick?: () => void,
    disabled?: boolean,
    icon?: ReactNode
}

const ButtonGradient = (props: ButtonGradientProps) => {
    return (
        <button
            {...props}
            onClick={props?.onClick}
            className={` transition-colors duration-200 active:bg-gradient-green-press 
            hover:cursor-pointer bg-gradient-green text-neutrals-50 rounded-[8px] 
           border  border-neutrals-300 font-[500] disabled:cursor-not-allowed 
            disabled:text-semantics-green01  disabled:bg-gradient-green-disabled 
            disabled:border-semantics-grey03 inline-flex items-center justify-center 
            ${props?.className}
            `}
        >
            <div>{props?.icon ? props.icon : null}</div>
            <div> {props?.name || 'Button'}</div>
        </button>
    );
};

export default ButtonGradient;