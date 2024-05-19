import { useEffect, useRef, useState } from 'react';
import { Item } from 'semantic-ui-react';
import { useLocation } from 'react-router-dom';
import { Waypoint } from 'react-waypoint';


import firebase from "../utils/firebase";
import Post from "../components/Post";

function Posts() {
    const location = useLocation();
    const urlSearchParams = new URLSearchParams(location.search);
    const currentTopics = urlSearchParams.get('topic');
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const lastPostSnapshotRef = useRef();

    useEffect(() => {
        let isMounted = true;
        if(currentTopics) {
            firebase
            .firestore()
            .collection("posts")
            .where("topic", "==", currentTopics)
            .orderBy('createdAt', 'desc')
            .limit(4)
            .get()
            .then((collectionSnapshot) => {
                const data = collectionSnapshot.docs.map(docSnapshot => {
                    const id = docSnapshot.id;
                    return { ...docSnapshot.data(), id};
                });
                lastPostSnapshotRef.current = 
                collectionSnapshot.docs[collectionSnapshot.docs.length - 1];
                setPosts(data);
                setLoading(false);
            });
        }
        else {
            firebase
            .firestore()
            .collection("posts")
            .orderBy('createdAt', 'desc')
            .limit(6)
            .get()
            .then((collectionSnapshot) => {
                const data = collectionSnapshot.docs.map(docSnapshot => {
                    const id = docSnapshot.id;
                    return { ...docSnapshot.data(), id};
                });
                lastPostSnapshotRef.current = 
                    collectionSnapshot.docs[collectionSnapshot.docs.length - 1];
                setPosts(data);
                setLoading(false);
            });
        }

        return () => { 
            isMounted = false; 
        };

    }, [currentTopics]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <>
        <Item.Group>
            {posts.map((post) => {
                return (
                    <Post post={post} key={post.id} />
                    );
            })}
        </Item.Group>
        <Waypoint onEnter={() => {
            if (lastPostSnapshotRef.current) {
                if(currentTopics) {
                    firebase
                    .firestore()
                    .collection("posts")
                    .where("topic", "==", currentTopics)
                    .orderBy('createdAt', 'desc')
                    .startAfter(lastPostSnapshotRef.current)
                    .limit(4)
                    .get()
                    .then((collectionSnapshot) => {
                        const data = collectionSnapshot.docs.map(docSnapshot => {
                            const id = docSnapshot.id;
                            return { ...docSnapshot.data(), id};
                        });
                        lastPostSnapshotRef.current = 
                        collectionSnapshot.docs[collectionSnapshot.docs.length - 1];
                        setPosts([...posts, ...data]);
                        setLoading(false);
                    });
                }
                else {
                    firebase
                    .firestore()
                    .collection("posts")
                    .orderBy('createdAt', 'desc')
                    .startAfter(lastPostSnapshotRef.current)
                    .limit(4)
                    .get()
                    .then((collectionSnapshot) => {
                        const data = collectionSnapshot.docs.map(docSnapshot => {
                            const id = docSnapshot.id;
                            return { ...docSnapshot.data(), id};
                        });
                        lastPostSnapshotRef.current = 
                        collectionSnapshot.docs[collectionSnapshot.docs.length - 1];
                        setPosts([...posts, ...data]);
                        setLoading(false);
                    });
                }
            }
        }}/>
        </>
    );
}


export default Posts;