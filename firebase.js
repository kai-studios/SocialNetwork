// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "", // Your API key
  authDomain: "", // Your authDomain
  databaseURL: "", // Your databaseURL
  projectId: "", // Your projectId
  storageBucket: "", // Your storageBucket
  messagingSenderId: "", // Your messagingSenderId
  appId: "", // Your appId
  measurementId: "" // measurementId
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
