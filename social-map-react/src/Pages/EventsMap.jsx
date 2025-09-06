import Map from '@components/Map.jsx';
import axios from '@plugin/axios';
import { useEffect, useState } from 'react';

export default function EventsMap() {

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
            <Map events={events} />
    );
}
