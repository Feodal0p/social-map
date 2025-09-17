import { Link } from "react-router-dom";

export default function EventParticipants({ participants }) {
    return (
        <>
            <h1>List of participants:</h1>
            <ul className="participants-list">
                <li className="participant-card">
                    <Link to={`/profile/${participants.creator.profile_id}`}>
                        <img src={participants.creator.profile_avatar} alt={participants.creator.name}
                            className="participant-avatar" />
                        {participants.creator.name}
                    </Link>
                    <span>Creator</span>
                </li>
                {participants.participants.map(participant => (
                    <li key={participant.id} className="participant-card">
                        <Link to={`/profile/${participant.profile_id}`}>
                            <img src={participant.profile_avatar} alt={participant.name}
                                className="participant-avatar" />
                            {participant.name}
                        </Link>
                        <span>Participant</span>
                    </li>
                ))}
            </ul>
        </>
    );
}
