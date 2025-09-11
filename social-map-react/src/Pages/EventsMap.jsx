import Map from '@components/Map.jsx';
import EventForm from '@components/EventForm.jsx';
import EventInfo from '@components/EventInfo.jsx';
import axios from '@plugin/axios';
import { useContext, useEffect, useState } from 'react';
import { AppContext } from '@context/AppContext.jsx';
import { Link, useNavigate } from 'react-router-dom';

export default function EventsMap() {

    const { user } = useContext(AppContext)

    const navigate = useNavigate();

    const [events, setEvents] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        location: '',
        latitude: '',
        longitude: '',
        description: '',
        start_time: '',
        end_time: '',
        status: '',
        preview_image: '',
    });

    const [createEventCoords, setCreateEventCoords] = useState(null);
    const [eventAddress, setEventAddress] = useState('');

    const [showSidebar, setShowSidebar] = useState(false);
    const [sidebarMode, setSidebarMode] = useState('create');

    const [selectedEvent, setSelectedEvent] = useState(null);

    const [error, setError] = useState({});

    useEffect(() => {
        const getEvents = async () => {
            await axios.get('/events').then((res) => {
                setEvents(res.data.data);
            });
        }

        getEvents();

    }, []);

    const createFormData = (oldFormData) => {
            return Object.keys(oldFormData).reduce((newFormData, key) => {
                if (key === 'preview_image' && !(oldFormData[key] instanceof File)) {
                    newFormData.append(key, '');
                } else newFormData.append(key, oldFormData[key]);
                return newFormData;
            }, new FormData());
        }

    async function handleCreate(e) {
        e.preventDefault();
        const newFormData = createFormData(formData);
        await axios.post('/events', newFormData).then((res) => {
            setEvents([...events, res.data.data]);
            setCreateEventCoords(null);
            setEventAddress('');
            setShowSidebar(false);
            handleSelectEvent(res.data.data);
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

    function handleSelectEvent(event) {
        setSelectedEvent(event);
        setSidebarMode('view');
        setShowSidebar(true);
        navigate(`?event=${event.id}`)
    }

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const eventId = params.get('event');
        if (eventId && events.length) {
            const event = events.find(e => e.id === parseInt(eventId));
            if (!event) return;
            setSelectedEvent(event);
            setSidebarMode('view');
            setShowSidebar(true);
        }
    }, [events]);

    async function handleDelete() {
        if (!selectedEvent) return;
        if (!window.confirm('Ви впевнені, що хочете видалити цю подію?')) return;
        await axios.delete(`/events/${selectedEvent.id}`).then(() => {
            setEvents(events.filter(e => e.id !== selectedEvent.id));
            setSelectedEvent(null);
            setShowSidebar(false);
            navigate('', { replace: true });
        }).catch((err) => {
            if (err.response?.data?.message) {
                setError({ global: err.response.data.message });
            } else {
                setError({ global: 'Сталася невідома помилка' });
            }
        });
    }

    useEffect(() => {
        setError('');
        if (sidebarMode === 'edit' && selectedEvent) {
            setFormData({
                title: selectedEvent.title || '',
                location: selectedEvent.location || '',
                latitude: selectedEvent.latitude || '',
                longitude: selectedEvent.longitude || '',
                description: selectedEvent.description || '',
                start_time: selectedEvent.start_time ? selectedEvent.start_time.slice(0, 16) : '',
                end_time: selectedEvent.end_time ? selectedEvent.end_time.slice(0, 16) : '',
                status: '',
                preview_image: selectedEvent.preview_image || '',
            });
        } else if (sidebarMode === 'create') {
            setFormData({
                title: '',
                location: eventAddress || '',
                latitude: createEventCoords?.lat || '',
                longitude: createEventCoords?.lng || '',
                description: '',
                start_time: '',
                end_time: '',
                status: '',
                preview_image: '',
            });
        } else {
            setFormData({
                title: '',
                location: '',
                latitude: '',
                longitude: '',
                description: '',
                start_time: '',
                end_time: '',
                status: '',
                preview_image: '',
            });
        }
    }, [sidebarMode, selectedEvent, createEventCoords, eventAddress]);

    async function handleEdit(e) {
        e.preventDefault();
        if (!selectedEvent) return;
        const newFormData = createFormData(formData);
        newFormData.append('_method', 'PATCH');
        await axios.post(`/events/${selectedEvent.id}`, newFormData).then((res) => {
            setEvents(events.map(e => e.id === selectedEvent.id ? res.data.data : e));
            setSelectedEvent(res.data.data);
            setSidebarMode('view');
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

    async function handleCancel(eventId) {
        if (!eventId) return;
        if (!window.confirm('Ви впевнені, що хочете скасувати цю подію?')) return;
        await axios.post(`/events/${eventId}/cancel`).then((res) => {
            setEvents(events.map(e => e.id === eventId ? res.data.data : e));
            setSelectedEvent(res.data.data);
            setSidebarMode('view');
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
                events={events} roles={user?.roles}
                createEventCoords={createEventCoords}
                setCreateEventCoords={setCreateEventCoords}
                setEventAddress={setEventAddress}
                showSidebar={showSidebar}
                setShowSidebar={setShowSidebar}
                onSelectEvent={handleSelectEvent}
            />
            {createEventCoords && !showSidebar && (
                <div className="create-event-popup">
                    <button
                        onClick={() => { setShowSidebar(true); setError(''); setSidebarMode('create'); }}>Create Event</button>
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
                        <button onClick={() => { setShowSidebar(false); setCreateEventCoords(null); navigate('', { replace: true }); }}>X</button>
                    </div>
                    <div className="event-sidebar-content">
                        {sidebarMode && sidebarMode === 'create' && (
                            <>
                                <h1>Create Event</h1>
                                {error && error.global && <div className="error">{error.global}</div>}
                                <EventForm formData={formData}
                                    setFormData={setFormData}
                                    error={error}
                                    onSubmit={handleCreate} />
                            </>
                        )}
                        {sidebarMode && sidebarMode === 'view' && (
                            <>
                                {error && error.global && <div className="error">{error.global}</div>}
                                {selectedEvent.can_edit && (
                                    <div className='event-edit-links'>
                                        <button onClick={() => setSidebarMode('edit')} className='event-edit-button'>Редагувати</button>
                                        {selectedEvent?.status !== 'canceled' && selectedEvent?.status !== 'finished' && (
                                            <button onClick={() => handleCancel(selectedEvent.id)} className='event-cancel-button'>Скасувати подію</button>
                                        )}
                                        <button onClick={handleDelete} className='event-delete-button'>Видалити</button>
                                    </div>
                                )}
                                <EventInfo status={selectedEvent.status} />
                                {selectedEvent.preview_image && (
                                    <img src={selectedEvent.preview_image} alt="Event Preview" className='event-preview-image' />
                                )}
                                <h1>{selectedEvent.title}</h1>
                                <div className='event-time-creator'>
                                    <Link to={`/profile/${selectedEvent.creator.id}`} className='event-creator'>
                                        {`created by ${selectedEvent.creator.name}`}
                                    </Link>
                                    <div className='event-time'>
                                        <p>{"Початок: " + new Date(selectedEvent.start_time).toLocaleString()}</p>
                                        {selectedEvent.end_time && (
                                            <p>{"Кінець: " + new Date(selectedEvent.end_time).toLocaleString()}</p>
                                        )}
                                    </div>
                                </div>
                                <p className='event-sidebar-label'>Локація:</p>
                                <p>{selectedEvent.location}</p>
                                {selectedEvent.description && (
                                    <>
                                        <p className='event-sidebar-label'>Опис події:</p>
                                        <p>{selectedEvent.description}</p>
                                    </>
                                )}
                            </>
                        )}
                        {sidebarMode && sidebarMode === 'edit' && (
                            <>
                                <button onClick={() => setSidebarMode('view')} className='event-back-button'>Назад</button>
                                <h1>Edit Event</h1>
                                {error && error.global && <div className="error">{error.global}</div>}
                                <EventForm formData={formData}
                                    setFormData={setFormData}
                                    error={error}
                                    onSubmit={handleEdit} />
                            </>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}