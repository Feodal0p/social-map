import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "@plugin/axios.js";
import Loader from "../../Components/Loader";
import { AppContext } from "@context/AppContext";
import ProfileHeader from "@components/profile/ProfileHeader";

export default function Update() {

    const { id } = useParams();

    const navigate = useNavigate();

    const { refreshUser } = useContext(AppContext);

    const [formData, setFormData] = useState({
        avatar: "",
        location: "",
        phone: "",
        interests: "",
    });

    const [permissions, setPermissions] = useState(null);
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState({});

    async function handleUpdate(e) {
        e.preventDefault();
        const data = new FormData();
        if (formData.avatar instanceof File) {
            data.append('avatar', formData.avatar);
        }
        data.append('location', formData.location);
        data.append('phone', formData.phone);
        data.append('interests', formData.interests);
        data.append('_method', 'PATCH');
        await axios.post(`/profile/${id}`, data).catch(function (error) {
            setErrors(error.response.data.errors);
        }).finally(() => {
            refreshUser();
            navigate(`/profile/${id}`);
        });
    }

    useEffect(() => {
        const getProfile = async () => {
            await axios.get(`/profile/${id}`)
                .then(function (response) {
                    setFormData({
                        ...response.data.data,
                        avatar: response.data.data.avatar || "",
                        location: response.data.data.location || "",
                        phone: response.data.data.phone || "",
                        interests: response.data.data.interests || "",
                    });
                    setPermissions(response.data.permissions);
                }).finally(() => {
                    setLoading(false);
                });
        };
        getProfile();
    }, [id]);

    useEffect(() => {
        if (!loading && permissions && !permissions.can_edit) {
            navigate(-1);
        }
    }, [loading, permissions, navigate]);

    if (loading) return <Loader />;

    return (
        <>
            <ProfileHeader title={`Редагувати профіль ${formData?.user.name}`} />
            <form onSubmit={handleUpdate} className="profile-info" encType="multipart/form-data">
                <div className="avatar-card">
                    <img src={formData?.avatar} alt="Avatar" className="avatar" />
                    <input type="file" name="avatar"
                        onChange={(e) => setFormData({ ...formData, avatar: e.target.files[0] })} />
                </div>
                <div className="user-details">
                    <input type="text" placeholder="Location"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })} />
                    <input type="text" placeholder="Phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                    <input type="text" placeholder="Interests"
                        value={formData.interests}
                        onChange={(e) => setFormData({ ...formData, interests: e.target.value })} />
                </div>
                <button type="submit" className="btn-edit">Зберегти зміни</button>
            </form>
        </>
    )
}