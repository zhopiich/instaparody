// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// const getFirebase = async () => await import("firebase/app");
// const { default: initializeApp } = getFirebase();
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA-ClE496-8BXWwa1mi8W8jN4vEEt2uWa4",
  authDomain: "instagram-clone-d67da.firebaseapp.com",
  projectId: "instagram-clone-d67da",
  storageBucket: "instagram-clone-d67da.appspot.com",
  messagingSenderId: "429988940746",
  appId: "1:429988940746:web:f988cbe299bdceb48cdd33",
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);

export const db = getFirestore(firebaseApp);

export const auth = getAuth(firebaseApp);

export const storage = getStorage(firebaseApp);
