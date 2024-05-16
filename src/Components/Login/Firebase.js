// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCi9FCQxPfQJ-YBBNIxt5PSd2FXQ_mjvP4",
  authDomain: "auth-8a290.firebaseapp.com",
  projectId: "auth-8a290",
  storageBucket: "auth-8a290.appspot.com",
  messagingSenderId: "371855798107",
  appId: "1:371855798107:web:4761744f9e99d73637b47e",
  measurementId: "G-8NQNQL5CGC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const Firebase ={
    app,
    analytics
}