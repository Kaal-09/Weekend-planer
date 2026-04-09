import { createContext, useState, useEffect } from "react";

const BASE_URL = 'http://localhost:8000';
// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [userEmail, setUserEmail] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(()=> {
        const savedToken = localStorage.getItem('authToken');
        const savedUser = localStorage.getItem('useremail');
        console.log('saved token: ', savedToken);
        console.log('saved user: ', savedUser);
        console.log(JSON.parse(savedUser));
        
        
        if(savedUser){
            setUserEmail(JSON.parse(savedUser));
        }
        if(savedToken) {
            setToken(savedToken);
        }
        setLoading(false);
    }, [])

    const login = async (email , password) => {
        setLoading(true);
        setError(null);
        try {
            console.log('Inside login of Authcontroller, about to make request to backend');
            const res = await fetch(`${BASE_URL}/api/user/login`, {
                method: 'POST', 
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
                credentials: "include"
            });
 
            const data = await res.json()
            if (!res.ok) throw new Error(data.message || 'Login failed');

            console.log("data recieved:", data);
            setUserEmail(data.email);
            setToken(data.token);
            console.log(`User saved at local storage: ${data.email}`)
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('useremail', JSON.stringify(data.email));
            setLoading(false);
            return true;
        } catch (err) {
            setError(err.message);
            setLoading(false);
            return false;
        }
    };

    const logout = async () => {
        setUserEmail(null);
        setToken(null);
        localStorage.removeItem('authToken');
        localStorage.removeItem('useremail');
        try {
            await fetch(`${BASE_URL}/api/user/logout`, {
                method: 'POST', 
                headers: { 'Content-Type': 'application/json' },
                body: null,
                credentials: "include"
            });
            console.log('User loggesd out successfully');
            
        } catch (error) {
            console.log('Error in authcontext logout');
            console.log(error);
        }
    };

    return (
        <AuthContext.Provider value={{ userEmail, token, loading, error, login, logout, setUserEmail }}>
            {children}
        </AuthContext.Provider>
    );
};
