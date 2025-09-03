import { useEffect, useState } from "react";
import { AppContext } from "@context/AppContext";
import axios from "@plugin/axios.js";
import { Link, useParams} from "react-router-dom";
import Loader from "../../Components/Loader";

export default function Show() {

    const { id } = useParams();

    const [profileData, setProfileData] = useState(null);
    const [permissions, setPermissions] = useState();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getProfile = async () => {
            await axios.get(`/profile/${id}`).then(function (response) {
                console.log(response.data);
                setProfileData(response.data.data);
                setPermissions(response.data.permissions);
            }).finally(() => setLoading(false));
        };
        getProfile();
    },[id]);

    if (loading) return <Loader/>;

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
