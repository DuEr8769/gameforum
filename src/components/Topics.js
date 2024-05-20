import { useEffect, useState } from 'react';
import { List } from "semantic-ui-react";
import { Link, useLocation } from 'react-router-dom';
import "firebase/compat/firestore";
import firebase from "../utils/firebase";


function Topics() {
    const location = useLocation();
    const urlSearchParams = new URLSearchParams(location.search);
    const currentTopics = urlSearchParams.get('topic');
    const [topics, setTopics] = useState([]);

    useEffect( () => {
        firebase
        .firestore()
        .collection("topics")
        .get()
        .then( (collectionSnapshot) => {
           const data = collectionSnapshot.docs.map( (doc) => {
                return doc.data();
            });
            setTopics(data);
        } );
    }, []);
    
    return <List animated selection>
        {topics.map(topics => {
        return <List.Item 
        key={topics.name} 
        as={Link} 
        to ={`/posts?topic=${topics.name}`} 
        active = {currentTopics === topics.name}
        >
        {topics.name} 
        </List.Item>;
    })}

    </List> ;
}

export default Topics;