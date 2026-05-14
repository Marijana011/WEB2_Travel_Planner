import { Navigate } from "react-router-dom";

function ProtectedRoute({ children}){
    const token = localStorage.getItem("token");

    if(!token){
        return <Navigate to="/" />
    }

    try{
        const payload = JSON.parse(atob(token.split(".")[1]));
        const isExpired = payload.exp * 1000 < Date.now();

        if(isExpired){
            localStorage.removeItem("token");

            return <Navigate to="/" />;
        }
    }catch(error){
        localStorage.removeItem("token");

        return <Navigate to="/" />;
    }

    return children;
}

export default ProtectedRoute;