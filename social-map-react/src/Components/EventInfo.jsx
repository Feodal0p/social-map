export default function EventInfo({ status, categories = [] }) {

    const statusColors = {
        "upcoming": "bg-blue-600",
        "active": "bg-green-600",
        "finished": "bg-gray-600",
        "canceled": "bg-red-600"
    };

    const categoryColors = {
        'Волонтерство' : 'bg-sky-600',
        'Освіта та навчання': 'bg-indigo-600',
        'Екологія та довкілля': 'bg-emerald-600',
        'Здоров’я та спорт': 'bg-teal-600',
        'Культура та мистецтво' : 'bg-cyan-600',
        'Технології та інновації' : 'bg-slate-600',
        'Дитячі та сімейні події' : 'bg-amber-600',
        'Соціальні ініціативи' : 'bg-purple-600',
        'Бізнес та підприємництво': 'bg-orange-600',
        'Інші': 'bg-fuchsia-600'
    };

    return(
        <div className = "event-info" >
                <span className={`event-span ${statusColors[status]}`}>
                    {status}
                </span>
            { categories.map((category) => (
                    <span key={category.id} className={`event-span ${categoryColors[category.name]}`}>
                        {category.name}
                    </span>
                ))
    }
        </div >
    );
}
