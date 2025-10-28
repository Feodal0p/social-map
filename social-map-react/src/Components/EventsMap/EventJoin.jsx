import { AppContext } from '@context/AppContext.jsx';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import axios from '@plugin/axios';

export default function EventJoin({ event, setSelectedEvent }) {

    const { user } = useContext(AppContext)

    async function handleJoinEvent() {
        if (!event.permissions.can_join) {
            if (!window.confirm('Ви впевнені, що хочете покинути подію?')) return;
        };
        await axios.post(`/events/${event.id}/join`).then((res) => {
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
            {event.status === 'finished' || event.status === 'canceled' ? (
                <>
                    <p>Ця подія вже завершена або скасована</p>
                    {!event.permissions.can_join && !event.permissions.check_creator && user && (
                        <p>Ви були учасником цієї події</p>
                    )}
                    {event.permissions.check_creator && user && (
                        <p>Ви були організатором цієї події</p>
                    )}
                </>
            ) : (!user ? (
                <p>Щоб брати участь у події, будь ласка, <Link to="/login">увійдіть</Link> або <Link to="/register">зареєструйтесь</Link>.</p>
            ) : (event.permissions.check_creator ? (
                <p>Ви є організатором цієї події, тому уже берете участь</p>
            ) : (event.permissions.can_join ? (
                <button className='event-join-button' onClick={handleJoinEvent}>Взяти участь у події</button>
            ) : (
                <>
                    <p>Ви вже є учасником цієї події</p>
                    <button className='event-unjoin-button' onClick={handleJoinEvent}>Вийти з події</button>
                </>
            ))))}
        </>
    )
}