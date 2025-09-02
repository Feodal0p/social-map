import axios from "../Plugin/axios.js";
import { useEffect, useState } from "react";

export default function useAuth() {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('/user')
        .then(res => setUser(res.data.data))
        .catch(() => setUser(null))
        .finally(() => setLoading(false));
    }, [])

    return { user, loading }
}
