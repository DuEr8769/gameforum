import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { Container, Grid } from 'semantic-ui-react';

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
    return (
        <BrowserRouter>
        <BrowserRouter basename="/gameforum" />.
        <Header />
        <Routes>
            <Route path="/" element={"首頁"} />

            <Route path="/posts" element={<PostViewLayout />}>
            <Route index element={<Posts />} />
            <Route path=":postId" element={<Post />} />
            </Route>

            <Route path="/my" element={<MyPageViewLayout />}>
            <Route index element={""} />
            <Route path="posts" element={<MyPosts />} />
            <Route path="collections" element={<MyCollection />} />
            <Route path="settings" element={<MySettings />} />
            </Route>

            <Route path="/signin" element={<Signin />} />
            <Route path="/new-post" element={<NewPosts />} />
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

  const MyPageViewLayout = () => {
    return (
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
    );
  };

export default App;