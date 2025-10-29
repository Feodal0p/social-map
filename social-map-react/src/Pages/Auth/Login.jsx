import axios from "@plugin/axios.js";
import { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AppContext } from "@context/AppContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'

library.add(fas);

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
            <section className="auth-card">
                <Link className="auth-name" to={'/'}>LOGOSocial Map</Link>
                <h1>Welcome back!</h1>
                <form onSubmit={handeLogin} className="auth-form">
                    <div className="form-group">
                        <label htmlFor="email">Електронна пошта</label>
                        <input type="text" placeholder="email@example.com" id="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                        {errors.email && <div className="error">{errors.email[0]}</div>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Пароль</label>
                        <input type="password" placeholder="••••••••" id="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                        {errors.password && <div className="error">{errors.password[0]}</div>}
                    </div>
                    <div className="form-group">
                        <Link to="/forgot-password" className="forgot-password-link">Забули пароль?</Link>
                    </div>
                    <button type="submit">
                        <FontAwesomeIcon icon="fa-solid fa-right-to-bracket" />
                        Увійти</button>
                </form>
                <p className="register-link">
                    <span>Немає облікового запису?</span>
                    <Link to="/register" className="nav-link">Зареєструватися</Link>
                </p>
            </section>
        </div>
    )
}
