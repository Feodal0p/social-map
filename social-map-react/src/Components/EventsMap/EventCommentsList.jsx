import { Link } from 'react-router-dom';

export default function EventCommentsList({ comments }) {
    return (
        <>
            <p className='event-sidebar-label'>Коментарі користувачів:</p>
            {comments.length === 0 ? (
                <p>Поки що немає коментарів. Будьте першим, хто залишить коментар!</p>
            ) : (
                <ul className='event-sidebar-comments-list'>
                    {comments.map(comment => (
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
        </>
    )
}