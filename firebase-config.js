
const firebaseConfig = {
  apiKey: "AIzaSyDIi92OOC4unH2-iztmDb_X638dinWW1iM",
  authDomain: "earthingmart-bf793.firebaseapp.com",
  projectId: "earthingmart-bf793",
  storageBucket: "earthingmart-bf793.firebasestorage.app",
  messagingSenderId: "824012744747",
  appId: "1:824012744747:web:01184e33f70d879bf1226e",
  measurementId: "G-M7YLNF62JS"
};

  
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  const auth = firebase.auth();
  const db = firebase.firestore();
  