import axios from "@plugin/axios.js";
import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AppContext } from "@context/AppContext";

export default function Register() {

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
                    <h1>Create account</h1>
                    <h2>Please enter your details</h2>
                </div>
                <form onSubmit={handeRegister} className="auth-form">
                    <label htmlFor="name">Name</label>
                    <input type="text" placeholder="Name" id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                    {errors.name && <div className="error">{errors.name[0]}</div>}
                    <label htmlFor="email">Email</label>
                    <input type="text" placeholder="example@example.com" id="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                    {errors.email && <div className="error">{errors.email[0]}</div>}
                    <label htmlFor="password">Password</label>
                    <input type="password" placeholder="Password" id="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                    {errors.password && <div className="error">{errors.password[0]}</div>}
                    <label htmlFor="password_confirmation">Confirm Password</label>
                    <input type="password" placeholder="Password_confirmation" id="password_confirmation"
                        value={formData.password_confirmation}
                        onChange={(e) => setFormData({ ...formData, password_confirmation: e.target.value })} />
                    <button type="submit">Register</button>
                </form>
                <div className="auth-footer">
                    <span>Already have an account?</span>
                    <Link to="/login" className="nav-link">Login</Link>
                </div>
            </div>
        </div>
    )
}
