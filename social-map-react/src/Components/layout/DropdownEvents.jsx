import { Link, useLocation } from "react-router-dom"
import { useState, useEffect } from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'

library.add(fas);

export default function DropdownEvents({ user }) {

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        setDropdownOpen(false);
    }, [location.pathname]);

    return (
        <div className="nav-dropdown">
            <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className={`nav-link ${dropdownOpen ? 'open' : 'close'}`}>Події</button>
            <div className={`dropdown ${dropdownOpen ? 'open' : 'closed'}`}>
                <Link to={`/events/participating`} className="nav-link">
                    <FontAwesomeIcon icon="fa-solid fa-circle-check" className="nav-link-icon" />
                    Беру участь</Link>
                <Link to={`/events/history`} className="nav-link">
                    <FontAwesomeIcon icon="fa-solid fa-clock-rotate-left" className="nav-link-icon" />
                    Історія подій</Link>
                {user.roles.includes('organizer') && (
                    <Link to={`/events/created`} className="nav-link">
                        <FontAwesomeIcon icon="fa-solid fa-pen-to-square" className="nav-link-icon" />
                        Створені мною</Link>
                )}
            </div>
        </div>
    )
}