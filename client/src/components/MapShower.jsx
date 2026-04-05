
import {MapContainer, TileLayer, Marker, Popup, useMapEvents, Polyline, useMap} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import { Navigation } from "lucide-react";

function ChangeView({ center }) {
    const map = useMap();
    useEffect(() => {
        if (center) map.flyTo([center.lat, center.lng], 15);
    }, [center, map]);
    return null;
}

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
    const [currentLocation, setCurrentLocation] = useState({lat: 22.7196, lng: 75.8577,});
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
        <div className="relative w-full h-full group">
            <button
                onClick={getLocation}
                className="absolute top-4 right-4 z-1000 flex items-center gap-2 bg-white/90 backdrop-blur-sm text-gray-800 px-4 py-2.5 rounded-xl border border-gray-200 shadow-lg hover:bg-black hover:text-white transition-all duration-300 active:scale-95 font-medium text-sm"
            >
                <Navigation size={16} className="rotate-45" />
                Current Location
            </button>

            <MapContainer
                center={[currentLocation.lat, currentLocation.lng]}
                zoom={10}
                zoomControl={false}
                className="w-full h-full z-0"
            >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap'/>
                {/* <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" /> */}
                <ChangeView center={currentLocation} />
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
