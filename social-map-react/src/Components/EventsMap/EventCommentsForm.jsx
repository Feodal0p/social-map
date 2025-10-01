import{ useContext, useState } from 'react'
import axios from '@plugin/axios'
import { AppContext } from '@context/AppContext'

export default function EventCommentsForm({ event, can_join, setEventComments, eventComments }) {

    const { user } = useContext(AppContext)
    const [error, setError] = useState(null);
    const [newComment, setNewComment] = useState({ message: '' });

    async function handleCreateComment(e) {
        e.preventDefault();
        if (!event) return;
        await axios.post(`/event/${event.id}/comments`, newComment).then((res) => {
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
            {!user || can_join ? (
                <p className='event-sidebar-label event-center'>Щоб залишити коментар, потрібно бути учасником події.</p>
            ) : (
                <>
                    <p className='event-sidebar-label'>Залишити коментар:</p>
                    <form className='event-comment-form' onSubmit={handleCreateComment}>
                        <textarea rows={4} placeholder='Ваш коментар...'
                            value={newComment.message}
                            onChange={(e) => setNewComment({ ...newComment, message: e.target.value })} />
                        {error && error.message && <div className="error">{error.message}</div>}
                        <button type='submit' className='event-comment-submit-button'>Добавити коментар</button>
                    </form>
                </>
            )
            }
        </>
    )
}