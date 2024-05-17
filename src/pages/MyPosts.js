import { useEffect, useState } from 'react';
import { Item, Header } from 'semantic-ui-react';

import firebase from "../utils/firebase";
import Post from "../components/Post";

function MyPosts() {

    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        
        firebase
        .firestore()
        .collection("posts")
        .where("author.uid", "==", firebase.auth().currentUser.uid)
        .get()
        .then((collectionSnapshot) => {
            const data = collectionSnapshot.docs.map(docSnapshot => {
                const id = docSnapshot.id;
                return { ...docSnapshot.data(), id};
            });
            setPosts(data);
            setLoading(false);
        });

        return () => { 
            isMounted = false; 
        };

    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <>
        <Header>我的文章</Header>
        <Item.Group>
            {posts.map((post) => {
                return (
                    <Post post={post} key={post.id}/>
                    );
            })}
        </Item.Group>
        </>
    );
}


export default MyPosts;