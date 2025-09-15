import { useContext } from "react"
import { Link } from "react-router-dom"
import { AppContext } from "../../Context/AppContext"

export default function Header() {

    const { user, setFilterOpen} = useContext(AppContext)
    

    function handleFilterOpen() {
        setFilterOpen(true);
    }

    return (
        <header className="map-header">
            <nav className="nav">
                <div className="nav-left">
                    <Link to="/" className="nav-link">
                        <span>LOGO</span>
                        <span>Social Map</span>
                    </Link>
                    <button className='button-filter' onClick={handleFilterOpen}>
                        Фільтри подій
                    </button>
                </div>
                {user ? (
                    <div className="nav-right">
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
