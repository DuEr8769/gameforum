import { useEffect, useState } from 'react';
import { List } from "semantic-ui-react";
import "firebase/compat/firestore";
import firebase from "../utils/firebase";


function Topics() {
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
        return <List.Item key={topics.name}>{topics.name} </List.Item>;
    })}

    </List> ;
}

export default Topics;