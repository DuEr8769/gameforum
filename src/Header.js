import React from 'react';
import { Menu, Search } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import 'firebase/compat/auth';
import firebase from './utils/firebase';


function Header() {

    const [user, setUser] = React.useState(null);
    React.useEffect(() => {
        firebase.auth().onAuthStateChanged((currentUser) => {
            setUser(currentUser)
        });
    }, []);

    return<Menu>
        <Menu.Item as={Link} to="/">啊哈姆特遊戲論壇</Menu.Item>
        <Menu.Item as={Link} to="/gamenews">遊戲</Menu.Item>
        <Menu.Item as={Link} to="/posts">討論</Menu.Item>
        <Menu.Menu position='right'>
            <Menu.Item > <Search/> </Menu.Item>
                {user ?(<>
                    <Menu.Item as={Link} to="/new-post">發表文章</Menu.Item>
                    <Menu.Item as={Link} to="/my">會員</Menu.Item>
                    <Menu.Item onClick={() => firebase.auth().signOut()}>登出</Menu.Item>
                </>):(
                    <Menu.Item as={Link} to="/signin">註冊/登入</Menu.Item>
                )
                }
        </Menu.Menu>
    </Menu>;
}

export default Header;