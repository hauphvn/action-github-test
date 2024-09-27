import {useNavigate} from "react-router-dom";
import {ROUTES_PATH} from "../../constants";
import useAuth from "../../hooks/useAuth.ts";
import {IconDarkTheme, IconLightTheme, IconLogout} from "../../assets/svgs/SVGIcon.tsx";
import {useState} from "react";
import {useTheme} from "../../context/ThemeContext.tsx";

const Logout = () => {
    const navigate = useNavigate();
    const {logout} = useAuth();
    const {isDarkMode, toggleTheme} = useTheme();
    const [theme, setTheme] = useState(isDarkMode ? 'dark' : 'light');
    const handleLogout = async () => {
        logout();
        navigate(ROUTES_PATH.LOGIN);
    }
    const onHandleChangeTheme = (theme: string) => {
        setTheme(theme);
        toggleTheme();
    }
    return (
        <div className={`flex flex-col gap-y-[24px] pb-10 `}>
            <div onClick={handleLogout}
                 className={`${isDarkMode ? ' text-neutrals-400 hover:bg-neutrals-200 hover:text-neutrals-900' : 'text-neutrals-700 hover:bg-neutrals-300'} rounded-[8px] h-[48px] btnLogout px-[12px] py-[16px] hover:cursor-pointer flex gap-x-[16px] items-center`}>
                <IconLogout isDarkMode={isDarkMode}/>
                <div className={` text-[18px] font-[500] `}>Đăng xuất</div>
            </div>
            <div className={`theme-container w-full rounded-[8px] grid grid-cols-2 justify-center items-center h-[37px] ${isDarkMode  ? 'bg-darkGrey-3333' : 'bg-neutrals-50'}`}>
                <div onClick={() => isDarkMode ?  onHandleChangeTheme('light') : null } className={` h-[35px]  ${isDarkMode ? 'hover:cursor-pointer' : 'hover:cursor-default'} ${theme === 'light' ? 'shadow-light-2' : ''} col-span-1  overflow-hidden rounded-[8px] flex justify-center items-center`}>
                    <IconLightTheme isActive={!isDarkMode}/>
                </div>
                <div onClick={() => !isDarkMode ?  onHandleChangeTheme('dark') : null } className={` ${!isDarkMode ? 'hover:cursor-pointer' : 'hover:cursor-default'} h-[35px] ${theme === 'dark' ? 'shadow-light-2' : ''} col-span-1 overflow-hidden rounded-[8px] flex justify-center items-center ${isDarkMode ? 'bg-darkGrey-2C2C' : 'bg-neutrals-200'}`}>
                    <IconDarkTheme isActive={isDarkMode}/>
                </div>
            </div>
        </div>
    );
};

export default Logout;