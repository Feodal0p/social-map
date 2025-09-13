import { useContext } from "react"
import { Link, useNavigate } from "react-router-dom"
import { AppContext } from "../../Context/AppContext"

export default function Header() {

    const { user, selectedStatus, setSelectedStatus, localLoading } = useContext(AppContext)
    
    const navigate = useNavigate();

    function handleStatusChange(e) {
        setSelectedStatus(e.target.value);
        const params = new URLSearchParams(location.search);
        params.set('status', e.target.value);
        navigate({ search: params.toString() });
    }

    return (
        <header className="map-header">
            <nav className="nav">
                <div className="nav-left">
                    <Link to="/" className="nav-link">
                        <span>LOGO</span>
                        <span>Social Map</span>
                    </Link>
                    {localLoading ? (<span className="status-select">Loading...</span>) : (
                        <select
                        value={selectedStatus}
                        onChange={handleStatusChange}
                        className="status-select"
                    >
                        <option value="all">Всі події</option>
                        <option value="upcoming">Найближчі події</option>
                        <option value="active">Активні події</option>
                        <option value="finished">Завершені події</option>
                        <option value="canceled">Скасовані події</option>
                    </select>
                    )}
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
