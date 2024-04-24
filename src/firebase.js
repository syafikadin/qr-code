// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCym4FG3ndExosyVHBhU-HtQpcMNIWxrsU",
    authDomain: "scan-qr-code-35792.firebaseapp.com",
    projectId: "scan-qr-code-35792",
    storageBucket: "scan-qr-code-35792.appspot.com",
    messagingSenderId: "1043079441024",
    appId: "1:1043079441024:web:3ca41756bf8f265c9c5465"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app)