import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Header from './Header';
import Signin from './pages/Signin';
import Posts from './pages/Posts';
import NewPosts from './pages/NewPosts';
import Post from './pages/Post';
import GameNews from './pages/GameNews';

function App() {
    return (
        <BrowserRouter>
        <Header />
        <Routes>
            <Route path='/' element={"首頁"}></Route>
            <Route path='/posts' element={<Posts />}></Route>
            <Route path='/signin' element={<Signin />}></Route>
            <Route path='/new-post' element={<NewPosts />}></Route>
            <Route path='/posts/:postId' element={<Post />}></Route>
            <Route path='/gamenews' element={<GameNews />}></Route>
        </Routes>
        </BrowserRouter>
    );
}

export default App;