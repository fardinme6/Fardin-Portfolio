// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey: "AIzaSyANYaeLBu4FM8A5z7UUxrMb2y-VciKprUU",
  authDomain: "fardin-portfolio-cms.firebaseapp.com",
  projectId: "fardin-portfolio-cms",
  storageBucket: "fardin-portfolio-cms.firebasestorage.app",
  messagingSenderId: "768552406928",
  appId: "1:768552406928:web:22848e661a36b5b874ed15"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);