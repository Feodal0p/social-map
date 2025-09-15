import axios from "../Plugin/axios.js";
import { AppContext } from "./AppContext";
import useAuth from "../Hooks/useAuth.js";
import { useEffect, useState } from "react";


export default function AppProvider({ children }) {

    const { user: initialUser, loading: initialLoading } = useAuth();
    const [user, setUser] = useState(initialUser);
    const [loading, setLoading] = useState(initialLoading);
    const [filterOpen, setFilterOpen] = useState(false);

    const refreshUser = async () => {
        const res = await axios.get('/user');
        setUser(res.data.data);
    }

    const logout = async () => {
        await axios.post('/logout');
        setUser(null);
    }

    useEffect(() => {
        setUser(initialUser);
        setLoading(initialLoading);
    }, [initialUser, initialLoading]);

    return (
        <AppContext.Provider value={{
            user, loading, refreshUser, logout,
            filterOpen, setFilterOpen
        }}>
            {children}
        </AppContext.Provider>
    )
}
