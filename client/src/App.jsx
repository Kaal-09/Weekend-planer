import { Routes, Route } from "react-router-dom";
import MapShower from "./components/MapShower";
import Login from "./pages/Login"
import Signup from "./pages/SignUp";
function App() {
  return (
    <Routes>
        <Route path="/" element= { <MapShower />}/>
        <Route path="/login" element= { <Login />}/>
        <Route path="/signup" element= { <Signup />}/>

    </Routes>
  )
}

export default App
