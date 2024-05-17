import { useEffect, useState } from 'react';
import { Grid, Item, Image, Icon, Container } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

import firebase from "../utils/firebase";
import Topics from '../components/Topics';

function Posts() {

    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        
        firebase
        .firestore()
        .collection("posts")
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
    <Container>
    <Grid>
        <Grid.Row>
            <Grid.Column width={3}> <Topics /> </Grid.Column>
            <Grid.Column width={10}>
                <Item.Group>
                    {posts.map((post) => {
                        return (
                        <Item key = {post.id} as={Link} to={ `/posts/${post.id}`} >
                            <Item.Image src = {post.imageUrl || 
                                "https://upload.wikimedia.org/wikipedia/commons/7/78/Image.jpg"
                            } size="small"/>
                            <Item.Content>
                                <Item.Meta>
                                    {post.author.photoURL ? ( 
                                      <Image src = {post.author.photoURL} /> 
                                    ) : (
                                      <Icon name="user circle"/> 
                                    )}
                                    {post.topic}。{post.author.displayName || '使用者'}
                                </Item.Meta>
                                <Item.Header> {post.title} </Item.Header>
                                <Item.Description> {post.content} </Item.Description>
                                <Item.Extra>
                                    留言 {post.commentsCount || 0}。讚 {post.likedBy?.length || 0}
                                </Item.Extra>
                            </Item.Content>
                        </Item>
                         );
                    })}
                </Item.Group>
            </Grid.Column>
            <Grid.Column width={3}>789</Grid.Column>
        </Grid.Row>
    </Grid>
    </Container>
);
}


export default Posts;