import { useEffect, useState } from "react"
import axios from "@plugin/axios"
import Loader from "@components/Loader.jsx"
import { Link } from "react-router-dom"
import { statusColors, categoryColors } from '@constants/EventColors';

export default function Index() {

    const [events, setEvents] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        setLoading(true)
        async function getEvents() {
            await axios.get('events/my-history-events').then(res => {
                setEvents(res.data.data)
            }
            ).catch(err => {
                setError(["Something went wrong. Please try again later.", err.message])
            })
                .finally(() => {
                    setLoading(false)
                })
        }
        getEvents()
    }, [])

    return (
        <div className="page">
            {loading ? <Loader /> : (
                <div className="my-events-page">
                    {error ? (<h1>{error[0]}</h1>) : (
                        <>
                            <h1>My History Events</h1>
                            {events.length === 0 ? (
                                <div className="no-events">
                                    <p>Немає історії подій.</p>
                                    <Link to="/map" className="nav-link">Приєднуйтесь до нових подій!</Link>
                                </div>
                            ) : (
                                <ul className="events-container">
                                    {events && events.map((event) => (
                                        <li className="event-card" key={event.id}>
                                            <Link to={`/events/${event.id}`}>
                                                <p className={`event-card-status ${statusColors[event.status]}`}>
                                                    {event.status}
                                                </p>
                                                <img src={event.preview_image} alt={event.title} />
                                                <h2>{event.title}</h2>
                                                <p>{event.start_time} - {event.end_time}</p>
                                                <div className="event-card-categories">
                                                    {event.categories && event.categories.map(cat => (
                                                        <span key={cat.id}
                                                            className={`event-card-category ${categoryColors[cat.name]}`}>
                                                            {cat.name}
                                                        </span>
                                                    ))}
                                                </div>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </>
                    )}
                </div>
            )}
        </div>
    )
}
