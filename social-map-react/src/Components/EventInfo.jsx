export default function EventInfo({ status }) {
    return (
        <div className="event-info">
            <span className={`event-status event-status-${status}`}>
                {status}
            </span>
        </div>
    );
}
