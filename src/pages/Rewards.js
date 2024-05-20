import { useState, useEffect } from 'react';
import { List, Button, Message, Container } from 'semantic-ui-react';
import firebase from "../utils/firebase";

function Rewards() {
    const [rewards, setRewards] = useState([]);
    const [userPoints, setUserPoints] = useState(0);
    const [message, setMessage] = useState('');
    const currentUser = firebase.auth().currentUser;

    useEffect(() => {
        firebase.firestore().collection('rewards').get().then((querySnapshot) => {
            const data = querySnapshot.docs.map((doc) => doc.data());
            setRewards(data);
        });

        if (currentUser) {
            firebase.firestore().collection('users').doc(currentUser.uid).get().then((doc) => {
                if (doc.exists) {
                    setUserPoints(doc.data().points);
                }
            });
        }
    }, [currentUser]);

    function handleRedeem(reward) {
        if (userPoints < reward.pointsRequired) {
            setMessage('你的積分不足');
            return;
        }

        const userRef = firebase.firestore().collection('users').doc(currentUser.uid);
        userRef.update({
            points: firebase.firestore.FieldValue.increment(-reward.pointsRequired)
        }).then(() => {
            setMessage('兌換成功');
            setUserPoints(userPoints - reward.pointsRequired);
        });
    }

    return (
        <>
        <Container>
            <h1>積分兌換商城</h1>
            <p>你的積分：{userPoints}</p>
            {message && <Message>{message}</Message>}
            <List>
                {rewards.map((reward) => (
                    <List.Item key={reward.name}>
                        <List.Content>
                            <List.Header>{reward.name}</List.Header>
                            <List.Description>所需積分：{reward.pointsRequired}</List.Description>
                            <Button onClick={() => handleRedeem(reward)}>兌換</Button>
                        </List.Content>
                    </List.Item>
                ))}
            </List>
      </Container>
     </>
    );
}

export default Rewards;