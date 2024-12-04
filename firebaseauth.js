
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
//import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-analytics.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBTO6IFilO5WuAZyh7bxAl1rLxtrYZFCQ4",
  authDomain: "lab-equipment-system.firebaseapp.com",
  databaseURL: "https://lab-equipment-system-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "lab-equipment-system",
  storageBucket: "lab-equipment-system.firebasestorage.app",
  messagingSenderId: "65659166988",
  appId: "1:65659166988:web:ecd6584b426470ebb96929",
  measurementId: "G-VNN22S71HY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
