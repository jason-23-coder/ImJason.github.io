import { getFirestore, collection, getDocs, getDoc, updateDoc, doc, query, where } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

const db = getFirestore();
const auth = getAuth();

const applicationList = document.getElementById("application-list");
const statusMessage = document.getElementById("statusMessage");
const logoutButton = document.getElementById("Logout");
const goToHome = document.getElementById("Home");


// Fetch applications and populate the table
async function loadApplications() {
  try {
    const querySnapshot = await getDocs(collection(db, "borrow_detail"));
    applicationList.innerHTML = ""; // Clear the table before populating

    querySnapshot.forEach((applicationDoc) => {
      const application = applicationDoc.data();
      const row = document.createElement("tr");

      //Date
      const dateCell = document.createElement("td");
      const borrowDate = new Date(application.timestamp.seconds * 1000); // Convert Firestore timestamp to JS Date
      dateCell.textContent = borrowDate.toLocaleDateString();
      row.appendChild(dateCell);

      //Expired Date
      const expireddateCell = document.createElement("td");
      if (application.expireddate && application.expireddate.seconds) {
        const expiredDate = new Date(application.expireddate.seconds * 1000); // Convert Firestore timestamp to JS Date
        expireddateCell.textContent = expiredDate.toLocaleDateString(); // Set the formatted date text
      } else {
        expireddateCell.textContent = "N/A"; // Set a default value if expireddate is empty
      }
      row.appendChild(expireddateCell);

      // Name Cell
      const nameCell = document.createElement("td");
      nameCell.textContent = application.name;
      row.appendChild(nameCell);

      // Email Cell
      const emailCell = document.createElement("td");
      emailCell.textContent = application.user;
      row.appendChild(emailCell);

      // Matric Number Cell
      const matricCell = document.createElement("td");
      matricCell.textContent = application.matric;
      row.appendChild(matricCell);

      // Board ID Cell
      const boardCell = document.createElement("td");
      boardCell.textContent = application.boardID;
      row.appendChild(boardCell);

      // Status Cell
      const statusCell = document.createElement("td");
      if (application.status === "Approved") {
        statusCell.textContent = "Approved";
        statusCell.style.backgroundColor = "green";
        statusCell.style.color = "white"; 
      } 
      else if (application.status === "pending"){
        statusCell.textContent = "pending";
        statusCell.style.backgroundColor = "orange";
        statusCell.style.color = "white"; 
      }
      else {
        statusCell.textContent = "Rejected";
        statusCell.style.backgroundColor = "red";
        statusCell.style.color = "white"; 
      }
      row.appendChild(statusCell);

      // Return Cell
      const returnCell = document.createElement("td");
      if (application.return === true) {
        returnCell.textContent = "Returned";
        returnCell.style.backgroundColor = "green";
        returnCell.style.color = "white"; 
      } else {
        returnCell.textContent = "Not yet";
        returnCell.style.backgroundColor = "red";
        returnCell.style.color = "white"; 
      }
      row.appendChild(returnCell);

      //Return Date
      const returndateCell = document.createElement("td");
      if (application.returndate && application.returndate.seconds) {
        const returnDate = new Date(application.expireddate.seconds * 1000); // Convert Firestore timestamp to JS Date
        returndateCell.textContent = returnDate.toLocaleDateString(); // Set the formatted date text
      } else {
        returndateCell.textContent = "N/A"; // Set a default value if expireddate is empty
      }
      row.appendChild(returndateCell);

      // Action Cell
      const actionCell = document.createElement("td");
      const approveButton = document.createElement("button");
      approveButton.textContent = "Approve";
      approveButton.className = "approve";
      approveButton.addEventListener("click", async() =>{
        handleApproval(applicationDoc.id, "Approved");
        const applicationRef = doc(db, "borrow_detail", applicationDoc.id)
        await updateDoc(applicationRef, { expireddate: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000)});
      });

      const rejectButton = document.createElement("button");
      rejectButton.textContent = "Reject";
      rejectButton.className = "reject";
      rejectButton.addEventListener("click", async() =>{
        try{
            handleApproval(applicationDoc.id, "Rejected");
            const boardRef = doc(db, "board", application.ID); 
            await updateDoc(boardRef, { status: true});
            await updateDoc(boardRef, { approval: false});
            const applicationRef = doc(db, "borrow_detail", applicationDoc.id)
            await updateDoc(applicationRef, { return: true });
         
        }

        catch (error) {
            console.error("Error rejecting application:", error);
            alert("Failed to reject the application or update the board status.");
        }
      })

      actionCell.appendChild(approveButton);
      actionCell.appendChild(rejectButton);
      row.appendChild(actionCell);

      applicationList.appendChild(row);
    });
  } catch (error) {
    console.error("Error loading applications:", error);
  }
}

// Approve or reject the application
async function handleApproval(applicationId, status) {


    try {
      // Create a reference to the application document
      const applicationRef = doc(db, "borrow_detail", applicationId);
  
      // Check if the document exists before updating
      const applicationDoc = await getDoc(applicationRef);
      if (!applicationDoc.exists()) {
        console.error("No such application document!");
        alert("Error: Application not found.");
        return;
      }
  
      // Update the status field in the document
      await updateDoc(applicationRef, { status });


      if (status == "Approved") {
      const boardId = applicationDoc.data().ID; // Assuming the application document has a boardId field
      if (boardId) {
        const boardRef = doc(db, "board", boardId);

        // Check if the board document exists before updating
        const boardDoc = await getDoc(boardRef);
        if (!boardDoc.exists()) {
          console.error("No such board document!");
          alert("Error: Board not found.");
          return;
        }

        // Update the waiting field in the board document
        await updateDoc(boardRef, { approval: true });
        console.log(`Board ${boardId} updated with waiting: true.`);
      } else {
        console.error("No boardId associated with this application.");
        alert("Error: No associated board found for this application.");
      }
    }
  
      alert(`Application ${status}!`);
      loadApplications(); // Reload the application list to reflect the changes
    } 
    
    catch (error) {
      console.error("Error updating application:", error);
      alert("An error occurred while updating the application.");
    }
  }

  



onAuthStateChanged(auth, async(user) => {

    if (user) {
        const adminDocRef = query(collection(db, "admin"), where("email", "==", user.email));
        const adminDoc = await getDocs(adminDocRef);

        if (!adminDoc.empty) {
            // User is  admin, proceed to admin dashboard
            console.log("Admin logged in:", user.email);

            loadApplications();
        } 
    
        else {
        // User is not admin, redirect to the login page
            statusMessage.textContent = "Access denied. You are not an admin.";
            statusMessage.style.color = "green";
            setTimeout(() => {
                window.location.href = "./home.html";
            }, 2000);
        }
    }
    
    else {
        setTimeout(() => {
            window.location.href = "./admin.html";
        }, 2000);
    }
});

logoutButton.addEventListener("click", async () => {
    try {
      await signOut(auth);
      console.log("User logged out");
      window.location.href = "./index.html"; // Redirect to login page after logout
    } catch (error) {
      console.error("Error logging out:", error);
    }
});

goToHome.addEventListener("click", function(){
    window.location.href = "./home.html";
})

