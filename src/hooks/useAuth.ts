import {useState} from "react";
import Cookies from "js-cookie";
import {COOKIE_ITEMS} from "../constants";
import {clearToken} from "../utils";

const useAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(!!Cookies.get(COOKIE_ITEMS.AUTH_TOKEN));
    // const [isAuthenticated, setIsAuthenticated] = useState(false);
    const login = async  () => {
        return new Promise<boolean>(
            (resolve) => {
                    setIsAuthenticated(true);
                    resolve(true);
            }
        )
    }
    const logout = () => {
        // Cookies.remove(COOKIE_ITEMS.AUTH_TOKEN);
        clearToken();
        return setIsAuthenticated(false);
    };
    const getToken = () => Cookies.get(COOKIE_ITEMS.AUTH_TOKEN);
    return {isAuthenticated, login, logout, getToken}
}
export default useAuth;