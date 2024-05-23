import { useState, useEffect } from "react";
import { Container, Header, Form, Image, Button } from "semantic-ui-react";
import { useNavigate } from "react-router-dom";
import "firebase/compat/firestore";
import "firebase/compat/storage";
import firebase from "../utils/firebase";

function NewPosts() {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [topics, setTopics] = useState([]);
    const [topicsName, setTopicsName] = useState("");
    const [file, setFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [nowTitle, setNowTitle] = useState('');

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

    const options = topics.map(topics => {
        return {
            text: topics.name,
            value: topics.name,
        };
    });

    const previewUrl = file 
    ? URL.createObjectURL(file) 
    :"https://upload.wikimedia.org/wikipedia/commons/7/78/Image.jpg";

    useEffect(() => {
        const user = firebase.auth().currentUser;
        if (user) {
            const titlename = firebase.firestore().collection('userpoints').doc(user.uid);
            titlename.get().then((doc) => {
                const data = doc.data();
                setNowTitle(data.nowtitle); 
            });
        }
    }, []);


    function onSubmit() {
        setIsLoading(true);
        const userRef = firebase.firestore().collection('userpoints').doc(firebase.auth().currentUser.uid);
        const documentRef = firebase.firestore().collection('posts').doc();
        const fileRef = firebase.storage().ref('post-image/' + documentRef.id);
        const metadata = {
            contentType: file.type,
        };
        fileRef.put(file, metadata).then(() => {
            fileRef.getDownloadURL().then((imageUrl) => {
                documentRef
                .set({
                    title: title,
                    content: content,
                    topic: topicsName,
                    createdAt: firebase.firestore.Timestamp.now(),
                    author: {
                        titlename: nowTitle || '',
                        displayName: firebase.auth().currentUser.displayName || '',
                        photoURL: firebase.auth().currentUser.photoURL || '',
                        uid: firebase.auth().currentUser.uid,
                        email: firebase.auth().currentUser.email,
                    },
                    imageUrl,
                })
                .then(() => {
                    setIsLoading(false);
                    navigate("/posts");

                    const batch = firebase.firestore().batch();
                    batch.update(userRef, {
                        points: firebase.firestore.FieldValue.increment(5)
                    });
                    batch.commit().then(() => {
                        console.log("Points updated successfully");
                    }).catch((error) => {
                        console.error("Error updating points: ", error);
                    });
                });
            });
        });

       
    }

    return <Container>
        <Header>發表文章</Header>
        <Form onSubmit={onSubmit}>
            <Image 
            src={previewUrl} 
            size="small" 
            floated="left"
            />
            <Button basic as="label" htmlFor="post-image">上傳文章圖片</Button>
            <Form.Input 
            type="file" 
            id ="post-image" 
            style={{ display: 'none'}} 
            onChange={(e) => setFile(e.target.files[0])}
            />
            <Form.Input 
            placeholder="輸入文章標題" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)}
            />
            <Form.TextArea 
            placeholder="輸入文章內容" 
            value={content} 
            onChange={(e) => setContent(e.target.value)}
            />
            <Form.Dropdown
            placeholder="選擇文章主題" 
            options={options}
            selection
            value={topicsName}
            onChange={(e, { value }) => setTopicsName(value)}
            />
            <Form.Button loading={isLoading}>送出</Form.Button>
        </Form>
    </Container> ;
}

export default NewPosts;