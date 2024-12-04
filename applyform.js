import { getFirestore, collection, getDocs, updateDoc, doc, addDoc } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

const db = getFirestore();
const auth = getAuth();

const form = document.getElementById("borrow-form");
const boardDropdown = document.getElementById("board");
const statusMessage = document.getElementById("statusMessage");

// Fetch available boards and populate the dropdown
async function loadAvailableBoards() {
  try {
    const querySnapshot = await getDocs(collection(db, "board"));
    boardDropdown.innerHTML = '<option value="" disabled selected>Select a board</option>'; // Reset options

    querySnapshot.forEach((doc) => {
      const board = doc.data();
      if (board.status === true) { // Check if the board is available
        const option = document.createElement("option");
        option.value = doc.id; 
        option.textContent = `Board Serial: ${board.serial}`;
        option.setAttribute("data-serial", board.serial);
        boardDropdown.appendChild(option);
      }
    });
  } 
  
  catch (error) {
    console.error("Error loading boards:", error);
  }
}

// Submit the borrow request
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value;
  const matric = document.getElementById("matric").value;

  const selectedOption = boardDropdown.selectedOptions[0];
  const boardId = boardDropdown.value;
  const boardserial = selectedOption.getAttribute("data-serial");  // Get the serial number from data-* attribute

  if (!boardId) {
    statusMessage.textContent = "Please select a board.";
    statusMessage.style.color = "red";
    return;
  }

  const user = auth.currentUser;
  if (!user) {
    statusMessage.textContent = "Please log in first.";
    statusMessage.style.color = "red";
    return;
  }

  try {

    //save information
    await addDoc(collection(db, "borrow_detail"), {
        name: name,
        user: user.email,
        matric: matric,
        boardID: boardserial, 
        status: "pending",
        return: false,
        timestamp: new Date(),
        ID: boardId
    })

    // Update the board status to unavailable
    const boardRef = doc(db, "board", boardId);
    await updateDoc(boardRef, { status: false });

    // Show success message
    statusMessage.textContent = `Board borrowed successfully by ${name} (${matric}).`;
    statusMessage.style.color = "green";

    setTimeout(() => {
        window.location.href = "./home.html";
    }, 2000);

    // Reload available boards
    loadAvailableBoards();

  } 
  
  catch (error) {
    console.error("Error borrowing board:", error);
    statusMessage.textContent = "An error occurred. Please try again.";
    statusMessage.style.color = "red";
  }

  form.reset();
});

// Load available boards on page load
onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is logged in, proceed to load the page
      console.log("User logged in:", user.email);
      loadAvailableBoards();
    } else {
      // User is not logged in, redirect to the login page
      window.location.href = "./index.html"; // Replace with your login page URL
    }
  });


