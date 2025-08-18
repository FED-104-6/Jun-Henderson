// Import the functions you need from the SDKs you need
import { FirebaseError, initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
export const environment = {
  production: false,
  firebase: {
    apiKey: "AIzaSyDqkbDShta8lIML7fF2UB_0fK3pfyiESYc",
    authDomain: "flatfinder-96fd4.firebaseapp.com",
    projectId: "flatfinder-96fd4",
    storageBucket: "flatfinder-96fd4.firebasestorage.app",
    messagingSenderId: "889128015028",
    appId: "1:889128015028:web:764bf1922571a6206333e1"
  },
};

// Initialize Firebase
const app = initializeApp(environment.firebase);
