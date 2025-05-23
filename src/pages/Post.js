import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Image, Header, Segment, Icon, Comment, Form } from 'semantic-ui-react';

import firebase from "../utils/firebase";


function Post() {
    const { postId } = useParams();
    const [post, setPost] = useState({
        author: {},
    });
    const [commentContent, setCommentContent] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [comments, setComments] = useState([]);

    useEffect(() => {
        firebase
        .firestore()
        .collection('posts')
        .doc(postId)
        .onSnapshot((docSnapshot) => {
            const data = docSnapshot.data();
            setPost(data);
        });
    }, [postId]);

    useEffect(() => {
        firebase
          .firestore()
          .collection('posts')
          .doc(postId)
          .collection('comments')
          .orderBy('createdAt')
          .onSnapshot((collectionSnapshot) => {
            const data = collectionSnapshot.docs.map((doc) => {
              return doc.data();
            });
            setComments(data);
          });
      }, [postId]);

    const currentUser = firebase.auth().currentUser;

    function toggle(isActive, field) {
        if (!currentUser) {
            return;
        }
        const uid = currentUser.uid;
        const batch = firebase.firestore().batch();
        const postRef = firebase.firestore().collection('posts').doc(postId);
    
        batch.update(postRef, {
            [field]: isActive
                ? firebase.firestore.FieldValue.arrayRemove(uid)
                : firebase.firestore.FieldValue.arrayUnion(uid),
        });
    
        
        if (field === 'likedBy') {
            const userRef = firebase.firestore().collection('userpoints').doc(uid);
            batch.update(userRef, {
                points: firebase.firestore.FieldValue.increment(isActive ? -5 : 5),
            });
        }
    
        batch.commit().then(() => {
            console.log('Batch write successful!');
        }).catch((error) => {
            console.error('Error updating document: ', error);
        });
    }


    const isCollected = currentUser && post.collectedBy?.includes(currentUser.uid);

    const isLiked = currentUser && post.likedBy?.includes(currentUser.uid);
    
    function onSubmit() {
        if (!currentUser) {
            return;
        }
        setIsLoading(true);
        const firestore = firebase.firestore();

        const batch = firestore.batch();

        const postRef  =  firestore.collection('posts').doc(postId)
        batch.update(postRef, {
            commentsCount: firebase.firestore.FieldValue.increment(1)
        });

        const commentRef = postRef.collection('comments').doc();
        batch.set(commentRef, {
            content: commentContent,
            createdAt: firebase.firestore.Timestamp.now(),
            author: {
                uid: firebase.auth().currentUser.uid,
                displayName: firebase.auth().currentUser.displayName || '',
                photoURL: firebase.auth().currentUser.photoURL || '',
            },
        });

        const userRef = firestore.collection('userpoints').doc(currentUser.uid);
        batch.update(userRef, {
            points: firebase.firestore.FieldValue.increment(5)
        });
    

        batch.commit().then(() => {
            setCommentContent('');
            setIsLoading(false);
        });
    }

    return (    
        <>
        {post.author.photoURL ? (
        <Image src={post.author.photoURL} avatar/>
        ) : (
        <Icon name="user circle" />
        )}
        {post.author.displayName || '使用者'}
        <div>
        <span style={{ fontWeight: 'bold', color: 'red' }}>
                        {post.author.titlename || ''}
        </span>
        </div>
        <Header>
            {post.title}
            <Header.Subheader>
                {post.topic}。{post.createdAt?.toDate().toLocaleDateString()}
            </Header.Subheader>
        </Header>
        <Image src = {post.imageUrl} />
        <Segment basic vertical>
            {post.content}
        </Segment>
        <Segment basic vertical>
            留言 {post.commentsCount || 0}。讚 {post.likedBy?.length || 0} 。
            <Icon name ={`thumbs up${isLiked ? '' : ' outline'} `} 
            color={isLiked ? 'blue' : 'grey'} 
            link
            onClick={() => toggle(isLiked, 'likedBy')} />。
            <Icon name= {`bookmark${isCollected ? '' : ' outline'} `}
            color={isCollected ? 'blue' : 'grey'} 
            link 
            onClick={() => toggle(isCollected, 'collectedBy')} />
        </Segment>
        <Comment.Group>
            <Form >
                <Form.TextArea 
                value={commentContent} 
                onChange={(e) => setCommentContent(e.target.value)} />
                    <Form.Button onClick={onSubmit} loading={isLoading} >
                        留言</Form.Button>
            </Form>
        <Header>共 {post.commentsCount || 0} 則留言 </Header>
        {comments.map((comment) => {
            return (
            <Comment key={comment.createdAt?.seconds} >
                <Comment.Avatar src={comment.author.photoURL} />
                <Comment.Content>
                    <Comment.Author as="span" >{comment.author.displayName || '使用者'}</Comment.Author>
                    <Comment.Metadata> {comment.createdAt.toDate().toLocaleString()} </Comment.Metadata>
                    <Comment.Text>{comment.content}</Comment.Text>
                </Comment.Content>
            </Comment>
            );
        })}
        </Comment.Group>
        </>
    );
}

export default Post;