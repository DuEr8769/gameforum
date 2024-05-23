import { useState, useEffect } from 'react';
import { Grid, Container, Header, Button } from 'semantic-ui-react';
import firebase from "../utils/firebase";

function Rewards() {

    const [userPoints, setUserPoints] = useState("");
    const [rewardsTitle, setRewardsTitle] = useState([]);
    const [redeemedRewards, setRedeemedRewards] = useState([]);

    useEffect(() => {
        let isMounted = true;
    
        firebase
          .firestore()
          .collection("userpoints")
          .doc(firebase.auth().currentUser.uid)
          .get()
          .then((collectionSnapshot) => {
            if (!isMounted) return;
    
            setUserPoints(collectionSnapshot.data().points);
          });
    
        return () => {
          isMounted = false;
        };
      }, []);

      useEffect(() => {
        const fetchItems = async () => {
            const doc = await firebase.firestore().collection('rewards').doc('title').get();
            const data = doc.data();
            const names = data.name || [];
            const points = data.needpoints || [];
            const rewards = names.map((name, index) => ({ name, points: points[index] }));
            setRewardsTitle(rewards);

        };
    
        fetchItems();
      }, []);

      
      const handleRedeem = async (points, name) => {
        const userDocRef = firebase.firestore().collection("userpoints").doc(firebase.auth().currentUser.uid);
        const userDoc = await userDocRef.get();
        const userPoints = userDoc.data().points;
    
        if (userPoints >= points) {
            await userDocRef.update({
                points: userPoints - points,
                redeemedRewards: firebase.firestore.FieldValue.arrayUnion(name)
            });
            alert('兌換成功！');
            // 更新使用者積分
            const updatedDoc = await firebase.firestore().collection("userpoints").doc(firebase.auth().currentUser.uid).get();
            setUserPoints(updatedDoc.data().points);
    
            // 標記已兌換的獎勵
            setRedeemedRewards([...redeemedRewards, name]);
        } else {
            alert('積分不足！');
        }
    };

    useEffect(() => {
        const fetchRedeemedRewards = async () => {
            const userDocRef = firebase.firestore().collection("userpoints").doc(firebase.auth().currentUser.uid);
            const userDoc = await userDocRef.get();
            const redeemed = userDoc.data().redeemedRewards || [];
            setRedeemedRewards(redeemed);
        };
    
        fetchRedeemedRewards();
    }, []);

    return (
        <>
        <Container>
            <Header size='large' >積分兌換商城</Header>
            <Header>你的積分：{userPoints}</Header>
            <div style={{ height: '50px' }}></div>
            <Grid columns={4} doubling>
            {rewardsTitle.map((reward, index) => (
            <Grid.Column key={index} style={{ padding: '10px', textAlign: 'center', border: '1px solid #ccc' }}>
                <Header>{reward.name}</Header>
                <p>所需點數 : {reward.points}</p>
                {redeemedRewards.includes(reward.name) ? (
                    <Button disabled style={{ marginTop: '20px' }}>已兌換</Button>
                ) : (
                    <Button primary style={{ marginTop: '20px' }} onClick={() => handleRedeem(reward.points, reward.name)}>兌換</Button>
                )}
            </Grid.Column>
             ))}
            </Grid>
        </Container>
        </>
    );
}

export default Rewards;