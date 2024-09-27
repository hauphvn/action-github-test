import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import {BrowserRouter} from "react-router-dom";
import {ConfigProvider} from "antd";
import {QueryClientProvider} from "@tanstack/react-query";
import {queryClient} from "./libs";
import {ReactQueryDevtools} from "@tanstack/react-query-devtools";

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: '#198B4D',
                    colorBgContainer: ''
                }
            }}
        >
            <QueryClientProvider client={queryClient}>
                <BrowserRouter>
                    <App/>
                    <ReactQueryDevtools initialIsOpen={false}/>
                </BrowserRouter>
            </QueryClientProvider>
        </ConfigProvider>
    </React.StrictMode>,
)
