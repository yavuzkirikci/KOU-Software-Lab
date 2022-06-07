import "./App.css";
import MapPage from './Components/MapPage'
import LoginPage from "./Components/LoginPage";
import { Routes, Route, Link } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/map" element={<MapPage />} />
    </Routes>
 )
}

export default App;
