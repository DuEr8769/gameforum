import { BrowserRouter, Routes, Route, Outlet ,Navigate } from 'react-router-dom';
import { Container, Grid } from 'semantic-ui-react';
import { useEffect, useState } from 'react';
import firebase from './utils/firebase';


import Header from './Header';

import Signin from './pages/Signin';
import GameNews from './pages/GameNews';
import Posts from './pages/Posts';
import NewPosts from './pages/NewPosts';
import Post from './pages/Post';
import MyPosts from './pages/MyPosts';
import MyCollection from './pages/MyCollections';
import MySettings from './pages/MySettings';

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
        <Header user ={ user }/>
        <Routes>
            <Route path="/" element={"首頁"} />

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

            <Route path="/signin" element={user ? <Navigate to='/'/>  : <Signin /> } />
            <Route path="/new-post" element={user ? <NewPosts /> : <Navigate to='/'/> } />
            <Route path="/gamenews" element={<GameNews />} />
        </Routes>
        </BrowserRouter>
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