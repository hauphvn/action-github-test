import {ReactNode} from "react";
import {IconArrowButton, IconArrowRight} from "../../assets/svgs/SVGIcon.tsx";
import {useTheme} from "../../context/ThemeContext.tsx";

interface MenuItemProps {
    hasChildren?: boolean,
    name: string,
    icon?: ReactNode,
    isActive?: boolean,
    isOpen?: boolean
}

const MenuItem = (props: MenuItemProps) => {
    const {isDarkMode} = useTheme();
    return (
        <div className={`
        ${isDarkMode ? 'text-neutrals-50' : 'text-neutrals-900 '}
        ${isDarkMode ? (!props?.isActive ? 'hover:text-neutrals-900' : '') : ' '}
        ${props?.isActive ? (isDarkMode ? 'bg-darkGrey-2C2C' : 'bg-semantics-green03') : '' }
        hover:${!props?.isActive ? 'bg-neutrals-200' : ''} transition-all duration-150  
        rounded-[12px] pr-[16px] py-[12px] flex flex-auto gap-x-[13px] justify-center items-center hover:cursor-pointer`}>
            <div
                className={`w-[3px] ${props?.isActive ? 'lineActive h-[24px] bg-lineActive rounded-[100px]' : ''}`}></div>
            <div className={'flex-1 flex gap-x-[16px]'}>
                <div>
                    {props?.icon ? props.icon : null}
                </div>
                <div className={` ${(props.isActive ? (!isDarkMode ? 'text-semantics-green01' : ' ') : '')} `}>{props.name}</div>
            </div>
            <div className={'flex-0'}>
                {props?.hasChildren ? (
                    props?.isOpen ? (<IconArrowButton isActive={props.isActive || false}/>) : (<IconArrowRight isActive={props.isActive || false}/>)
                ) : null}
            </div>
        </div>
    );
};

export default MenuItem;