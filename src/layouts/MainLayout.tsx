import React from "react";
import LeftMenu from "../components/LeftMenu";
import Logout from "../components/Logout";
import {useTheme} from "../context/ThemeContext.tsx";

interface Props {
    children?: React.ReactNode
}

const MainLayout = ({children}: Props) => {
    const {isDarkMode} = useTheme();
    return (
        <div className={`${isDarkMode ? 'bg-darkGrey-3838' : ''} min-h-screen flex flex-auto pl-8 `}>
            <aside
                className={`${isDarkMode ? 'border-r-darkGrey-2727' : 'border-r-neutrals-300'} max-w-[304px]  border-r-[1px] justify-between flex flex-auto flex-col pr-[24px] pt-[40px]`}>
                <div className={'flex-2'}>
                    <LeftMenu/>
                </div>
                <div className={'flex-0'}>
                    <Logout/>
                </div>
            </aside>
            <main className={'flex-1'}>{children}</main>
        </div>
    );
};

export default MainLayout;