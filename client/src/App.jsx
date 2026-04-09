import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login"
import Signup from "./pages/SignUp";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import EditProfile from "./pages/EditPage";
import { Toaster } from "react-hot-toast";

function App() {
    return (
        <>
            <Toaster position="top-right" />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/settings" element={<EditProfile />} />

            </Routes>    </>
    )
}

export default App
