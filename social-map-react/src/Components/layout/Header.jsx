import { useContext } from "react"
import { Link } from "react-router-dom"
import { AppContext } from "../../Context/AppContext"
import DropdownEvents from "./DropdownEvents"

export default function Header() {

    const { user } = useContext(AppContext)

    return (
        <header className="header">
            <nav>
                <Link to="/" className="home-link">
                    <span>LOGO</span>
                    <span>Social Map</span>
                </Link>
                <Link to="/map" className="nav-link">Карта</Link>
            </nav>
            {user ? (
                <nav>
                    <DropdownEvents user={user} />
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
