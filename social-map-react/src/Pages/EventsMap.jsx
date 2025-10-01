import Map from '@components/EventsMap/Map.jsx';
import EventForm from '@components/EventsMap/EventForm.jsx';
import EventInfo from '@components/EventsMap/EventInfo.jsx';
import EventFilters from '@components/EventsMap/EventFilters.jsx';
import EventParticipants from '@components/EventsMap/EventParticipants.jsx';
import axios from '@plugin/axios';
import { useContext, useEffect, useState } from 'react';
import { AppContext } from '@context/AppContext.jsx';
import { Link, useNavigate } from 'react-router-dom';
import EventJoin from "@components/EventsMap/EventJoin";

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
    const [selectedRadius, setSelectedRadius] = useState(null);
    const [dateFrom, setDateFrom] = useState(null);
    const [dateTo, setDateTo] = useState(null);

    const [participants, setParticipants] = useState([]);
    const [eventComments, setEventComments] = useState([]);
    const [newComment, setNewComment] = useState({
        message: '',
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState({});

    const [myLocation, setMyLocation] = useState(null);
    const [zoomToMyLocation, setZoomToMyLocation] = useState(false);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const statusParam = params.get('status');
        const categoryParam = params.get('categories');
        const radiusParam = params.get('radius');
        const dateFromParam = params.get('date_from');
        const dateToParam = params.get('date_to');
        setSelectedStatus(!statusParam ? ['upcoming'] : statusParam === 'all' ? [] : statusParam.split(','));
        setSelectedCategories(!categoryParam ? [] : categoryParam.split(','));
        setSelectedRadius(radiusParam || 30);
        setDateFrom(dateFromParam || '');
        setDateTo(dateToParam || '');
    }, []);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        (!selectedStatus ||
            (selectedStatus.length === 0 || selectedStatus.length === 4))
            ? params.set('status', 'all') : params.set('status', selectedStatus);
        (!selectedCategories ||
            (selectedCategories.length === 0 || selectedCategories.length === 10))
            ? params.delete('categories') : params.set('categories', selectedCategories);
        (!selectedRadius || Number(selectedRadius) === 30)
            ? params.delete('radius') : params.set('radius', selectedRadius);
        (dateFrom ? params.set('date_from', dateFrom) : params.delete('date_from'));
        (dateTo ? params.set('date_to', dateTo) : params.delete('date_to'));
        navigate({ search: params.toString() });
    }, [selectedStatus, selectedCategories, selectedRadius, dateFrom, dateTo, navigate]);

    useEffect(() => {
        if (selectedStatus[0] === null || myLocation === null) { return; }
        setLoading(true);
        const statusParam = (selectedStatus.length !== 0 && selectedStatus.length !== 4)
            ? selectedStatus.join(',') : 'all';
        const categoryParam = (selectedCategories.length !== 0 && selectedCategories.length !== 10)
            ? selectedCategories.join(',') : 'all';
        const radiusParam = (Number(selectedRadius) !== 30) ? selectedRadius : 'all';
        const dateFromParam = dateFrom ? dateFrom : 'all';
        const dateToParam = dateTo ? dateTo : 'all';
        const getEvents = async () => {
            await axios.get('/events', {
                params: {
                    status: statusParam,
                    categories: categoryParam,
                    coords: myLocation ? myLocation.join(',') : '',
                    radius: radiusParam,
                    date_from: dateFromParam,
                    date_to: dateToParam,
                }
            }).then((res) => {
                setEvents(res.data.data);
            }).finally(() => setLoading(false));
        }
        getEvents();

    }, [selectedStatus, selectedCategories, myLocation, selectedRadius, dateFrom, dateTo]);

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

    async function getEvent(id, distance) {
        await axios.get(`/events/${id}`).then((res) => {
            axios.get(`/event/${id}/comments`).then((commentsRes) => {
                setSelectedEvent({ ...res.data.data, distance });
                setEventComments(commentsRes.data.comments);
            }).finally(() => setLoading(false));
        });
        setSidebarMode('view');
        setShowSidebar(true);
    }

    function handleSelectEvent(event) {
        setLoading(true);
        const params = new URLSearchParams(location.search);
        params.set('event', event.id);
        params.delete('sidebar');
        navigate({ search: params.toString() });
        getEvent(event.id, event.distance);
    }

    useEffect(() => {
        setLoading(true);
        const params = new URLSearchParams(window.location.search);
        const eventId = params.get('event');
        const sidebarParam = params.get('sidebar');
        if (eventId && events.length) {
            const event = events.find(e => e.id === parseInt(eventId));
            if (!event) return;
            getEvent(event.id, event.distance);
            if (sidebarParam) {
                getParticipants(event.id);
            }
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
        params.delete('sidebar');
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

    async function getParticipants(id) {
        await axios.get(`/events/${id}/participants`).then((res) => {
            setParticipants(res.data);
        }).finally(() => setLoading(false));
        setSidebarMode('participants');
        setShowSidebar(true);
    }

    function handleParticipantsClick() {
        setLoading(true);
        const params = new URLSearchParams(location.search);
        params.set('sidebar', 'participants');
        navigate({ search: params.toString() });
        getParticipants(selectedEvent.id);
    }

    async function handleCreateComment(e) {
        e.preventDefault();
        if (!selectedEvent) return;
        await axios.post(`/event/${selectedEvent.id}/comments`, newComment).then((res) => {
            setEventComments([res.data.comment, ...eventComments]);
            setNewComment({ message: '' });
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
                sidebarMode={sidebarMode}
                setShowSidebar={setShowSidebar}
                onSelectEvent={handleSelectEvent}
                handleSidebarClose={handleSidebarClose}
                setError={setError}
                myLocation={myLocation}
                setMyLocation={setMyLocation}
                zoomToMyLocation={zoomToMyLocation}
                setZoomToMyLocation={setZoomToMyLocation}
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
                                        <EventInfo status={selectedEvent.status} categories={selectedEvent.categories}
                                            distance={selectedEvent.distance} />
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
                                            <button className='event-participants-button' onClick={handleParticipantsClick}>Переглянути список учасників</button>
                                            <EventJoin event={selectedEvent} setSelectedEvent={setSelectedEvent} />
                                        </div>
                                        <div>
                                            {!user || selectedEvent.permissions.can_join ? (
                                                <p className='event-sidebar-label'>Щоб залишити коментар, потрібно бути учасником події.</p>
                                            ) : (
                                                <>
                                                    <p className='event-sidebar-label'>Залишити коментар:</p>
                                                    <form className='event-comment-form' onSubmit={handleCreateComment}>
                                                        <textarea rows={4} placeholder='Ваш коментар...'
                                                            value={newComment.message}
                                                            onChange={(e) => setNewComment({ ...newComment, message: e.target.value })} />
                                                        {error && error.message && <div className="error">{error.message}</div>}
                                                        <button type='submit' className='event-comment-submit-button'>Відправити</button>
                                                    </form>
                                                </>
                                            )}
                                            <p className='event-sidebar-label'>Коментарі користувачів:</p>
                                            {eventComments.length === 0 ? (
                                                <p>Поки що немає коментарів. Будьте першим, хто залишить коментар!</p>
                                            ) : (
                                                <ul className='event-comments-list' lazy="load">
                                                    {eventComments.map(comment => (
                                                        <li className='comment-card' key={comment.id}>
                                                            <Link to={`/profile/${comment.user.profile_id}`} className='comment-avatar'>
                                                                <img src={comment.user.profile_avatar} alt={comment.user.name} />
                                                            </Link>
                                                            <div className='comment-content'>
                                                                <div className='comment-header'>
                                                                    <Link to={`/profile/${comment.user.profile_id}`} className='comment-username'>
                                                                        <p>{comment.user.name}</p>
                                                                    </Link>
                                                                    <span className='comment-timestamp'>{new Date(comment.created_at).toLocaleString()}</span>
                                                                </div>
                                                                <p className='comment-message'>{comment.message}</p>
                                                            </div>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
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
                                    selectedRadius={selectedRadius}
                                    setSelectedRadius={setSelectedRadius}
                                    myLocation={myLocation}
                                    dateFrom={dateFrom}
                                    setDateFrom={setDateFrom}
                                    dateTo={dateTo}
                                    setDateTo={setDateTo}
                                />
                            </>
                        )}
                        {sidebarMode && sidebarMode === 'participants' && (
                            <>
                                {loading ? (<p>Loading...</p>) : (
                                    <>
                                        <button onClick={() => setSidebarMode('view')} className='event-back-button'>Назад</button>
                                        <EventParticipants
                                            participants={participants}
                                        />
                                    </>
                                )}
                            </>
                        )}
                    </div>
                </div>
            )}
            {error.geolocation ? (
                <div className="error-geolocation">
                    <p>{error.geolocation}</p>
                    <button onClick={() => setError(prev => ({ ...prev, geolocation: null }))}>Закрити</button>
                </div>
            ) : myLocation && (
                <button onClick={() => {
                    setZoomToMyLocation(true);
                }} className='my-location'>
                    Моя геолокація
                </button>
            )}
        </>
    );
}