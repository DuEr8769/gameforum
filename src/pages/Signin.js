import {useState}from "react"; 
import { Menu, Form, Container, Message } from 'semantic-ui-react';
import { useNavigate } from 'react-router-dom';
import 'firebase/compat/auth';
import firebase from '../utils/firebase';

function Signin() {
    const navigate = useNavigate();
    const [activeItem,setActiveItem] = useState('register');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);



    function onSubmit(e) {
        e.preventDefault();
        setIsLoading(true);
        if (activeItem === 'register') {
            firebase
            .auth()
            .createUserWithEmailAndPassword(email, password)
            .then(() => {
                setEmail(''); 
                setPassword('');
                setErrorMessage('');
                setIsLoading(false);
                navigate('/my/settings');
            })
            .catch((error) => {
                switch(error.code) {
                    case 'auth/email-already-in-use':
                        setErrorMessage('信箱已存在');
                        break;
                    case 'auth/invalid-email':
                        setErrorMessage('信箱格式不正確');
                        break;
                    case 'auth/weak-password':
                        setErrorMessage('密碼強度不足');
                        break;
                    default:
                        setErrorMessage('註冊失敗，請稍後再試');
                }
                setIsLoading(false);
            });
        }
        else if(activeItem === 'signin'){
            firebase
            .auth()
            .signInWithEmailAndPassword(email, password)
            .then(() => {
                setEmail('');
                setPassword('');
                setErrorMessage('');
                setIsLoading(false);
                navigate('/');
            })
            .catch((error) => {
                if (error.code === "auth/invalid-email"){
                    setErrorMessage('信箱格式不正確');
                }
                else {
                    setErrorMessage('信箱不存在或密碼錯誤');
                }
                setIsLoading(false);
            });
        }
    }

    return (
    <Container>
    <Menu widths="2">
        <Menu.Item 
          active={activeItem === 'register'} 
          onClick={() => {
            setErrorMessage("");
            setActiveItem('register');
          }}
        >
            註冊
        </Menu.Item>
        <Menu.Item 
          active={activeItem === 'signin'} 
          onClick={() => {
            setErrorMessage("");
            setActiveItem('signin');
          }}
        >
            登入
        </Menu.Item>
    </Menu>
    <Form onSubmit={onSubmit}>
        <Form.Input 
        label="信箱" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
        placeholder="請輸入信箱" 
        />
        <Form.Input 
        label="密碼" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)}
        placeholder="請輸入密碼" 
        type="password"
        />
        {errorMessage && <Message negative>{errorMessage}</Message>}
        <Form.Button loading={isLoading}>
            {activeItem === 'register' && '註冊'}
            {activeItem === 'signin' && '登入'}
        </Form.Button>
    </Form> 
    </Container>
    );
}

export default Signin;