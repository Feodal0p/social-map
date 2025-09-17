import Map from '@components/EventsMap/Map.jsx';
import EventForm from '@components/EventsMap/EventForm.jsx';
import EventInfo from '@components/EventsMap/EventInfo.jsx';
import EventFilters from '@components/EventsMap/EventFilters.jsx';
import axios from '@plugin/axios';
import { useContext, useEffect, useState } from 'react';
import { AppContext } from '@context/AppContext.jsx';
import { Link, useNavigate } from 'react-router-dom';

export default function EventsMap() {

    const { user, filterOpen, setFilterOpen } = useContext(AppContext)

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
        categories: [],
    });

    const [createEventCoords, setCreateEventCoords] = useState(null);
    const [eventAddress, setEventAddress] = useState('');

    const [showSidebar, setShowSidebar] = useState(false);
    const [sidebarMode, setSidebarMode] = useState('create');

    const [selectedEvent, setSelectedEvent] = useState(null);

    const [selectedStatus, setSelectedStatus] = useState([null]);
    const [selectedCategories, setSelectedCategories] = useState([null]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState({});

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const statusParam = params.get('status');
        const categoryParam = params.get('categories');
        if (!statusParam) {
            setSelectedStatus(['upcoming']);
        } else if (statusParam === 'all') {
            setSelectedStatus([]);
        } else {
            setSelectedStatus(statusParam.split(','));
        }

        if (!categoryParam) {
            setSelectedCategories([]);
        }
        else if (categoryParam === 'all') {
            setSelectedCategories([]);
        }
        else {
            setSelectedCategories(categoryParam.split(','));
        }
    }, []);


    useEffect(() => {
        const params = new URLSearchParams(location.search);
        if (selectedStatus) {
            if (selectedStatus.length === 0 || selectedStatus.length === 4) {
                params.set('status', 'all');
            } else {
                params.set('status', selectedStatus);
            }
        }
        if (selectedCategories) {
            if (selectedCategories.length === 0 || selectedCategories.length === 10) {
                params.set('categories', 'all');
            } else {
                params.set('categories', selectedCategories);
            }
        }
        navigate({ search: params.toString() });
    }, [selectedStatus, selectedCategories, navigate]);

    useEffect(() => {
        if (selectedStatus[0] === null || selectedCategories[0] === null) { return; }
        setLoading(true);
        const statusParam = (selectedStatus.length !== 0 && selectedStatus.length !== 4)
            ? selectedStatus.join(',') : 'all';
        const categoryParam = (selectedCategories.length !== 0 && selectedCategories.length !== 10)
            ? selectedCategories.join(',') : 'all';
        const getEvents = async () => {
            await axios.get(`/events?status=${statusParam}&categories=${categoryParam}`).then((res) => {
                setEvents(res.data.data);
            }).finally(() => setLoading(false));
        }
        getEvents();

    }, [selectedStatus, selectedCategories]);

    const createFormData = (oldFormData) => {
        return Object.keys(oldFormData).reduce((newFormData, key) => {
            if (key === 'preview_image' && !(oldFormData[key] instanceof File)) {
                newFormData.append(key, '');
            } else newFormData.append(key, oldFormData[key]);
            if (key === 'categories' && Array.isArray(oldFormData[key])) {
                oldFormData[key].forEach(category => {
                    newFormData.append('categories[]', category.id);
                });
            }
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

    function getEvent(id) {
        axios.get(`/events/${id}`).then((res) => {
            setSelectedEvent(res.data.data);
        }).finally(() => setLoading(false));
        setSidebarMode('view');
        setShowSidebar(true);
    }

    function handleSelectEvent(event) {
        setLoading(true);
        const params = new URLSearchParams(location.search);
        params.set('event', event.id);
        navigate({ search: params.toString() });
        getEvent(event.id);
    }

    useEffect(() => {
        setLoading(true);
        const params = new URLSearchParams(window.location.search);
        const eventId = params.get('event');
        if (eventId && events.length) {
            const event = events.find(e => e.id === parseInt(eventId));
            if (!event) return;
            getEvent(event.id);
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
                categories: selectedEvent.categories || [],
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
                categories: [],
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
                categories: [],
            });
        }
    }, [sidebarMode, selectedEvent, createEventCoords, eventAddress]);

    async function handleEdit(e) {
        e.preventDefault();
        setLoading(true);
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
        setLoading(true);
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

    function handleSidebarClose() {
        const params = new URLSearchParams(location.search);
        params.delete('event');
        navigate({ search: params.toString() }, { replace: true });
        setShowSidebar(false);
        setCreateEventCoords(null);
        setFilterOpen(false);
    }

    useEffect(() => {
        if (filterOpen) {
            setShowSidebar(true);
            setSidebarMode('filters');
            setCreateEventCoords(null);
        }
    }, [filterOpen]);

    function handleJoinEvent() {
        if (!selectedEvent.permissions.can_join) {
            if (!window.confirm('Ви впевнені, що хочете покинути подію?')) return;
        };
        axios.post(`/events/${selectedEvent.id}/join`).then((res) => {
            setSelectedEvent(prev => ({
                ...prev,
                participants_count: res.data.participants_count,
                permissions: {
                    ...prev.permissions,
                    can_join: res.data.can_join
                }
            }));
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
                sidebarMode={sidebarMode}
                setShowSidebar={setShowSidebar}
                onSelectEvent={handleSelectEvent}
                handleSidebarClose={handleSidebarClose}
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
                        <button onClick={() => {
                            handleSidebarClose();
                        }}>X</button>
                    </div>
                    <div className="event-sidebar-content">
                        {sidebarMode && sidebarMode === 'create' && (
                            <>
                                <EventForm formData={formData}
                                    setFormData={setFormData}
                                    error={error}
                                    onSubmit={handleCreate}
                                    mode={sidebarMode} />
                            </>
                        )}
                        {sidebarMode && sidebarMode === 'view' && (
                            <>
                                {loading ? (<p>Loading...</p>) : (
                                    <>
                                        {error && error.global && <div className="error">{error.global}</div>}
                                        {selectedEvent.permissions.can_edit && (
                                            <div className='event-edit-links'>
                                                <button onClick={() => setSidebarMode('edit')} className='event-edit-button'>Редагувати</button>
                                                {selectedEvent?.status !== 'canceled' && selectedEvent?.status !== 'finished' && (
                                                    <button onClick={() => handleCancel(selectedEvent.id)} className='event-cancel-button'>Скасувати подію</button>
                                                )}
                                                <button onClick={handleDelete} className='event-delete-button'>Видалити</button>
                                            </div>
                                        )}
                                        <EventInfo status={selectedEvent.status} categories={selectedEvent.categories} />
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
                                        <div className='event-join'>
                                            <p>Кількість учасників: {selectedEvent.participants_count}</p>
                                            {selectedEvent.status === 'finished' || selectedEvent.status === 'canceled' ? (
                                                <>
                                                <p>Ця подія вже завершена або скасована</p>
                                                {console.log(selectedEvent.permissions)}
                                                {!selectedEvent.permissions.can_join && !selectedEvent.permissions.check_creator && (
                                                    <p>Ви були учасником цієї події</p>
                                                )}
                                                {selectedEvent.permissions.check_creator && (
                                                    <p>Ви були організатором цієї події</p>
                                                )}
                                                </>  
                                            ) : (!user ? (
                                                <p>Щоб брати участь у події, будь ласка, <Link to="/login">увійдіть</Link> або <Link to="/register">зареєструйтесь</Link>.</p>
                                            ) : (selectedEvent.permissions.check_creator ? (
                                                <p>Ви є організатором цієї події, тому уже берете участь</p>
                                            ) : (selectedEvent.permissions.can_join ? (
                                                <button className='event-join-button' onClick={handleJoinEvent}>Взяти участь у події</button>
                                            ) : (
                                                <>
                                                    <p>Ви вже є учасником цієї події</p>
                                                    <button className='event-unjoin-button' onClick={handleJoinEvent}>Вийти з події</button>
                                                </>
                                            ))))}
                                        </div>
                                    </>
                                )}
                            </>
                        )}
                        {sidebarMode && sidebarMode === 'edit' && (
                            <>
                                <button onClick={() => setSidebarMode('view')} className='event-back-button'>Назад</button>
                                <EventForm formData={formData}
                                    setFormData={setFormData}
                                    error={error}
                                    onSubmit={handleEdit} />
                            </>
                        )}
                        {sidebarMode && sidebarMode === 'filters' && (
                            <>
                                <EventFilters
                                    selectedStatus={selectedStatus}
                                    setSelectedStatus={setSelectedStatus}
                                    selectedCategories={selectedCategories}
                                    setSelectedCategories={setSelectedCategories}
                                />
                            </>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}