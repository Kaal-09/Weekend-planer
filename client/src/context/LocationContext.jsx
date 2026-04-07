import { useState } from "react";
import { useContext } from "react";
import { useAuthStore } from "./useAuth";

const BASE_URL = 'http://localhost:8000';
// eslint-disable-next-line react-refresh/only-export-components
export const LocationContext = useContext();

export const LocationProvider = ({ children }) => {
    const [location, setLocation] = useState({lat: 22.7196, lng: 75.8577,});

    const { userEmail } = useAuthStore();
    
}