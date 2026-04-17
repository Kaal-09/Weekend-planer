import { MapContainer, TileLayer, Marker, Popup, useMapEvents, Polyline, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import { Navigation } from "lucide-react";
import { useAuthStore } from "../context/useAuth";
import { useLocationStore } from "../context/useLocationContext.jsx";

const BASE_URL = 'http://localhost:8000';


function ChangeView({ center }) {
    const map = useMap();
    useEffect(() => {
        if (center) map.flyTo([center.lat, center.lng], 13.3);
    }, [center, map]);
    return null;
}

function MapClickHandler({ setDestination, currentLocation, setRoute }) {
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
    const [currentLocation, setCurrentLocation] = useState({ lat: 91, lng: 91 });
    const [route, setRoute] = useState([]);
    const { userEmail } = useAuthStore();
    const { setLocation } = useLocationStore();

    useEffect(() => {
        const run = async () => {
            console.log('UserEmail in mapshower line 52: ', userEmail);
            
            if(!userEmail || userEmail === null || userEmail === undefined) {
                return;
            } 
            const res = await fetch(`${BASE_URL}/api/user/getleanuserByEmail/${userEmail}`, {
                method: 'GET', 
                headers: { 'Content-Type': 'application/json' },
                credentials: "include"
            });

            const data = await res.json();
            const leanUser = data.user;
            console.log(data);
            
            const parsedLocation = leanUser.homeLocation;
            setLocation(parsedLocation);
            setCurrentLocation(parsedLocation);
            console.log('Current location is: ', parsedLocation);
                                 
        }
        run();
    }, [userEmail])

    const getLocation = () => {
        navigator.geolocation.getCurrentPosition((pos) => {
            const newLoc = {
                lat: pos.coords.latitude,
                lng: pos.coords.longitude,
            };

            setCurrentLocation(newLoc);

            console.log(`Correct lat: ${newLoc.lat}, lng: ${newLoc.lng}`);
        });
        const run = async () => {
            if(!userEmail) return;
            if(userEmail === null || (currentLocation.lat === 22.7196 && currentLocation.lng === 75.8577)){
                return;
            }
            const res = await fetch(`${BASE_URL}/api/user/update/${userEmail}`, {
                method: 'PATCH',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    homeLocation: currentLocation
                })
            });
            const data = await res.json();
            const notLeanUser = data.user;
            console.log('notleanUser inside mapshower with updated postion from crome location api is: ', notLeanUser);
            
            setLocation(notLeanUser.homeLocation);            
        }
        run();
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
                className="w-full h-full z-0"
            >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap' />
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
