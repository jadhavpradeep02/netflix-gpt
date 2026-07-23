// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAoLyDoOWJ2JargDFmdh2j1ApPt4yIDn5o",
  authDomain: "netflixgpt-b896d.firebaseapp.com",
  projectId: "netflixgpt-b896d",
  storageBucket: "netflixgpt-b896d.firebasestorage.app",
  messagingSenderId: "828315727496",
  appId: "1:828315727496:web:8d28834d375ae6c7e2113d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth();