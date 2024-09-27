import React from "react";
import useAuth from "../../hooks/useAuth.ts";
import {Navigate} from "react-router-dom";
import {ROUTES_PATH} from "../../constants/Path.ts";

interface Props {
    children: React.ReactNode;
}

const ProtectedRoute = ({children}: Props) => {
    const {isAuthenticated} = useAuth();
    const isVerified = isAuthenticated || localStorage.getItem("isAuthenticated") || sessionStorage.getItem("isAuthenticated");
    if (!isVerified) {
        return <Navigate to={ROUTES_PATH.LOGIN} replace/>
    }
    return children;
}
export default ProtectedRoute;