import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useMemo, useRef, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Map({ events = [], roles = [],
    createEventCoords, setCreateEventCoords, setEventAddress,
    showSidebar, sidebarMode, onSelectEvent, handleSidebarClose, setError, myLocation, setMyLocation,
    zoomToMyLocation, setZoomToMyLocation
}) {

    const mapRef = useRef();

    const [tempMarker, setTempMarker] = useState(null);

    const navigate = useNavigate();

    const maxBounds = useMemo(() => L.latLngBounds(
        [50.69230229359596, 25.19826],
        [50.82721, 25.442276000976566]
    ), []);

    useEffect(() => {
        if (!mapRef.current) {
            mapRef.current = L.map('map', {
                center: [50.74740, 25.32648],
                zoomControl: false,
                zoom: 13,
                minZoom: 12,
                maxBounds: maxBounds,
            });

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; OpenStreetMap contributors'
            }).addTo(mapRef.current);
        }

    }, [maxBounds]);

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
                handleSidebarClose();
                setTempMarker(null);
                setEventAddress();
                clearEventParam();
            } else if (allowedRoles.some(role => roles.includes(role))) {
                if (!createEventCoords) {
                    setTempMarker(e.latlng);
                    setCreateEventCoords(e.latlng);
                }
            }
        }

        mapRef.current.on('click', handleMapClick);

    }, [roles, createEventCoords, setCreateEventCoords, setEventAddress, showSidebar, navigate, handleSidebarClose]);

    useEffect(() => {
        const getInfoForCreatedEvent = async () => {
            if (!createEventCoords) return;
            const { lng, lat } = createEventCoords;
            const res = await axios.get(
                `http://localhost:8080/reverse?lat=${lat}&lon=${lng}&format=json&`
            );
            const address = res.data.address || {};
            const locality = address.city || address.town || address.village || address.municipality || '';
            const location = {
                road: address.road || '',
                house_number: address.house_number || '',
                locality: locality,
                state: address.state || '',
                country: address.country || '',
                display_name: res.data.display_name || ''
            };
            setEventAddress(location);
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
            if (showSidebar && sidebarMode === 'create') {
                mapRef.current.setView([tempMarker.lat, tempMarker.lng - 0.0025], 17);
            }
        } else if (mapRef.current && mapRef.current._tempMarker) {
            mapRef.current._tempMarker.remove();
        }
    }, [tempMarker, showSidebar, sidebarMode]);

    useEffect(() => {
        if (!showSidebar && mapRef.current && mapRef.current._tempMarker) {
            setTempMarker(null);
        } else if (showSidebar && sidebarMode !== 'create') {
            setTempMarker(null);
        }
    }, [showSidebar, sidebarMode]);

    function userMarkerCreate(coords) {
        const userMarker = L.marker([coords[0], coords[1]], {
            icon: L.icon({
                iconUrl: 'https://cdn-icons-png.flaticon.com/512/64/64113.png',
                iconSize: [32, 32],
                iconAnchor: [16, 32],
            })
        }).addTo(mapRef.current).bindPopup('Ваша геолокація');
        mapRef.current._userMarker = userMarker;
    }

    useEffect(() => {
        if (navigator.geolocation && mapRef.current) {
            navigator.geolocation.getCurrentPosition(position => {
                const userCoords = [position.coords.latitude, position.coords.longitude];
                setMyLocation(userCoords);
                if (maxBounds.contains(userCoords)) {
                    userMarkerCreate(userCoords);
                } else {
                    setError({ geolocation: 'Ваша геолокація поза межами міста' });
                }
            }, (error) => {
                setMyLocation(undefined);
                setError({ geolocation: error.message });
            });
        }
    }, [setError, setMyLocation, maxBounds]);

    useEffect(() => {
        if (zoomToMyLocation && myLocation && mapRef.current) {
            if (maxBounds.contains(myLocation)) {
                userMarkerCreate(myLocation);
                mapRef.current.setView([myLocation[0], myLocation[1], 15]);
            } else {
                setError({ geolocation: 'Ваша геолокація поза межами міста' });
            }
        }
        setZoomToMyLocation(false);
    }, [zoomToMyLocation, myLocation, setError, maxBounds, setZoomToMyLocation]);

    return (
        <div
            id="map"
            style={{ width: '100vw', height: '100vh' }}>
        </div>
    );
}
