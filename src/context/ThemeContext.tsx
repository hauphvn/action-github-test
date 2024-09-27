import {createContext, ReactNode, useContext, useEffect, useState} from "react";
import Cookies from "js-cookie";
import {COOKIE_ITEMS} from "../constants";
interface ThemeContextProps{
    isDarkMode: boolean;
    toggleTheme: () => 'light'|'dark';
}
const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);
export const ThemeProvider = ({children}:{children: ReactNode}) => {
    const [isDarkMode, setIsDarkMode] = useState(false);
    useEffect(() => {
        const savedTheme = Cookies.get(COOKIE_ITEMS.THEME);
        if(savedTheme) {
            setIsDarkMode(savedTheme === 'dark');
        }
    }, []);

    const toggleTheme = (): 'light'|'dark' => {
        const newTheme = isDarkMode ? 'light' : 'dark';
        setIsDarkMode(!isDarkMode);
        Cookies.set(COOKIE_ITEMS.THEME, newTheme);
        return newTheme;
    }
    return (
        <ThemeContext.Provider value={{isDarkMode, toggleTheme}}>
            {children}
        </ThemeContext.Provider>
    );
}
export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}