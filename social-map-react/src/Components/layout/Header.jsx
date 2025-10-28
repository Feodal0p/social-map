import { useContext, useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { AppContext } from "../../Context/AppContext"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'

library.add(fas, far, fab);

export default function Header() {

    const { user } = useContext(AppContext)
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        setDropdownOpen(false);
    }, [location.pathname]);

    return (
        <header className="header">
            <Link to="/" className="nav-link">
                <span>LOGO</span>
                <span>Social Map</span>
            </Link>
            {user ? (
                <nav>
                    <div className="nav-dropdown">
                        <button
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            className="nav-link">Події</button>
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
                    <Link to={`/profile/${user.profile_id}`} className="nav-link with-profile">
                        <img
                            src={user.profile_avatar}
                            alt="Avatar"
                            className="header-avatar"
                        />
                        <span>Профіль</span>
                    </Link>
                </nav>
            ) : (
                <nav>
                    <Link to="/login" className="nav-link">Login</Link>
                    <Link to="/register" className="nav-link">Register</Link>
                </nav>
            )}
        </header >
    )
}
