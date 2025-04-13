// Import Firebase dependencies
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// 🔹 Your new Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA5jwv8EcHifcdMOiLIRnEzvC0ssaEZpp4",
  authDomain: "global-emissions-tracker-206fa.firebaseapp.com",
  projectId: "global-emissions-tracker-206fa",
  storageBucket: "global-emissions-tracker-206fa.appspot.com",  // ✅ Fixed storage bucket URL
  messagingSenderId: "385093992547",
  appId: "1:385093992547:web:c87f2eff2d1f916b03f856",
  measurementId: "G-LPPGPWPTPF"
};

// 🔹 Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);  // ✅ Firestore instance

export { db };
