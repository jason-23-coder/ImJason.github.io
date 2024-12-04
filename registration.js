import { getAuth, createUserWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js"


const auth = getAuth();

const registrationEmail = document.getElementById("registration-email");
const registrationPassword = document.getElementById("registration-password");
const registrationButton = document.getElementById("registration-button");
const statusMessage = document.getElementById("statusMessage");
const backButton = document.getElementById("back-button");


registrationButton.addEventListener("click", async (e) => {
    e.preventDefault();
    let email = registrationEmail.value
    let password = registrationPassword.value

    try{
        const userCredential = await createUserWithEmailAndPassword(
            auth, 
            email,
            password    
        )

        statusMessage.textContent = "Registration successful! Redirecting to home...";
        statusMessage.style.color = "green";

        setTimeout(() => {
            window.location.href = "./home.html";
        }, 2000); // 2-second delay
    } 

    catch (error) {
        // Handle errors
        console.log(error.code);
        if (error.code === "auth/email-already-in-use") {
            statusMessage.textContent = "This email is already in use. Please try a different one.";
        } else if (error.code === "auth/invalid-email") {
            statusMessage.textContent = "Invalid email format.";
        } else if (error.code === "auth/weak-password") {
            statusMessage.textContent = "Password should be at least 6 characters.";
        } else {
            statusMessage.textContent = "An error occurred: " + error.message;
        }
        statusMessage.style.color = "red";
    }
});

backButton.addEventListener("click", function(){
    window.location.href = "./index.html";
})