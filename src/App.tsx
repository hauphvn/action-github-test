import './App.css'
import './assets/fonts/fonts.css';
import {Route, Routes} from "react-router-dom";
import {ROUTES_PATH} from "./constants";
import Login from "./pages/Login";
import MainLayout from "./layouts";
import Dashboard from "./pages/Dashboard";
import Product from "./pages/Product";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute.tsx";
import Article from "./pages/Article";
import Store from "./pages/Store";
import {useEffect, useState} from "react";
import Logo from '../src/assets/imgs/left-logo.png';
import Notfound from "./pages/Notfound";
import {ThemeProvider, useTheme} from "./context/ThemeContext.tsx";

const App = () => {
    return (
        <ThemeProvider>
            <MainComponent/>
        </ThemeProvider>
    )
}
function MainComponent() {
    const [isMobile, setIsMobile] = useState(false);
    const {isDarkMode} = useTheme();
    useEffect(() => {
        const checkMobileDevice = () => {
        }
        const userAgent = navigator.userAgent;
        const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
            userAgent
        );
        setIsMobile(isMobileDevice);
        checkMobileDevice();
    }, []);
    return (
        <>
            {isMobile ? (
                <div
                    className={` ${isDarkMode ? 'dark' : 'light'} fixed top-0 left-0 w-full h-full bg-gray-900 text-white flex flex-col items-center justify-center z-50`}>
                    <img src={Logo} alt={'logo'}/>
                    <div className="bg-gray-800 p-8 rounded-lg shadow-lg">
                        <h2 className="text-2xl font-bold mb-4 text-primary">
                            Xin lỗi, hệ thống không khả dụng cho thiết bị di động.
                        </h2>
                        <p className="mb-6">
                            Vui lòng sử dụng desktop hoặc laptop để có trải nghiệm tốt nhất!
                        </p>
                    </div>
                </div>
            ) : (
                <div className={'App w-screen'}>

                    <Routes>
                        <Route path={ROUTES_PATH.LOGIN} element={<Login/>}/>
                        <Route path={ROUTES_PATH.HOME} element={
                            <ProtectedRoute>
                                <MainLayout>
                                    <Dashboard/>
                                </MainLayout>
                            </ProtectedRoute>
                        }/>
                        <Route path={ROUTES_PATH.DASHBOARD} element={
                            <ProtectedRoute>
                                <MainLayout>
                                    <Dashboard/>
                                </MainLayout>
                            </ProtectedRoute>
                        }/>
                        <Route path={ROUTES_PATH.PRODUCT} element={
                            <ProtectedRoute>
                                <MainLayout>
                                    <Product/>
                                </MainLayout>
                            </ProtectedRoute>
                        }/>
                        <Route path={ROUTES_PATH.ARTICLE} element={
                            <ProtectedRoute>
                                <MainLayout>
                                    <Article/>
                                </MainLayout>
                            </ProtectedRoute>
                        }/>
                        <Route path={ROUTES_PATH.STORE} element={
                            <ProtectedRoute>
                                <MainLayout>
                                    <Store/>
                                </MainLayout>
                            </ProtectedRoute>
                        }/>
                        <Route path={'*'} element={
                            <ProtectedRoute>
                                <MainLayout>
                                    <Notfound/>
                                </MainLayout>
                            </ProtectedRoute>
                        }/>
                    </Routes>

                </div>
            )}
        </>
    )
}

export default App
