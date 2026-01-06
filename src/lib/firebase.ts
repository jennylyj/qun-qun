import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyAmRLQxqKXHdAOEzfcVO3iedy281G5kkMc",
  authDomain: "qun-qun-bbe51.firebaseapp.com",
  projectId: "qun-qun-bbe51",
  storageBucket: "qun-qun-bbe51.firebasestorage.app",
  messagingSenderId: "752268369016",
  appId: "1:752268369016:web:cb3056d78db1b05d2f618d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);
