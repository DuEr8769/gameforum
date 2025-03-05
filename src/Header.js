import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Menu, Search } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import 'firebase/compat/auth';
import firebase from './utils/firebase';

import algolia from "./utils/algolia";

function Header({user}) {
    const navigate = useNavigate();
    const [inputValue, setInputValue] = useState('');
    const [results, setResults] = useState([]);

    function onSearchChange(e, { value }) {
        setInputValue(value);

        algolia.search(value).then((result) => {
            const searchResults = result.hits.map(hit => {
                return {
                    title: hit.title,
                    description: hit.description,
                    id: hit.objectID
                };
            });
            setResults(searchResults);
        });
    }

    function onResultSelect(e, { result }){
        navigate(`/posts/${result.id}`);
    }

    return (
    <Menu>
         
        <Menu.Item as={Link} to="/">啊哈姆特遊戲論壇</Menu.Item>
        <Menu.Item as={Link} to="/posts">討論</Menu.Item>
        <Menu.Menu position='right'>
            <Menu.Item > 
            <Search
                value={inputValue}
                onSearchChange={onSearchChange}
                results={results}
                noResultsMessage="找不到相關文章"
                onResultSelect={onResultSelect}
            /> 
            </Menu.Item>
                {user ?(<>
                    <Menu.Item as={Link} to="/new-post">發表文章</Menu.Item>
                    <Menu.Item as={Link} to="/my/posts">會員</Menu.Item>
                    <Menu.Item as={Link} to="/rewards">積分兌換</Menu.Item>
                    <Menu.Item onClick={() => firebase.auth().signOut()}>登出</Menu.Item>
                </>):(
                    <Menu.Item as={Link} to="/signin">註冊/登入</Menu.Item>
                )
                }
        </Menu.Menu>
    
    </Menu>
    );
}

export default Header;