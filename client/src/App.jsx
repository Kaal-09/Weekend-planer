import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login"
import Signup from "./pages/SignUp";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import EditProfile from "./pages/EditPage";
import { Toaster } from "react-hot-toast";
import ExploreMap from "./pages/ExploreMap";

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
                <Route path="/trending" element={<ExploreMap />} />

            </Routes>    </>
    )
}

export default App
