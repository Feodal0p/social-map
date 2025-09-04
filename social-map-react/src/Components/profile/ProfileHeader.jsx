import { useContext } from "react";
import { AppContext } from "@context/AppContext";
import { useNavigate } from "react-router-dom";

export default function ProfileHeader({ title, children }) {

    const navigate = useNavigate();

    const { user, logout } = useContext(AppContext);

    const handleLogout = async () => {
    await logout();
    navigate('/');
};

    return (
        <div className="profile-header">
            <button className="btn-back" onClick={() => navigate(-1)}>
                Назад
            </button>
            <div className="profile-header-info">
                <h1>{title}</h1>
                {children}
            </div>
            {user ? (<button className="btn-logout" onClick={handleLogout}>
                Вийти
            </button>) : (<div className="space"/>)}
        </div>
    )
}
