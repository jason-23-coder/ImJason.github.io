const express = require('express');
const admin = require('firebase-admin');
const app = express();
const port = 3000;

// Initialize Firebase Admin SDK with the service account
const serviceAccount = require('./firebase-service-account.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://your-project-id.firebaseio.com', // Replace with your Firebase project URL
});

// Firebase Firestore reference
const db = admin.firestore();

// Middleware to parse JSON requests
app.use(express.json());

// API route to get the list of available boards
app.get('/boards', async (req, res) => {
  try {
    const boardsSnapshot = await db.collection('boards').get();
    const boards = [];
    boardsSnapshot.forEach((doc) => {
      boards.push(doc.data());
    });
    res.json(boards);
  } catch (error) {
    res.status(500).send('Error retrieving boards: ' + error.message);
  }
});

// API route to handle user application for borrowing a board
app.post('/apply', async (req, res) => {
  const { boardId } = req.body;
  try {
    // Create a new application entry in Firestore
    const applicationRef = await db.collection('applications').add({
      boardId,
      status: 'pending',
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });
    res.status(201).send({ message: 'Application submitted', id: applicationRef.id });
  } catch (error) {
    res.status(500).send('Error submitting application: ' + error.message);
  }
});

// API route for admin to approve/deny applications
app.post('/admin/decision', async (req, res) => {
  const { applicationId, status } = req.body;
  try {
    // Update the status of the application
    await db.collection('applications').doc(applicationId).update({ status });
    
    // If approved, send a signal to the ESP32 (you can trigger it here)
    if (status === 'approved') {
      console.log('Opening door for approved application...');
      // Trigger ESP32 through an HTTP request, or you can use Firebase Functions
    }
    
    res.send({ message: `Application ${status}` });
  } catch (error) {
    res.status(500).send('Error processing decision: ' + error.message);
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Backend server is running at http://localhost:${port}`);
});
