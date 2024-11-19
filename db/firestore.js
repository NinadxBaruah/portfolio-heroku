require("dotenv").config();
const {initializeApp} = require("firebase/app");
const { getFirestore , collection} = require("firebase/firestore");

// Here is the configuration of the firestore

const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
    measurementId: process.env.FIREBASE_MEASUREMENT_ID,
  };


// Initializing the Firebase App

const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Export users collection reference
const usersCollection = collection(db, "users");


module.exports = {db , usersCollection};

