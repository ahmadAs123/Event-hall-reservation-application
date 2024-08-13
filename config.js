import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage'; 
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyAt6oPJWl5PUzndx-3RDIm3LNWs-WbAWmo",
  authDomain: "event-hall-7cd00.firebaseapp.com",
  projectId: "event-hall-7cd00",
  storageBucket: "event-hall-7cd00",
  messagingSenderId: "214604952500",
  appId: "1:214604952500:web:b62905f086993949c1b8e1",
  measurementId: "G-3RVYL8WXGY"
};

const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth with AsyncStorage for persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

const firestore = getFirestore(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, app, firestore, db, storage };

