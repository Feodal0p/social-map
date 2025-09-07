import Map from '@components/Map.jsx';
import axios from '@plugin/axios';
import { useContext, useEffect, useState } from 'react';
import { AppContext } from '@context/AppContext.jsx';

export default function EventsMap() {

    const { user } = useContext(AppContext)

    const [events, setEvents] = useState([]);

    const [createEventCoords, setCreateEventCoords] = useState(null);
    const [eventAddress, setEventAddress] = useState('');

    useEffect(() => {
        const getEvents = async () => {
            await axios.get('/events').then((res) => {
                setEvents(res.data.data);
            });
        }

        getEvents();

    }, []);

    return (
        <>
            <Map
                events={events}
                roles={user?.roles}
                createEventCoords={createEventCoords}
                setCreateEventCoords={setCreateEventCoords}
                setEventAddress={setEventAddress} />
            {createEventCoords && (
                <div className="create-event-popup">
                    <button>Create Event</button>
                    <p>{eventAddress}</p>
                </div>
            )}
        </>
    );
}
