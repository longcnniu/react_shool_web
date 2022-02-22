import './App.css';
import { Routes, Route } from "react-router-dom";
import Login from './pages/Login';
import Home from './pages/Home';
import Admin from './pages/Admin';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/admin" element={<Admin />} />
    </Routes>
  );
}

export default App;
