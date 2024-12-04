import { getFirestore, collection, getDocs, updateDoc, doc } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

const db = getFirestore();
const applicationList = document.getElementById("application-list");

// Fetch applications and populate the table
async function loadApplications() {
  try {
    const querySnapshot = await getDocs(collection(db, "borrow_detail"));
    applicationList.innerHTML = ""; // Clear the table before populating

    querySnapshot.forEach((doc) => {
      const application = doc.data();
      const row = document.createElement("tr");

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
      statusCell.textContent = application.status;
      row.appendChild(statusCell);

      // Action Cell
      const actionCell = document.createElement("td");
      const approveButton = document.createElement("button");
      approveButton.textContent = "Approve";
      approveButton.className = "approve";
      approveButton.addEventListener("click", () => handleApproval(doc.id, "approved"));

      const rejectButton = document.createElement("button");
      rejectButton.textContent = "Reject";
      rejectButton.className = "reject";
      rejectButton.addEventListener("click", () => handleApproval(doc.id, "rejected"));

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
    const applicationRef = doc(db, "borrow_detail", applicationId);
    await updateDoc(applicationRef, { status });
    alert(`Application ${status}!`);
    loadApplications(); // Refresh the table after updating
  } catch (error) {
    console.error("Error updating application:", error);
  }
}

// Load applications on page load
loadApplications();
