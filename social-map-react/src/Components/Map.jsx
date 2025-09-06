import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css';
import { useEffect, useRef } from 'react';

export default function Map() {

    const mapContainerRef = useRef();
    const mapRef = useRef();


    useEffect(() => {
        mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
        mapRef.current = new mapboxgl.Map({
            container: mapContainerRef.current,
            center: [-74.5, 40],
            zoom: 9
        });
    }, []);


    return (
        <div id="map"
            style={{ width: '100vw', height: '100vh' }}
            ref={mapContainerRef}>
        </div>
    );
}
