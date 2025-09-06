import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';

export default function Map({ events = [], roles = [] }) {

    const mapContainerRef = useRef();
    const mapRef = useRef();
    const [createEventCoords, setCreateEventCoords] = useState(null);
    const [eventAddress, setEventAddress] = useState('');

    useEffect(() => {
        mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

        const bounds = [
            [25.13958, 50.62708],
            [25.48671, 50.84758]
        ];

        mapRef.current = new mapboxgl.Map({
            container: mapContainerRef.current,
            center: [25.32648, 50.74740],
            zoom: 9,
            maxBounds: bounds
        });

        events.forEach(event => {
            new mapboxgl.Marker()
                .setLngLat([event.latitude, event.longitude])
                .setPopup(new mapboxgl.Popup().setText(event.title))
                .addTo(mapRef.current);
        });

        return () => {
            mapRef.current.remove();
        };

    }, [events]);

    useEffect(() => {
        mapRef.current.on('click', (e) => {
            const allowedRoles = ['admin', 'organizer'];
            if (e.originalEvent.target === mapRef.current.getCanvas() &&
                allowedRoles.some(role => roles.includes(role))) {
                if (createEventCoords) {
                    setCreateEventCoords(null);
                } else {
                    setCreateEventCoords(e.lngLat);
                }
            }
        });

    }, [roles, createEventCoords]);

    useEffect(() => {
        const getInfoForCreatedEvent = async () => {
            if (!createEventCoords) return;
            const { lng, lat } = createEventCoords;
                const res = await axios.get(
                    `https://api.mapbox.com/search/geocode/v6/reverse?longitude=${lng}&latitude=${lat}&access_token=${import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}`
                );
                setEventAddress(res.data.features[0].properties.name + ', ' + 
                    res.data.features[1].properties.place_formatted || '');
        };
        getInfoForCreatedEvent();
    }, [createEventCoords]);

    return (
        <>
            <div id="map"
                style={{ width: '100vw', height: '100vh' }}
                ref={mapContainerRef}>
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
