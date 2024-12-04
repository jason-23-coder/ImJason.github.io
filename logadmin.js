import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

// Initialize Firebase Auth and Firestore
const auth = getAuth();
const db = getFirestore();

// DOM Elements
const emailInput = document.getElementById("admin-email");
const passwordInput = document.getElementById("admin-password");
const loginButton = document.getElementById("admin-login-button");
const statusMessage = document.getElementById("statusMessage");
const backButton = document.getElementById("back-button");

// Login Button Click Event
loginButton.addEventListener("click", async (e) => {
  e.preventDefault();

  const email = emailInput.value;
  const password = passwordInput.value;

  try {
    // Authenticate user
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Check if the user is an admin
    const adminDoc = await getDoc(doc(db, "admin", user.uid));
    if (adminDoc.exists()) {
      statusMessage.textContent = "Login successful! Redirecting...";
      statusMessage.style.color = "green";

      setTimeout(() => {
        window.location.href = "./adminhome.html";
      }, 2000); 
    } 
    
    else {
      statusMessage.textContent = "Access denied. You are not an admin. Redirecting...";
      statusMessage.style.color = "red";

      setTimeout(() => {
        window.location.href = "./home.html";
      }, 2000); 

    }
  } catch (error) {
    console.error("Error:", error.message);
    statusMessage.textContent = "Login failed: " + error.message;
    statusMessage.style.color = "red";
  }
});

backButton.addEventListener("click", function(){
    window.location.href = "./index.html";
})

