import axios from "@plugin/axios.js";
import { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AppContext } from "@context/AppContext";

export default function Login() {

    const navigate = useNavigate();
    const { refreshUser } = useContext(AppContext);

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })

    const [errors, setErrors] = useState({});

    async function handeLogin(e) {
        e.preventDefault()
        await axios.get('/csrf-cookie');
        await axios.post('/login', formData).catch(function (error) {
            if (error.response) {
                setErrors(error.response.data.errors);
                console.log(error);
            }
        }).then(async response => {
            if (response && response.data) {
                await refreshUser();
                navigate('/');
            }
        })
    }

    return (
        <div className="auth-page">
            <div className="auth-card">
                <Link to="/" className="nav-link">
                    <span>LOGO</span>
                    <span>Social Map</span>
                </Link>
                <div className="auth-header">
                    <h1>Welcome back</h1>
                    <h2>Please enter your details</h2>
                </div>
                <form onSubmit={handeLogin} className="auth-form">
                    <label htmlFor="email">Email address</label>
                    <input type="text" placeholder="example@example.com" id="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                    {errors.email && <div className="error">{errors.email[0]}</div>}
                    <label htmlFor="password">Password</label>
                    <input type="password" placeholder="Password" id="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                    {errors.password && <div className="error">{errors.password[0]}</div>}
                    <button type="submit">Login</button>
                </form>
                <div className="auth-footer">
                    <span>Don't have an account?</span>
                    <Link to="/register" className="nav-link">Register</Link>
                </div>
            </div>
        </div>
    )
}
