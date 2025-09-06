import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import axios from "@plugin/axios"

export default function Home() {

    const [events, setEvents] = useState([])

    useEffect(() => {
        const getEvents = async () => {
            await axios.get('/events/latest').then(res => {
                setEvents(res.data.data)
                console.log(res.data.data)
            })
        }
        getEvents()
    }, [])

    return (
        <>
            <div className="home-header">
                <div className="home-left">
                    <div>
                        <h1>Welcome to Social Map</h1>
                        <p>Your gateway to connecting with friends and exploring new places.</p>
                    </div>
                </div>
                <div className="home-right">
                    <Link to='/map'>
                        <img src="http://localhost:8000/storage/images/map.png" alt="map-preview" />
                        <span>Explore the Map</span>
                    </Link>
                </div>
            </div>
            <div className="home-latest-events">
                <h1>Latest Events</h1>
                <div className="events-container">
                    {events && events.map((event) => (
                        <div className="event-card" key={event.id}>
                            <h2>{event.title}</h2>
                            <p>{event.start_time + ", " + event.location}</p>
                            <p>{event.creator.name}</p>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}