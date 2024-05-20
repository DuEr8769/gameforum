import { Button, Header, Input, Modal, Segment, Image} from "semantic-ui-react";

import 'firebase/compat/auth';
import firebase from '../utils/firebase';
import { useEffect, useState } from "react";



function MyName({ user }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [displayName, setDisplayName] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    function onSubmit() {
        setIsLoading(true);
        user.updateProfile({
            displayName,
        }).then(() => {
            setIsLoading(false);
            setDisplayName('');
            setIsModalOpen(false);
        });
    }

    return(
        <>
        <Header size="small">
            會員名稱
        <Button floated="right" onClick={() => setIsModalOpen(true)}>修改</Button>
        </Header>
        <Segment vertical>
            {user.displayName}
        </Segment>
        <Modal open={isModalOpen} size="mini">
            <Modal.Header>修改會員名稱</Modal.Header>
            <Modal.Content>
                <Input 
                placeholder="輸入新的會員名稱" 
                value={displayName}
                onChange={e => setDisplayName(e.target.value)}
                fluid
                />
            </Modal.Content>
            <Modal.Actions>
                <Button onClick={() => setIsModalOpen(false)}>取消</Button>
                <Button onClick={onSubmit} loading={isLoading}>修改</Button>
            </Modal.Actions>
        </Modal>
        </>
    );
}

function MyPhoto({ user }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [file, setFile] = useState(null);

    const previewImageUrl = file ? URL.createObjectURL(file) : user.photoURL;

    function onSubmit() {
        setIsLoading(true);
        const fileRef = firebase.storage().ref('user-photos/' + user.uid);
        const metadata = {
            contentType: file.type,
        };
        fileRef.put(file, metadata).then(() => {
            fileRef.getDownloadURL().then((imageUrl) => {
                user.updateProfile({
                    photoURL: imageUrl,
                })
                .then(() => {
                    setIsLoading(false);
                    setFile('');
                    setIsModalOpen(false);
                });
                });
            });
    };
    

    return(
        <>
        <Header size="small">
            會員照片
        <Button floated="right" onClick={() => setIsModalOpen(true)}>修改</Button>
        </Header>
        <Segment vertical>
            <Image src={user.photoURL} avatar style={{ transform: 'scale(1.5)' }}/>
        </Segment>
        <Modal open={isModalOpen} size="mini" >
            <Modal.Header>修改會員照片</Modal.Header>
            <Modal.Content image>
                <span style={{ marginRight: '30px' }}/>
                <Image src={previewImageUrl} avatar wrapped style={{ transform: 'scale(2.3)' }}/>
                <Modal.Description>
                    <Button 
                    as="label"
                    htmlFor="post-image"
                    >
                        上傳
                    </Button>
                    <Input 
                    type='file' 
                    id='post-image'
                    style={{display: 'none'}} 
                    onChange={(e) => setFile(e.target.files[0])}/>
                </Modal.Description>
            </Modal.Content>
            <Modal.Actions>
                <Button onClick={() => setIsModalOpen(false)}>取消</Button>
                <Button onClick={onSubmit} loading={isLoading}>修改</Button>
            </Modal.Actions>
        </Modal>
        </>
    );
}

function MyPassword({ user }) {

    const [isLoading, setIsLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');

    function onSubmit() {
        setIsLoading(true);
        const credential = firebase.auth.EmailAuthProvider.credential(
            user.email, 
            oldPassword
        );
        user.reauthenticateWithCredential(credential).then(() => {
            user.updatePassword(newPassword).then(() => {
                setIsModalOpen(false);
                setOldPassword('');
                setNewPassword('');
                setIsLoading(false);
            })
        });
        user.updatePassword(newPassword);
    }

    return (
    <>
        <Header size="small">
        會員密碼
        <Button floated="right" onClick={() => setIsModalOpen(true)}>修改</Button>
        </Header>
        <Segment vertical>
        ******
        </Segment>
        <Modal open={isModalOpen} size="mini" >
            <Modal.Header>修改會員密碼</Modal.Header>
                <Modal.Content>
                    <Header size="small">
                        目前密碼
                    </Header>
                    <Input 
                    placeholder="輸入舊密碼" 
                    value={oldPassword}
                    onChange={e => setOldPassword(e.target.value)}
                    fluid
                    />
                    <Header size="small">
                        新密碼
                    </Header>
                    <Input 
                    placeholder="輸入新密碼" 
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    fluid
                    />
                </Modal.Content>
            <Modal.Actions>
                <Button onClick={() => setIsModalOpen(false)}>取消</Button>
                <Button onClick={onSubmit} loading={isLoading}>修改</Button>
            </Modal.Actions>
        </Modal>
    </>
    );
}

function MyRewards() {
    const [activated, setActivated] = useState(false);
    const documentRef = firebase.firestore().collection('userpoints').doc(firebase.auth().currentUser.uid);

    useEffect(() => {
        const unsubscribe = documentRef.onSnapshot((doc) => {
            if (doc.exists) {
                setActivated(true);
            } else {
                setActivated(false);
            }
        });

        return () => unsubscribe();
    }, []);

    function onSubmit() {
        documentRef
            .set({
                points: 0,
            })
            .then(() => {
                localStorage.setItem('activated', 'true');
                setActivated(true);
            });
    }

    return (
        <>
            <Header size="small">
                積分系統
                <Button floated="right" onClick={onSubmit} disabled={activated}>
                    {activated ? '已啟用' : '啟用'}
                </Button>
            </Header>
        </>
    );
}

function MySettings() {
    const [user, setUser] = useState({});

    useEffect(() => {
        firebase.auth().onAuthStateChanged((currentUser) => {
            setUser(currentUser)
        });
    }, []);

    return(
        <>
        <Header>會員資料</Header>
        <MyName user={user} />
        <MyPhoto user={user} />
        <MyPassword user={user} />
        <MyRewards />
        </>
    );

}

export default MySettings;