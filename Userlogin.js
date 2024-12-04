
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js"


const auth = getAuth();

//user page
const UserName = document.getElementById("email")
const UserPassword = document.getElementById("password")
const loginButton = document.getElementById("login-button")
const goToAdminButton = document.getElementById("admin-button")
const statusMessage = document.getElementById("login-status")
const registrationButton = document.getElementById("registration-button")

loginButton.addEventListener("click", async (e) => {
    e.preventDefault();

    let email = UserName.value.trim();
    let password = UserPassword.value.trim();

    if (!email || !password) {
        statusMessage.textContent = "Please fill out all fields.";
        statusMessage.style.color = "red";
        return;
    }

    try {
        // Sign in with email and password
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log("User signed in:", userCredential.user);

        // Display success message
        statusMessage.textContent = "Login successful! Redirecting...";
        statusMessage.style.color = "green";

        // Redirect to a protected page
        setTimeout(() => {
            window.location.href = "/home.html";
        }, 2000); // 2-second delay
    } 
    
    catch (error) {
        console.log("Error code:", error.code);
        if (error.code === "auth/user-not-found") {
            statusMessage.textContent = "User not found. Please register first.";
        } else if (error.code === "auth/wrong-password") {
            statusMessage.textContent = "Incorrect password.";
        } else if (error.code === "auth/invalid-email") {
            statusMessage.textContent = "Invalid email format.";
        } else {
            statusMessage.textContent = "An error occurred: " + error.message;
        }
        statusMessage.style.color = "red";

        setTimeout(() => {
            window.location.href = "/Registration.html";
        }, 2000); // 2-second delay
    }
});

goToAdminButton.addEventListener("click", function() {
    window.location.href = "/admin.html";
})

registrationButton.addEventListener("click", function() {
    window.location.href = "/Registration.html";
})
