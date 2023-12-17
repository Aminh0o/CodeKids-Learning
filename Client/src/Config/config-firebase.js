// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCN8CUmufJES5eOS8SX0263YKAfcTgBk2Y",
  authDomain: "testreactapp-fd61e.firebaseapp.com",
  projectId: "testreactapp-fd61e",
  storageBucket: "testreactapp-fd61e.appspot.com",
  messagingSenderId: "233703765725",
  appId: "1:233703765725:web:68c5d49a09f33d47820d34",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
