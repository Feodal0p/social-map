import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AppContext } from "@context/AppContext";
import Loader from "../Components/Loader";

export default function ProtectedRoute({ children }) {

    const { user } = useContext(AppContext);

    return user ? children : <Navigate to="/login" />;
}
