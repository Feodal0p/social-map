import useAuth from "../Hooks/useAuth";
import { Navigate } from "react-router-dom";

export default function GuestRoute({ children }) {

    const { user, loading } = useAuth();

    if (loading) return <div>Loading...</div>;

    return !user ? children : <Navigate to="/profile" />;
}
