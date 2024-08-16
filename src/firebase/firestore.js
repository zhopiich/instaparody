import { db } from "./firebase.js";
import { updateUserProfile } from "./auth.js";
import {
  collection,
  getDoc,
  addDoc,
  setDoc,
  doc,
  updateDoc,
} from "firebase/firestore";

// userDoc

// Called when sign up
export const addUserDoc = async ({ uid, username }) => {
  const docRef = doc(db, "users", uid);

  await setDoc(docRef, {
    username,
    displayName: username,
    intro: "",
    // mobilePhone: "",
    gender: "N",
    website: "",
    avatar: "",
  });
};

export const updateUserDoc = async (uid, data) => {
  const docRef = doc(db, "users", uid);

  try {
    return await Promise.all([
      updateDoc(docRef, data),
      updateUserProfile(data),
    ]);
  } catch (error) {
    console.log(error);
  }
};

export const addPost = async (vals) => {
  const colRef = collection(db, "posts");

  try {
    const docRef = await addDoc(colRef, {
      ...vals,
    });

    return docRef;
  } catch (err) {
    console.log("addDoc:", err);
  }
};

// comment

export const addComment = async (vals) => {
  const colRef = collection(db, "comments");

  const docRef = await addDoc(colRef, {
    ...vals,
  });

  return { docRef };
};

// message

export const addChat = async (vals) => {
  const colRef = collection(db, "messages");

  const docRef = await addDoc(colRef, {
    ...vals,
  });

  return docRef;
};
