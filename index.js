import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
import { getFirestore, collection, addDoc, doc, setDoc } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, updateProfile, signOut } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";
import { getDocs, onSnapshot, query, orderBy } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCBfaiRf2YGnvDGlAwgO81EoK__GKJHjdk",
  authDomain: "message-board-e007c.firebaseapp.com",
  projectId: "message-board-e007c",
  storageBucket: "message-board-e007c.firebasestorage.app",
  messagingSenderId: "534773699561",
  appId: "1:534773699561:web:ab1cf80cde0cc212c37178",
  measurementId: "G-5PNZWB9BV2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);


onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("User signed in:", user.displayName || user.email);
    signInButton.textContent = "Account";
    signInButton.href = "account.html";
  } else {
  }
});