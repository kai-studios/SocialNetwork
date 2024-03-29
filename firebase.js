// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA4BVG7Ypwa6VI0ADTEcqwHj6px_CGCUoY",
  authDomain: "socialnetwork-37297.firebaseapp.com",
  databaseURL: "https://socialnetwork-37297-default-rtdb.firebaseio.com",
  projectId: "socialnetwork-37297",
  storageBucket: "socialnetwork-37297.appspot.com",
  messagingSenderId: "775756757662",
  appId: "1:775756757662:web:6f08910940368b8cb8198f",
  measurementId: "G-K163T0HH32"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);