import { useContext, useEffect, useState } from "react";
import { AppContext } from "../Context/AppContext";
import axios from "../Plugin/axios.js";
import { Link } from "react-router-dom";

export default function Profile() {

    const { user } = useContext(AppContext);

    const [profileData, setProfileData] = useState(null);
    const [permissions, setPermissions] = useState();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getProfile = async () => {
            await axios.get(`/profile/${user.profile_id}`).then(function (response) {
                console.log(response.data);
                setProfileData(response.data.data);
                setPermissions(response.data.permissions);
            }).finally(() => setLoading(false));
        };
        getProfile();
    },[user.profile_id]);

    if (loading) return <h1>Loading...</h1>;

    return (
        <> 
            <div className="profile-header">
                <h1>Профіль користувача {profileData?.user.name}</h1>
                {permissions && permissions.can_edit ? (
                    <Link to={`/profile/edit/${profileData.id}`} className="link-edit">
                        Редагувати профіль
                    </Link>
                ) : (null)}
            </div>
            <section className="profile-info">
                <div className="avatar-card">
                    <img src={`http://localhost:8000${profileData?.avatar}`} alt="Avatar" className="avatar"/>
                    <p>{profileData?.user.role}</p>
                </div>
                <div className="user-details">
                    <p>Email: {profileData?.user.email}</p>

                </div>
            </section>
        </>
    )
}
