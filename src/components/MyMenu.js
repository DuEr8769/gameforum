import { List } from "semantic-ui-react";
import "firebase/compat/firestore";
import { Link, useLocation } from 'react-router-dom';


function MyMenu() {

    const location = useLocation() ;

    const menuItems = [{
        name: '我的文章',
        path: 'posts',
    }, {
        name: '我的收藏',
        path: 'collections',
    }, {
        name: '會員資料',
        path: 'settings',
    }]

    return (
    <List animated selection>
        {menuItems.map((menuItem) => {
        return (
        <List.Item 
        as={Link} 
        to={menuItem.path} 
        key={menuItem.name} 
        active={'/my/'+ menuItem.path === location.pathname} >
            {menuItem.name} 
        </List.Item>
        );
    })}
    </List> 
    );
}

export default MyMenu;