import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Map({ events = [], roles = [],
    createEventCoords, setCreateEventCoords, setEventAddress, showSidebar, setShowSidebar, onSelectEvent }) {

    const mapRef = useRef();

    const [tempMarker, setTempMarker] = useState(null);

    const navigate = useNavigate();

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

    }, []);

    useEffect(() => {
        if (mapRef.current) {
            if (mapRef.current._eventMarkers) {
                mapRef.current._eventMarkers.forEach(marker => marker.remove());
            }
            mapRef.current._eventMarkers = events.map(event => {
                const marker = L.marker([event.latitude, event.longitude])
                    .addTo(mapRef.current)
                    .bindPopup(event.title);
                marker.on('click', () => {
                    setTempMarker(null);
                    onSelectEvent(event);
                    mapRef.current.setView([event.latitude, event.longitude - 0.0025], 17);
                });
                return marker
            });
        }
    }, [events, onSelectEvent]);

    useEffect(() => {

        function clearEventParam() {
            const params = new URLSearchParams(location.search);
            params.delete('event');
            navigate({ search: params.toString() }, { replace: true });
        }

        function handleMapClick(e) {
            const allowedRoles = ['admin', 'organizer'];
            if (createEventCoords || showSidebar) {
                setCreateEventCoords(null);
                setShowSidebar(false);
                setTempMarker(null);
                setEventAddress('');
                clearEventParam();
            } else if (allowedRoles.some(role => roles.includes(role))) {
                if (!createEventCoords) {
                    setTempMarker(e.latlng);
                    setCreateEventCoords(e.latlng);
                }
            }
        }
        
        mapRef.current.on('click', handleMapClick);

    }, [roles, createEventCoords, setCreateEventCoords, setEventAddress, setShowSidebar, showSidebar, navigate]);

    useEffect(() => {
        const getInfoForCreatedEvent = async () => {
            if (!createEventCoords) return;
            const { lng, lat } = createEventCoords;
            const res = await axios.get(
                `http://localhost:8080/reverse?lat=${lat}&lon=${lng}&format=json`
            );
            const address = res.data.address || {};
            const locality = address.city || address.town || address.village || '';
            const shortAddress = [
                ([address.road, address.house_number].filter(Boolean).join(' ')),
                locality,
                address.state,
                address.country
            ].filter(Boolean).join(', ');
            setEventAddress(shortAddress || res.data.display_name);
        };
        getInfoForCreatedEvent();
    }, [createEventCoords, setEventAddress]);

    useEffect(() => {
        if (tempMarker && mapRef.current) {
            if (mapRef.current._tempMarker) {
                mapRef.current._tempMarker.remove();
            }
            const marker = L.marker([tempMarker.lat, tempMarker.lng]).addTo(mapRef.current);
            mapRef.current._tempMarker = marker;
            if (showSidebar) {
                mapRef.current.setView([tempMarker.lat, tempMarker.lng - 0.0025], 17);
            }
        } else if (mapRef.current && mapRef.current._tempMarker) {
            mapRef.current._tempMarker.remove();
        }
    }, [tempMarker, showSidebar]);

    useEffect(() => {
        if (!showSidebar && mapRef.current && mapRef.current._tempMarker) {
            setTempMarker(null);
        }
    }, [showSidebar]);

    return (
        <div
            id="map"
            style={{ width: '100vw', height: '100vh' }}>
        </div>
    );
}
