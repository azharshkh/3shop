// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  // Your API Key is unique to your project and specific web app.
  // You'll find this in your Project settings > General > Your apps.
  apiKey: "AIzaSyCJ9JcZ8uTpCQ4XMa1dMkLTzjDbYfXmLQo", // Example: "AIzaSyC0RkL1N7qM8oP9sT0uV1wX2yZ3aB4c"

  // This is typically your Project ID followed by .firebaseapp.com
  authDomain: "shop-d21f3.firebaseapp.com",

  // Your unique Project ID
  projectId: "shop-d21f3",

  // Your storage bucket for Cloud Storage, typically your Project ID followed by .appspot.com
  storageBucket: "shop-d21f3.appspot.com",

  // Your unique sender ID for Firebase Cloud Messaging (FCM), usually your Project Number
  messagingSenderId: "433042524443",

  // Your App ID is specific to this web application within your project.
  // You'll find this in your Project settings > General > Your apps.
  appId: "1:433042524443:web:860596081e153f021e6bbe" // Example: "1:433042524443:web:aBcDeF1234567890aBcDeF"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
