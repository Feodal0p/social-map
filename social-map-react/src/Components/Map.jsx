import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css';
import { useEffect, useRef } from 'react';

export default function Map({ events = [] }) {

    const mapContainerRef = useRef();
    const mapRef = useRef();


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


    return (
        <div id="map"
            style={{ width: '100vw', height: '100vh' }}
            ref={mapContainerRef}>
        </div>
    );
}
