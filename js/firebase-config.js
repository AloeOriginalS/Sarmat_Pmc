import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBJ6VkW6Kru9xLnyN8G1EvS4gKESEoHH68",
    authDomain: "authentication-cf670.firebaseapp.com",
    projectId: "authentication-cf670",
    storageBucket: "authentication-cf670.firebasestorage.app",
    messagingSenderId: "135324689233",
    appId: "1:135324689233:web:e0956a8ee78ca5aeff2970",
    measurementId: "G-VXJY0F36N1"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
