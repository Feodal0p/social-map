import Map from '@components/Map.jsx';
import axios from '@plugin/axios';
import { useContext, useEffect, useState } from 'react';
import { AppContext } from '@context/AppContext.jsx';

export default function EventsMap() {

    const { user } = useContext(AppContext)

    const [events, setEvents] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        location: '',
        latitude: '',
        longitude: '',
        description: '',
        start_time: '',
        end_time: ''
    });

    const [createEventCoords, setCreateEventCoords] = useState(null);
    const [eventAddress, setEventAddress] = useState('');

    const [showSidebar, setShowSidebar] = useState(false);

    const [error, setError] = useState({});

    useEffect(() => {
        const getEvents = async () => {
            await axios.get('/events').then((res) => {
                setEvents(res.data.data);
            });
        }

        getEvents();

    }, []);

    async function handleCreate(e) {
        e.preventDefault();
        const payload = {
            ...formData,
            location: eventAddress,
            latitude: createEventCoords?.lat || '',
            longitude: createEventCoords?.lng || ''
        };
        await axios.post('/events', payload).then((res) => {
            setEvents([...events, res.data.data]);
            setFormData({
                title: '',
                location: '',
                latitude: '',
                longitude: '',
                description: '',
                start_time: '',
                end_time: ''
            });
            setCreateEventCoords(null);
            setEventAddress('');
            setShowSidebar(false);
            setError('');
        }).catch((err) => {
            if (err.response?.data?.errors) {
                setError(err.response.data.errors);
            } else if (err.response?.data?.message) {
                setError({ global: err.response.data.message });
            } else {
                setError({ global: 'Сталася невідома помилка' });
            }
        });
    }

    return (
        <>
            <Map
                events={events}
                roles={user?.roles}
                createEventCoords={createEventCoords}
                setCreateEventCoords={setCreateEventCoords}
                setEventAddress={setEventAddress}
                showSidebar={showSidebar}
                setShowSidebar={setShowSidebar} />
            {createEventCoords && !showSidebar && (
                <div className="create-event-popup">
                    <button
                        onClick={() => [setShowSidebar(true), setError('    ')]}>Create Event</button>
                    <p>{eventAddress}</p>
                </div>
            )}
            {showSidebar && (
                <div className="event-sidebar">
                    <div className='event-sidebar-header'>
                        <div>
                            <span>LOGO</span>
                            <span>Social Map</span>
                        </div>
                        <button onClick={() => setShowSidebar(false)}>X</button>
                    </div>
                    <div className="event-sidebar-content">
                        <h1>Create Event</h1>
                        {error && error.global && <div className="error">{error.global}</div>}
                        <form className='event-form-create' onSubmit={handleCreate}>
                            <label htmlFor="title">Title</label>
                            <input type="text" id="title" placeholder="Event Title"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
                            {error && error.title && <div className="error">{error.title[0]}</div>}
                            <label htmlFor="description">Description</label>
                            <textarea rows='5' id="description" placeholder="Event Description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}></textarea>
                            <label htmlFor="date-start">Date & Time start</label>
                            <input type="datetime-local" id="date-start"
                                value={formData.start_time}
                                onChange={(e) => setFormData({ ...formData, start_time: e.target.value })} />
                            {error && error.start_time && <div className="error">{error.start_time[0]}</div>}
                            <label htmlFor="date-end">Date & Time end</label>
                            <input type="datetime-local" id="date-end"
                                value={formData.end_time}
                                onChange={(e) => setFormData({ ...formData, end_time: e.target.value })} />
                            {error && error.end_time && <div className="error">{error.end_time[0]}</div>}
                            <label htmlFor="location">Location</label>
                            <textarea name='location' id="location" value={eventAddress} readOnly />
                            <button type="submit">Create Event</button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
