// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA4pK9neJG-_79VqhTnqfEyd8OMsfUyFvY",
  authDomain: "portfolio-d3708.firebaseapp.com",
  projectId: "portfolio-d3708",
  storageBucket: "portfolio-d3708.firebasestorage.app",
  messagingSenderId: "429809644772",
  appId: "1:429809644772:web:8f2723ef5bc945eea928f1",
  measurementId: "G-010XB5TYNR",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
