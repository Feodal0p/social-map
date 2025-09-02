import axios from "../Plugin/axios.js";
import { useEffect, useState } from "react";

export default function useAuth() {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('/user')
        .then(() => setUser(true))
        .catch(() => setUser(false))
        .finally(() => setLoading(false));
    }, [])

    return { user, loading }
}    
