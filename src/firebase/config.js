// File: src/firebase/config.js
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/learn-more#config-object
const firebaseConfig = {
  apiKey: "AIzaSyBrGs8lyhw-qawWQZ1Qcj6yUffN79Gdh0U",
  authDomain: "vozz-os.firebaseapp.com",
  projectId: "vozz-os",
  storageBucket: "vozz-os.firebasestorage.app",
  messagingSenderId: "128985569447",
  appId: "1:128985569447:web:1b5958a3330a2bbbfd6382"
};

// Initialize Firebase
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
}

const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };