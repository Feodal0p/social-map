import { useContext, useEffect, useState } from "react";
import { AppContext } from "@context/AppContext";
import axios from "@plugin/axios.js";
import { Link, useParams} from "react-router-dom";
import Loader from "../../Components/Loader";
import ProfileHeader from "@components/profile/ProfileHeader";

export default function Show() {

    const { id } = useParams();

    const { user } = useContext(AppContext);

    const [profileData, setProfileData] = useState(null);
    const [permissions, setPermissions] = useState();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getProfile = async () => {
            await axios.get(`/profile/${id}`).then(function (response) {
                setProfileData(response.data.data);
                setPermissions(response.data.permissions);
            }).finally(() => setLoading(false));
        };
        getProfile();
    },[id]);

    if (loading) return <Loader/>;

    return (
        <> 
            <ProfileHeader title={`Профіль користувача ${profileData?.user.name}`}
             can_logout={permissions.can_edit}>
                {user && permissions && permissions.can_edit ? (
                    <Link to={`/profile/edit/${profileData.id}`} className="btn-edit">
                        Редагувати профіль
                    </Link>
                ) : (null)}
            </ProfileHeader>
            <section className="profile-info">
                <div className="avatar-card">
                    <img src={profileData?.avatar} alt="Avatar" className="avatar"/>
                    <p>{profileData?.user.role}</p>
                </div>
                <div className="user-details">
                    <p>Email: {profileData?.user.email}</p>

                </div>
            </section>
        </>
    )
}
