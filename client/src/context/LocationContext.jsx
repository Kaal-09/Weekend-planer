import { createContext, useEffect, useState } from "react";
import { useAuthStore } from "./useAuth";

const BASE_URL = 'http://localhost:8000';
// eslint-disable-next-line react-refresh/only-export-components
export const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
    const [location, setLocation] = useState({lat: 22.7196, lng: 75.8577});
    const { userEmail } = useAuthStore();

    useEffect(() => {
        const run = async () => {
            if((location.lat === 22.7196) && (location.lng === 75.8577)) {
                
                if(userEmail === null) return;

                const res = await fetch(`${BASE_URL}/api/user/getuserByEmail/${userEmail}`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: "include",
                });

                const data = await res.json();
                if(!res.ok) throw new Error(data.message || 'User email in the AuthContext is not valid most prolly');
                const user = data.user;
                setLocation(user.homeLocation);
            }
        }
        run();
    }, [location]);
    
    return (
        <LocationContext.Provider value = {{location, setLocation}}>
            {children}
        </LocationContext.Provider>
    )
}