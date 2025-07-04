// File: src/firebase/config.js
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NAIzaSyBrGs8lyhw-qawWQZ1Qcj6yUffN79Gdh0U,
  authDomain: process.env.vozz-os.firebaseapp.com,
  projectId: process.env.vozz-os,
  storageBucket: process.env.vozz-os.firebasestorage.app,
  messagingSenderId: process.env.128985569447,
  appId: process.env.1:128985569447:web:1b5958a3330a2bbbfd6382
};

// Initialize Firebase
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
}

const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };