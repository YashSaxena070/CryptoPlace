import {initializeApp} from "firebase/app"; 
import {getAuth} from "firebase/auth";
import {getAnalytics} from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAjOm8wmdq643NOBrIRB_mfaKr2YyW00uY",
    authDomain: "cryptoplace-477e9.firebaseapp.com",
    projectId: "cryptoplace-477e9",
    storageBucket: "cryptoplace-477e9.firebasestorage.app",
    messagingSenderId: "1031284151537",
    appId: "1:1031284151537:web:e21fde78dfe50a1c728550",
    measurementId: "G-C3244P08GH",
    databaseURL: "https://cryptoplace-477e9-default-rtdb.firebaseio.com",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);