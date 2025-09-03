import axios from "@plugin/axios.js";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "@context/AppContext";

export default function Register() {

    const navigate = useNavigate();
    const { refreshUser } = useContext(AppContext);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: ''
    })

    const [errors, setErrors] = useState({});

    async function handeRegister(e) {
        e.preventDefault()
        await axios.get('/csrf-cookie');
        await axios.post('/register', formData).catch(function (error) {
            if (error.response) {
                setErrors(error.response.data.errors);
            }
        }).then(async response => {
            if (response && response.data) {
                await refreshUser();
                navigate('/profile');
            }
        })
    }

    return (
        <>
            <form onSubmit={handeRegister}>
                <input type="text" placeholder="Name" id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                {errors.name && <div className="error">{errors.name[0]}</div>}
                <input type="text" placeholder="Email" id="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                {errors.email && <div className="error">{errors.email[0]}</div>}
                <input type="password" placeholder="Password" id="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                {errors.password && <div className="error">{errors.password[0]}</div>}
                <input type="password" placeholder="Password_confirmation" id="password_confirmation"
                    value={formData.password_confirmation}
                    onChange={(e) => setFormData({ ...formData, password_confirmation: e.target.value })} />
                <button type="submit">Register</button>
            </form>
        </>
    )
}
