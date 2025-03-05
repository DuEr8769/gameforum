import { BrowserRouter, Routes, Route, Outlet ,Navigate } from 'react-router-dom';
import { Container, Grid } from 'semantic-ui-react';
import { useEffect, useState } from 'react';
import firebase from './utils/firebase';

import { Slide } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css';
import './App.css';

import Header from './Header';

import Signin from './pages/Signin';
import GameNews from './pages/GameNews';
import Posts from './pages/Posts';
import NewPosts from './pages/NewPosts';
import Post from './pages/Post';
import MyPosts from './pages/MyPosts';
import MyCollection from './pages/MyCollections';
import MySettings from './pages/MySettings';

import Rewards from './pages/Rewards';
import Topics from './components/Topics';
import MyMenu from './components/MyMenu';


function App() {
  const [user, setUser] = useState(null); 

  useEffect(() => {
    firebase.auth().onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    })
  },[]);
  
  return (
        <BrowserRouter basename="/gameforum" >
        <Header user ={ user } />
        <Routes>
            <Route path="/" element={<IndexPage/>} />

            <Route path="/posts" element={<PostViewLayout />}>
            <Route index element={<Posts />} />
            <Route path=":postId" element={<Post />} />
            </Route>

            <Route path="/my" element={<MyPageViewLayout user ={user}/>}>
            <Route index element={""} />
            <Route path="posts" element={<MyPosts />} />
            <Route path="collections" element={<MyCollection />} />
            <Route path="settings" element={<MySettings />} />
            </Route>

            <Route path="/rewards" element={user ? <Rewards /> : <Navigate to='/'/> } />
            <Route path="/signin" element={user ? <Navigate to='/'/>  : <Signin /> } />
            <Route path="/new-post" element={user ? <NewPosts /> : <Navigate to='/'/> } />
            <Route path="/gamenews" element={<GameNews />} />
        </Routes>
        </BrowserRouter>
    );

}

const IndexPage = () => {

  const slideImages = [
    'https://cdn.pixabay.com/photo/2016/11/04/03/20/cat-1796834_640.jpg',
    'https://thumb.photo-ac.com/f3/f36c375c339f1212cceb122fdb9d0808_t.jpeg',
    'https://memeprod.ap-south-1.linodeobjects.com/user-template/ceded397639ef369a044490617be3b74.png'
  ];

  return (
    <Container>

          <Slide>
            {slideImages.map((each, index) => (
              <div key={index} className="each-slide">
                <div style={{ 'backgroundImage': `url(${each})` }}>
                </div>
              </div>
            ))}
          </Slide>
          <h1>公告</h1>
          <p>
          1.用戶隱私與安全：確保用戶的個人信息和數據安全，遵守相關法律法規（如GDPR），並提供適當的隱私政策和安全措施。
          <br/>
          2.社群管理與規範：建立明確的社群管理規範，包括禁止令、版規等，以維護良好的社群秩序和氛圍。
          <br/>
          3.內容審核與過濾：建立內容審核機制，避免不當內容的出現，保護用戶的健康和利益。
          </p>
          <h1>討論文章</h1>
          <Posts></Posts>


    </Container>
  );

}


const PostViewLayout = () => {
    return (
      <Container>
        <Grid>
          <Grid.Row>
            <Grid.Column width={3}>
              <Topics />
            </Grid.Column>
            <Grid.Column width={10}>
              <Outlet />
            </Grid.Column>
            <Grid.Column width={3}></Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    );
  };

  const MyPageViewLayout = ({user}) => {

    return (
      <>
      {user ? (
      <Container>
        <Grid>
          <Grid.Row>
            <Grid.Column width={3}>
                <MyMenu />
            </Grid.Column>
            <Grid.Column width={10}>
              <Outlet />
            </Grid.Column>
            <Grid.Column width={3}></Grid.Column>
          </Grid.Row>
        </Grid>
      </Container> 
    ):( 
      <Navigate to='/'/>
    )}
    </>
    );
  };

export default App;