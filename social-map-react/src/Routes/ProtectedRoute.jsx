import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AppContext } from "../Context/AppContext";

export default function ProtectedRoute({ children }) {

    const { user, loading } = useContext(AppContext);

    if (loading) return <div>Loading...</div>;

    return user ? children : <Navigate to="/login" />;
}
