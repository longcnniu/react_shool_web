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
import EditCategory from './pages/EditCategory';
import PostDetail from './pages/PostDetail';
import NotFound from './pages/NotFound';
import EditPost from './pages/EditPost';
import Statistical from "./pages/Statistical";
import Export from "./pages/Export";
import UpdataComment from "./pages/UpdataComment";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />

      <Route path="/admin" element={<Admin />} />
      <Route path="registration" element={<Registration />} />
      <Route path="/view-user/:id" element={<EditUser />} />
      <Route path="/manager" element={<QaManager />} />

      <Route path='/category' element={<Category/>}/>
      <Route path='/creacte-category' element={<CreacteCategory/>}/>
      <Route path='/category/:id' element={<EditCategory/>}/>

      <Route path='/new-post' element={<CreatePosts/>}/>
      <Route path='/post/:id' element={<PostDetail/>}/>
      <Route path='/post-eidt/:id' element={<EditPost/>}/>
      <Route path='/updata-comment/:id' element={<UpdataComment/>}/>

      <Route path="/statistical" element={<Statistical/>}/>
      <Route path="/export" element={<Export/>}/>

      <Route path='*' element={<NotFound/>}/>
    </Routes>
  );
}

export default App;
