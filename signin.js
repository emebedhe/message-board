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

// Get the sign-out button
const signOutButton = document.getElementById("signOutButton");

// Show/hide forms based on auth state
const authForm = document.getElementById("authForm");
const messageForm = document.getElementById("myForm");

onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("User signed in:", user.displayName || user.email);
    if (window.location.pathname !== "/index.html") {
      window.location.href = "index.html";
    }
  } else {

  }
});

// Handle Sign Up / Sign In
authForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = authForm.username.value.trim();
  const email = authForm.email.value.trim();
  const password = authForm.password.value;

  try {
    // Try to sign up first
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update the Firebase Auth profile with username
    await updateProfile(user, { displayName: username });

    // Store user data in Firestore
    await setDoc(doc(db, "users", user.uid), {
      username: username,
      email: email,
      createdAt: new Date()
    });

    alert("Sign up successful!");
  } catch (signUpError) {
    if (signUpError.code === "auth/email-already-in-use") {
      // If already exists, sign in instead
      try {
        await signInWithEmailAndPassword(auth, email, password);
        alert("Signed in successfully!");
        window.location.href = "index.html";
      } catch (signInError) {
        alert("Error signing in: " + signInError.message);
      }
    } else {
      alert("Error signing up: " + signUpError.message);
    }
  }

  authForm.reset();
});

// Handle the sign-out action
signOutButton.addEventListener("click", async () => {
  try {
    await signOut(auth); // Log the user out
    alert("You have been signed out.");
  } catch (error) {
    console.error("Error signing out:", error);
    alert("Error signing out: " + error.message);
  }
});