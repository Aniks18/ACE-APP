import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAWdwkNGa5oi85bmnc5gYvAE6rZTKIEov0",
  authDomain: "swasthya-app-uhack.firebaseapp.com",
  projectId: "swasthya-app-uhack",
  storageBucket: "swasthya-app-uhack.appspot.com",
  messagingSenderId: "1035017149941",
  appId: "1:1035017149941:web:494e500326fcbe52e014bc",
  measurementId: "G-FFQNK74BPQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export {
  auth,
  db,
  googleProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup
};
export default app;