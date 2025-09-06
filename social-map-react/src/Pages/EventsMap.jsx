import Map from '@components/Map.jsx';
import axios from '@plugin/axios';
import { useContext, useEffect, useState } from 'react';
import { AppContext } from '@context/AppContext.jsx';

export default function EventsMap() {

    const { user } = useContext(AppContext)

    const [events, setEvents] = useState([]);

    useEffect(() => {
        const getEvents = async () => {
            await axios.get('/events').then((res) => {
                setEvents(res.data.data);
            });
        }

        getEvents();

    }, []);

    return (
        <Map events={events} roles={user?.roles} />
    );
}
