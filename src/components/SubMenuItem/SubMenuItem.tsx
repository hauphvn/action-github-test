import {ReactNode} from "react";
// import {IconLineSubMenu} from "../../assets/svgs/SVGIcon.tsx";

interface SubMenuItemProps {
    hasChildren?: boolean,
    name: string,
    icon?: ReactNode,
    isActive?: boolean,
    isOpen?: boolean
}

const SubMenuItem = (props: SubMenuItemProps) => {
    return (
        <div className={' sub-item-manage-menu-left hover:cursor-pointer h-[64px] w-[231px] relative flex items-end justify-end'}>
            {/*<div className={'absolute left-[-2px] bottom-[24px]'}>*/}
            {/*    <IconLineSubMenu/>*/}
            {/*</div>*/}
            <div className={'absolute sub-item-manage-menu-left-line'}></div>
            <div
                className={'z-10 rounded-[12px] w-[210px] h-[48px] py-[12px] pl-[16px] bg-background text-neutrals-700 hover:bg-neutrals-200 hover:text-semantics-grey01 '}>
                {props?.name}
            </div>
        </div>
    );
};

export default SubMenuItem;