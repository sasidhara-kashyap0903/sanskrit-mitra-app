// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDcSBGY5uRf5-KSS8qCL7uyiN0bdG7HCFc",
  authDomain: "sasnkrit-mitra-app.firebaseapp.com",
  projectId: "sasnkrit-mitra-app",
  storageBucket: "sasnkrit-mitra-app.firebasestorage.app",
  messagingSenderId: "930289396247",
  appId: "1:930289396247:web:043e7c1b95434f69b94a52",
  measurementId: "G-R3C6VFLPSR"
};



// Initialize Firebase if no app is already initialized
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);

import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const googleSigninBtn = document.getElementById("google-signin-btn");

googleSigninBtn.addEventListener("click", () => {
  console.log('Google Sign-In button clicked!');
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth, provider)
    .then((result) => {
      // Signed in
      console.log("Signed in with Google:", result.user);
    })
    .catch((error) => console.error("Google Sign-In error:", error));
});