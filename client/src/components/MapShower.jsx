import {MapContainer, TileLayer, Marker, Popup, useMapEvents, Polyline} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useState } from "react";


function MapClickHandler({ setDestination, currentLocation, setRoute}) {
    useMapEvents({
        click: async (e) => {
            const dest = e.latlng;
            setDestination(dest);

            if (currentLocation) {
                const url = `https://router.project-osrm.org/route/v1/driving/${currentLocation.lng},${currentLocation.lat};${dest.lng},${dest.lat}?overview=full&geometries=geojson`;

                const res = await fetch(url);
                const data = await res.json();

                const coords = data.routes[0].geometry.coordinates;

                const routeLatLng = coords.map(([lng, lat]) => ({ lat, lng, }));

                setRoute(routeLatLng);
            }
        },
    });

    return null;
};

function MapShower() {
    const [destination, setDestination] = useState(null);
    const [currentLocation, setCurrentLocation] = useState({lat: 48.8566, lng: 2.3522,});
    const [route, setRoute] = useState([]);

    const getLocation = () => {
        navigator.geolocation.getCurrentPosition((pos) => {
            setCurrentLocation({
                lat: pos.coords.latitude,
                lng: pos.coords.longitude,
            });
        });
    };

    return (
        <div style={{ height: "100vh", width: "100%" }}>
            <button
                onClick={getLocation}
                style={{ position: "absolute", zIndex: 1000 }}
            >
                Get Current Location
            </button>

            <MapContainer
                center={[48.8566, 2.3522]}
                zoom={13}
                style={{ height: "100%", width: "100%" }}
            >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                <MapClickHandler
                    setDestination={setDestination}
                    currentLocation={currentLocation}
                    setRoute={setRoute}
                />

                {currentLocation && (
                    <Marker position={currentLocation}>
                        <Popup>You are here</Popup>
                    </Marker>
                )}

                {destination && (
                    <Marker position={destination}>
                        <Popup>Destination</Popup>
                    </Marker>
                )}

                {route.length > 0 && <Polyline positions={route} />}
            </MapContainer>
        </div>
    );
}

export default MapShower;