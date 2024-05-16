import firebase from "firebase/compat/app";
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyAd-zZc6ClG5NCVFua7AoxgVmfBHEG8LzY",
    authDomain: "gameforum-880eb.firebaseapp.com",
    projectId: "gameforum-880eb",
    storageBucket: "gameforum-880eb.appspot.com",
    messagingSenderId: "994604446436",
    appId: "1:994604446436:web:4a01fc9ef61ce1fdbb32f1"
  };

  firebase.initializeApp(firebaseConfig);

  export default firebase;
  