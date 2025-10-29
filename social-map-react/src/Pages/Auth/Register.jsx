import axios from "@plugin/axios.js";
import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AppContext } from "@context/AppContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'

library.add(fas);

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
            <section className="auth-card">
                <Link className="auth-name" to={'/'}>LOGOSocial Map</Link>
                <h1>Create account!</h1>
                <form onSubmit={handeRegister} className="auth-form">
                    <div className="form-group">
                        <label htmlFor="name">Ім'я</label>
                        <input type="text" placeholder="Ім'я" id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                        {errors.name && <div className="error">{errors.name[0]}</div>}
                    </div>
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
                        <label htmlFor="password_confirmation">Підтвердження пароля</label>
                        <input type="password" placeholder="••••••••" id="password_confirmation"
                            value={formData.password_confirmation}
                            onChange={(e) => setFormData({ ...formData, password_confirmation: e.target.value })} />
                    </div>
                    <button type="submit">
                        <FontAwesomeIcon icon="fa-solid fa-user-plus" />
                        Зареєструватися</button>
                </form>
                <p className="register-link">
                    <span>Вже є обліковий запис?</span>
                    <Link to="/login" className="nav-link">Увійти</Link>
                </p>
            </section>
        </div>
    )
}
