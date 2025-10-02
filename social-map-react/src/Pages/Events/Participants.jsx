import { useEffect, useState } from "react"
import axios from "@plugin/axios"
import { useParams, useNavigate } from "react-router-dom";
import Loader from "@components/Loader";
import EventParticipants from "@components/EventsMap/EventParticipants";

export default function Participants() {

    const { id } = useParams();
    const navigate = useNavigate();
    const [participants, setParticipants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        async function getParticipants() {
            await axios.get(`/events/${id}/participants`).then(res => {
                setParticipants(res.data)
            }
            ).catch(err => setError(
                ['Something went wrong.', err.message])
            ).finally(() => setLoading(false));
        }
        getParticipants();
    }, [id]);

    if (loading) return <Loader />;
    if (error) return <h1>{error[0]}</h1>;

    return (
        <div className="event-participants-page">
            <div className="event-header">
                <div className="event-header-buttons header-participants">
                    <button className="btn-back" onClick={() => navigate(-1)}>
                        Назад
                    </button>
                </div>
                <h1>Event Participants</h1>
            </div>
            {participants && <EventParticipants participants={participants} />}
        </div>
    )
}
