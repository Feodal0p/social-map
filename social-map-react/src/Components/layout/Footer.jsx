import { Link } from "react-router-dom";

export default function Footer() {

    return (
        <footer>
            <p>© 2025 Платформа «Social Map». Всі права захищено.</p>
            <div className="copyright">
                <p>Геоданні: © <Link to={'https://www.openstreetmap.org/copyright'}> OpenStreetMap contributors</Link></p>
                <span>|</span>
                <p>Відображення: <Link to={'https://leafletjs.com/'}> Leaflet</Link></p>
                <span>|</span>
                <p>Геокодування: <Link to={'https://nominatim.org/'}>Nominatim</Link></p>
            </div>
        </footer>
    )
}
