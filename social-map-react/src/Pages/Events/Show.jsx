import { useEffect, useState } from "react"
import axios from "@plugin/axios"
import { useParams, Link, useNavigate } from "react-router-dom";
import Loader from "@components/Loader";
import { categoryColors, statusColors } from "@constants/EventColors";
import EventJoin from "@components/EventsMap/EventJoin";
import EventCommentsForm from '@components/EventsMap/EventCommentsForm.jsx';
import EventCommentsList from '@components/EventsMap/EventCommentsList.jsx';

export default function Show() {

    const { id } = useParams();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const [comments, setComments] = useState([]);

    useEffect(() => {
        setLoading(true);
        async function getEvent() {
            await axios.get(`/events/${id}`).then(res => {
                setEvent(res.data.data)
                axios.get(`/event/${id}/comments`).then(res => {
                    setComments(res.data.comments);
                }).catch(err => setError(
                    ['Failed to load comments.', err.message])
                );
            }
            ).catch(err => setError(
                ['Event not found or something went wrong.', err.message])
            ).finally(() => setLoading(false));
        }
        getEvent();
    }, [id]);

    return (
        <>
            {loading ? <Loader /> : (
                <>
                    {event ? (
                        <>
                            <div className="event-header">
                                <div className="event-header-buttons">
                                    <button className="btn-back btn-special-left" onClick={() => navigate(-1)}>
                                        Назад
                                    </button>
                                    <Link to={`/map?event=${event.id}&status=all`}
                                        className="btn-to-the-map btn-special-right">На Мапі</Link>
                                </div>
                                <h1>{event.title}
                                    <span className="event-timestamp">
                                        created at: {new Date(event.created_at).toLocaleString()}
                                    </span>
                                </h1>
                            </div>
                            <div className="event-full">
                                <img src={event.preview_image} alt={event.title}
                                    className="event-preview" />
                                <div className="event-details">
                                    <div className="event-detail-item">
                                        <strong>Created by:</strong>
                                        <Link to={`/profile/${event.creator.profile_id}`} className="event-creator-link">
                                            <img src={event.creator.profile_avatar} alt={event.creator.name}
                                                className="event-creator-avatar" />
                                            <span>{event.creator.name}</span>
                                        </Link>
                                    </div>
                                    <div className="event-detail-item">
                                        <strong>Status & Categories:</strong>
                                        <div className="event-categories">
                                            <p className={`event-category ${statusColors[event.status]}`}>
                                                {event.status}
                                            </p>
                                            {event.categories ? event.categories.map((category) => (
                                                <p key={category.id} className={`event-category ${categoryColors[category.name]}`}>
                                                    {category.name}
                                                </p>
                                            )) : (<p>No categories</p>)}
                                        </div>
                                    </div>
                                    {event.description && (
                                        <div className="event-detail-item">
                                            <strong>Description:</strong>
                                            <p>{event.description}</p>
                                        </div>
                                    )}
                                    <div className="event-detail-item">
                                        <strong>Location:</strong>
                                        <p>{event.location}</p>
                                    </div>
                                    <div className="event-detail-item">
                                        <strong>Date & Time:</strong>
                                        <p>{event.start_time} - {event.end_time}</p>
                                    </div>
                                    <div className="event-detail-item event-buttons">
                                        <div className="event-participants">
                                            <strong>Participants count: {event.participants_count}</strong>
                                            <Link className="event-participants-link">List of Participants</Link>
                                        </div>
                                        <div className="event-participants-join">
                                            <EventJoin event={event} setSelectedEvent={setEvent} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="event-comments">
                                <div className="event-add-comments">
                                    <EventCommentsForm can_join={event.permissions.can_join}
                                        event={event}
                                        setEventComments={setComments}
                                        eventComments={comments} />
                                </div>
                                <div className="event-comments-list">
                                    <EventCommentsList comments={comments} />
                                </div>
                            </div>
                        </>
                    ) : (
                        <h1>{error[0]}</h1>
                    )}
                </>
            )}
        </>
    )
}