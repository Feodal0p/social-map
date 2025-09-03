import axios from "../Plugin/axios.js";
import { AppContext } from "./AppContext";
import useAuth from "../Hooks/useAuth.js";
import { useEffect, useState } from "react";


export default function AppProvider({ children }) {

    const { user: initialUser, loading: initialLoading } = useAuth();
    const [user, setUser] = useState(initialUser);
    const [loading, setLoading] = useState(initialLoading);

    const refreshUser = async () => {
        const res = await axios.get('/user');
        setUser(res.data.data);
    }

    useEffect(() => {
        setUser(initialUser);
        setLoading(initialLoading);
    }, [initialUser, initialLoading]);

    return (
        <AppContext.Provider value={{ user, loading, refreshUser }}>
            {children}
        </AppContext.Provider>
    )
}
