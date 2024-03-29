
import { initializeApp } from 'firebase/app';
import {  getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage'; // Import Firebase Storage module


 const firebaseConfig = {
  apiKey: "AIzaSyAt6oPJWl5PUzndx-3RDIm3LNWs-WbAWmo",
  authDomain: "event-hall-7cd00.firebaseapp.com",
  projectId: "event-hall-7cd00",
  storageBucket: "event-hall-7cd00.appspot.com",
  messagingSenderId: "214604952500",
  appId: "1:214604952500:web:b62905f086993949c1b8e1",
  measurementId: "G-3RVYL8WXGY"
  };
  
  
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const firestore = getFirestore(app);
  const db = getFirestore(app);
  const storage = getStorage(app); // Initialize Firebase Storage

  export { auth , app ,firestore,db,storage};

