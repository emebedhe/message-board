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
    authForm.style.display = "none";
    messageForm.style.display = "block";
    signOutButton.style.display = "block"; // Show sign-out button
    console.log("User signed in:", user.displayName || user.email);
    signInButton.textContent = "Account";
    loadMessages(); // load messages after login
  } else {
    authForm.style.display = "block";
    messageForm.style.display = "none";
    messagesDiv.innerHTML = "<p>Please sign in to view messages.</p>";
    signOutButton.style.display = "none"; // Hide sign-out button
    signInButton.textContent = "Sign Up / Sign In";
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
      } catch (signInError) {
        alert("Error signing in: " + signInError.message);
      }
    } else {
      alert("Error signing up: " + signUpError.message);
    }
  }

  authForm.reset();
});

// Handle message submission
messageForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = messageForm.name.value.trim();
  const message = messageForm.message.value.trim();

  if (!auth.currentUser) {
    alert("You must be signed in to submit data!");
    return;
  }

  try {
    const docRef = await addDoc(collection(db, "messages"), {
      userId: auth.currentUser.uid,
      username: auth.currentUser.displayName || "Anonymous",
      message: message,
      createdAt: new Date()
    });
    // alert(`Message saved with ID: ${docRef.id}`);
    messageForm.reset();
  } catch (e) {
    console.error("Error adding document: ", e);
    alert("Error saving data: " + e.message);
  }
});

const messagesDiv = document.getElementById("messages");

// Real-time listener for messages
function loadMessages() {
  const messagesRef = collection(db, "messages");
  const q = query(messagesRef, orderBy("createdAt", "desc")); // newest first

  onSnapshot(q, (snapshot) => {
    messagesDiv.innerHTML = ""; // Clear old messages
    snapshot.forEach((doc) => {
      const data = doc.data();
      const messageEl = document.createElement("div");
      messageEl.style.border = "1px solid #ccc";
      messageEl.style.padding = "10px";
      messageEl.style.margin = "5px 0";
      messageEl.innerHTML = `
        <strong>${data.username || "Anonymous"}</strong><br>
        ${data.message}<br>
        <small>${data.createdAt?.toDate ? data.createdAt.toDate().toLocaleString() : ""}</small>
      `;
      messagesDiv.appendChild(messageEl);
    });
  });
}

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