import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AppContext } from "@context/AppContext";

export default function GuestRoute({ children }) {

    const { user, loading } = useContext(AppContext);

    if (loading) return <h1>Loading...</h1>;

    return !user ? children : <Navigate to={`/profile/${user.profile_id}`} />;
}
