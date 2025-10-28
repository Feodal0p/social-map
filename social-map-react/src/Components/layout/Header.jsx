import { useContext, useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { AppContext } from "../../Context/AppContext"

export default function Header() {

    const { user } = useContext(AppContext)
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        setDropdownOpen(false);
    }, [location.pathname]);

    return (
        <header className="header">
            <nav className="nav">
                <div className="nav-left">
                    <Link to="/" className="nav-link">
                        <span>LOGO</span>
                        <span>Social Map</span>
                    </Link>
                </div>
                {user ? (
                    <div className="nav-right">
                        <div className="nav-dropdown">
                            <button
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                className="nav-link">Події</button>
                            {dropdownOpen && (
                                <div className="dropdown">
                                    <Link to={`/events/participating`} className="nav-link">Беру участь</Link>
                                    {user.roles.includes('organizer') && (
                                        <Link to={`/events/created`} className="nav-link">Створені мною</Link>
                                    )}
                                    <Link to={`/events/history`} className="nav-link">Історія подій</Link>
                                </div>
                            )}
                        </div>
                        <Link to={`/profile/${user.profile_id}`} className="nav-link">
                            <img
                                src={user.profile_avatar}
                                alt="Avatar"
                                className="header-avatar"
                            />
                            <span>Profile</span>
                        </Link>
                    </div>
                ) : (
                    <div className="nav-right">
                        <Link to="/login" className="nav-link">Login</Link>
                        <Link to="/register" className="nav-link">Register</Link>
                    </div>
                )}
            </nav>
        </header>
    )
}
