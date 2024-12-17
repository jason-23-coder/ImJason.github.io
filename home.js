import { getFirestore, collection, getDocs, query, where, doc, updateDoc } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";



// Initialize Firestore
const db = getFirestore();
const auth = getAuth();

const logoutButton = document.getElementById("logout");
const boardList = document.getElementById("board-list");
const userBorrowList = document.getElementById("user-borrow-list");
const goToApply = document.getElementById("applyform");
const returnButton = document.getElementById("return");
const statusMessage = document.getElementById("statusMessage")

// Fetch and display available board data
async function loadBoardData() {
  try {
    const querySnapshot = await getDocs(collection(db, "board"));
    boardList.innerHTML = ""; // Clear the table body before appending new data

    querySnapshot.forEach((doc) => {
      const board = doc.data();
      const row = document.createElement("tr");

      // Serial Number Cell
      const serialCell = document.createElement("td");
      serialCell.textContent = board.serial;
      row.appendChild(serialCell);

      // Status Cell
      const statusCell = document.createElement("td");
    
      if (board.status === true) {
        statusCell.textContent = "Available";
        statusCell.style.backgroundColor = "green";
        statusCell.style.color = "white"; 
      } else {
        statusCell.textContent = "Unavailable";
        statusCell.style.backgroundColor = "red";
        statusCell.style.color = "white"; 
      }

      row.appendChild(statusCell);
      boardList.appendChild(row);
    });
  } catch (error) {
    console.error("Error loading boards:", error);
  }
}

async function loadUserBorrowDetails(userEmail) {
    try {
      const borrowQuery = query(collection(db, "borrow_detail"), where("user", "==", userEmail), where("return", "==", false), where("status", "in", ["pending", "Approved"] ));
      const querySnapshot = await getDocs(borrowQuery);
      userBorrowList.innerHTML = ""; // Clear the table body before appending new data
  
      querySnapshot.forEach((doc) => {
        const borrow = doc.data();
        const row = document.createElement("tr");
  
        // Serial Number Cell
        const serialCell = document.createElement("td");
        serialCell.textContent = borrow.boardID;
        row.appendChild(serialCell);
  
        // Status Cell
        const statusCell = document.createElement("td");
        statusCell.textContent = borrow.status;
        statusCell.style.backgroundColor = borrow.status === "pending" ? "orange" : "green";
        statusCell.style.color = "white"; 
        row.appendChild(statusCell);
  
        // Borrow Date Cell
        const dateCell = document.createElement("td");
        const borrowDate = new Date(borrow.timestamp.seconds * 1000); // Convert Firestore timestamp to JS Date
        dateCell.textContent = borrowDate.toLocaleDateString();
        row.appendChild(dateCell);

        // Checkbox to select for return
        const returnCell = document.createElement("td");
        const returnCheckbox = document.createElement("input");
        returnCheckbox.type = "checkbox";
        returnCheckbox.dataset.borrowDetailId = doc.id; 
        returnCheckbox.dataset.boardId = borrow.ID; 
        returnCell.appendChild(returnCheckbox);
        row.appendChild(returnCell);
  
        userBorrowList.appendChild(row);

      });
    } catch (error) {
      console.error("Error loading borrow details:", error);
    }
}

async function handleReturn() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked'); // Select all checked checkboxes
  
    checkboxes.forEach(async (checkbox) => {
      const borrowDetailId = checkbox.dataset.borrowDetailId;
      const boardId = checkbox.dataset.boardId;
  
      console.log("Borrow Detail ID:", borrowDetailId);
      console.log("Board ID:", boardId);
      
      const user = auth.currentUser;

      if (!borrowDetailId || !boardId) {
        console.error("Invalid Borrow Detail ID or Board ID");
        return;
      }
  
      try {
        // Update the board status to 'available' (true)
        const boardRef = doc(db, "board", boardId);
        await updateDoc(boardRef, { 
            status: true , 
            borrower: "" ,
            waiting: false
        });
  
        // Update the borrow detail to indicate that the board has been returned
        const borrowRef = doc(db, "borrow_detail", borrowDetailId);
        await updateDoc(borrowRef, { return: true });
  
        console.log("Board returned successfully");

        statusMessage.textContent = `Board returned successfully.`;
        statusMessage.style.color = "green";
        
        setTimeout(() => {
            location.reload();
        }, 2000);
        
        // Reload the user borrow details to show only boards that haven't been returned
        
        //if (user) {
        //  loadUserBorrowDetails(user.email);
        //}
      } catch (error) {
        console.error("Error returning board:", error);
      }
    });
  }
  

// Check if the user is logged in
onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is logged in, proceed to load the page
    console.log("User logged in:", user.email);
    loadBoardData(); // Call your function to load board data
    loadUserBorrowDetails(user.email)
  } else {
    // User is not logged in, redirect to the login page
    window.location.href = "./index.html"; // Replace with your login page URL
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

goToApply.addEventListener("click", function(){
    window.location.href = "./applyform.html"
})



returnButton.addEventListener("click", handleReturn);
