import { useContext } from "react"
import { Link } from "react-router-dom"
import { AppContext } from "../Context/AppContext"

export default function Header() {

    const { user } = useContext(AppContext)

    return (
        <header className="header">
            <nav className="nav">
                <div className="nav-left">
                    <span>LOGO</span>
                    <Link to="/" className="nav-link">Social Map</Link>
                </div>
                {user ? (
                    <div className="nav-right">
                        <Link to={`/profile/${user.profile_id}`} className="nav-link">
                        <img
                            src={`http://localhost:8000${user.profile_avatar}`} 
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
