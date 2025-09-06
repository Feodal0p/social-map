import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';

export default function Map({ events = [], roles = [] }) {

    const mapRef = useRef();
    const [createEventCoords, setCreateEventCoords] = useState(null);
    const [eventAddress, setEventAddress] = useState('');

    useEffect(() => {
        if (!mapRef.current) {
            mapRef.current = L.map('map', {
                center: [50.74740, 25.32648],
                zoomControl: false,
                zoom: 13,
                minZoom: 12,
                maxBounds: [[50.82721, 25.19826], [50.69230229359596, 25.442276000976566]],
            });

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; OpenStreetMap contributors'
            }).addTo(mapRef.current);
        }

        events.forEach(event => {
            L.marker([event.latitude, event.longitude])
                .addTo(mapRef.current)
                .bindPopup(event.title);
        });
    }, [events]);

    useEffect(() => {
        mapRef.current.on('click', (e) => {
            const allowedRoles = ['admin', 'organizer'];
            if (allowedRoles.some(role => roles.includes(role))) {
                if (createEventCoords) {
                    setCreateEventCoords(null);
                    setEventAddress('');
                } else {
                    setCreateEventCoords(e.latlng);
                }
            }
        });

    }, [roles, createEventCoords]);

    useEffect(() => {
        const getInfoForCreatedEvent = async () => {
            if (!createEventCoords) return;
            const { lng, lat } = createEventCoords;
            const res = await axios.get(
                `http://localhost:8080/reverse?lat=${lat}&lon=${lng}&format=json`
            );
            setEventAddress(res.data.display_name || '');
        };
        getInfoForCreatedEvent();
    }, [createEventCoords]);

    return (
        <>
            <div
                id="map"
                style={{ width: '100vw', height: '100vh' }}>
            </div>
            {createEventCoords && (
                <div className="create-event-popup">
                    <h1>Create Event</h1>
                    <p>{eventAddress}</p>
                </div>
            )}
        </>
    );
}
