import './App.css';
import { Routes, Route } from "react-router-dom";
import Login from './pages/Login';
import Home from './pages/Home';
import Admin from './pages/Admin';
import Registration from './pages/Registration'
import EditUser from './pages/EditUser'
import QaManager from './pages/QaManager';
import CreatePosts from './pages/CreatePosts';
import Category from './pages/Category';
import CreacteCategory from './pages/CreacteCategory';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="registration" element={<Registration />} />
      <Route path="/view-user/:id" element={<EditUser />} />
      <Route path="/manager" element={<QaManager />} />
      <Route path='/new-post' element={<CreatePosts/>}/>
      <Route path='/category' element={<Category/>}/>
      <Route path='/creacte-category' element={<CreacteCategory/>}/>
    </Routes>
  );
}

export default App;
