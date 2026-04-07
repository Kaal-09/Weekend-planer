import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login"
import Signup from "./pages/SignUp";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
function App() {
  return (
    <Routes>
        <Route path="/" element= { <HomePage />}/>
        <Route path="/login" element= { <Login />}/>
        <Route path="/signup" element= { <Signup />}/>
        <Route path="/profile" element= { <ProfilePage />}/>

    </Routes>
  )
}

export default App
