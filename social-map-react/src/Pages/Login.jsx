import axios from "../Plugin/axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })

    const [errors, setErrors] = useState({});

    async function handeLogin(e) {
        e.preventDefault()
        await axios.post('/login', formData).catch(function (error) {
            if (error.response) {
                setErrors(error.response.data.errors);
                console.log(error);
            }
        }).then(function (response) {
            if (response && response.data) {
                navigate('/profile');
            }
        })
    }

    return (
        <>
            <form onSubmit={handeLogin}>
                <input type="text" placeholder="Email" id="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                {errors.email && <div className="error">{errors.email[0]}</div>}
                <input type="password" placeholder="Password" id="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                {errors.password && <div className="error">{errors.password[0]}</div>}
                <button type="submit">Login</button>
            </form>
        </>
    )
}
