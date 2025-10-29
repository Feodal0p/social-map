import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import axios from "@plugin/axios"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { statusColors, statusIcons, categoryColors, categoryIcons } from '@constants/EventColors';

library.add(fas);

export default function Home() {

    const [events, setEvents] = useState([])

    useEffect(() => {
        const getEvents = async () => {
            await axios.get('/events/latest').then(res => {
                setEvents(res.data.data)
            })
        }
        getEvents()
    }, [])

    return (
        <div className="page">
            <section className="hero">
                <h1>Почни змінювати своє <span>місто</span></h1>
                <p>LOGOSocial Map об’єднує людей для участі у волонтерських ініціативах, соціальних та громадських подіях. Долучайся, організовуй власні заходи, знайомся з однодумцями!</p>
                <div className="section-links">
                    <Link to=''>
                        <FontAwesomeIcon icon="fa-solid fa-circle-info" />
                        Дізнатися більше
                    </Link>
                </div>
            </section>
            <section className="map">
                <h1>Досліджуй своє місто</h1>
                <p>Відкривайте для себе місця, де можна допомогти, навчитися нового або просто провести час з користю. Усі події — на одній карті!</p>
                <img src="http://localhost:8000/storage/images/map.png" alt="map-preview" />
                <div className="section-links">
                    <Link to='/map'>
                        <FontAwesomeIcon icon="fa-solid fa-map-location-dot" />
                        Дослідити карту
                    </Link>
                </div>
            </section>
            <section className="latest-events">
                <h1>Нові події</h1>
                <div className="events-container">
                    {events && events.map((event) => (
                        <Link className="event-card" key={event.id}>
                            <span className={`status-badge ${statusColors[event.status]}`}>
                                <FontAwesomeIcon icon={statusIcons[event.status]} className="icon" />
                                {event.status}</span>
                            <span className="participants-badge">
                                <FontAwesomeIcon icon="fa-solid fa-user-group" className="icon" />
                                {event.participants_count}
                            </span>
                            <img src={event.preview_image} alt={event.title} />
                            <div className="event-card-content">
                                {console.log(event)}
                                {event.categories && (
                                    <div className="categories-container">
                                        {event.categories.map(cat => (
                                            <span key={cat.id}
                                                className={`category-badge ${categoryColors[cat.name]}`}>
                                                <FontAwesomeIcon icon={categoryIcons[cat.name]} className="icon" />
                                                {cat.name}
                                            </span>
                                        ))}
                                    </div>
                                )}
                                <h2>{event.title}</h2>
                                {event.description ? (
                                    <p>{event.description.length > 200 ?
                                        event.description.slice(0, 200) + '...' : event.description}</p>) :
                                    (<p>Опис відсутній</p>)
                                }
                            </div>
                            <div className="event-card-footer">
                                <span className="event-card-location">
                                    <FontAwesomeIcon icon="fa-solid fa-location-dot" className="icon" />
                                    {event.location.locality || 'Не вказано'}
                                </span>
                                <span className="event-card-date">
                                    <FontAwesomeIcon icon="fa-solid fa-calendar-days" className="icon" />
                                    {new Date(event.start_time).toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' })}
                                    {' '}
                                    {new Date(event.start_time).toLocaleDateString('uk-UA')}
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>
        </div>
    )
}