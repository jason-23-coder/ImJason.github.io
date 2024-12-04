import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";



const auth = getAuth();
const db = getFirestore();

const adminemail = document.getElementById("registration-email")
const adminpassword = document.getElementById("registration-password")
const adminregistrationbutton = document.getElementById("registration-button")
const statusMessage = document.getElementById("statusMessage")

adminregistrationbutton.addEventListener("click", async (e) => {
    let email = adminemail.value
    let password = adminpassword.value
    
    try{
        const userCredential = await createUserWithEmailAndPassword(
            auth, 
            email,
            password    
        )

        const user = userCredential.user

        await setDoc(doc(db, "admin", user.uid), {
            email: user.email,
        })

        statusMessage.textContent = "Registration successful! Redirecting to admin page";
        statusMessage.style.color = "green";

        setTimeout(() => {
            window.location.href = "./adminhome.html";
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


