import {statusColors, categoryColors} from '@constants/EventColors';

export default function EventInfo({ status, categories = [], distance }) {

    return(
        <div className = "event-info" >
                <span className={`event-span ${statusColors[status]}`}>
                    {status}
                </span>
                {distance && <span className="event-span bg-gray-600">{`${distance}км`}</span>}
            { categories.map((category) => (
                    <span key={category.id} className={`event-span ${categoryColors[category.name]}`}>
                        {category.name}
                    </span>
                ))
    }
        </div >
    );
}
