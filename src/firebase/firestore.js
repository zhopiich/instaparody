import { ref, watchEffect, toRef } from "vue";

import { db } from "./firebase.js";
import { updateUserProfile } from "./auth.js";
import {
  collection,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  addDoc,
  setDoc,
  doc,
  deleteDoc,
  updateDoc,
  serverTimestamp,
  increment,
} from "firebase/firestore";

// userDoc

// Called when sign up
export const addUserDoc = async ({ uid, username }) => {
  const docRef = doc(db, "users", uid);

  await setDoc(docRef, {
    username,
    displayName: "",
    intro: "",
    mobilePhone: "",
    gender: "",
    website: "",
  });
};

export const updateUserDoc = async (uid, data) => {
  const docRef = doc(db, "users", uid);
  await updateDoc(docRef, data);

  const { displayName, avatar } = data;
  const profileData = {};
  if (displayName) {
    profileData.displayName = displayName;
  }
  if (avatar) {
    profileData.photoURL = avatar;
  }
  await updateUserProfile(profileData);
};

// post

// export const postsListener = (list) => {
//   const colRef = collection(db, "posts");

//   const q = query(
//     colRef,
//     // where("createdBy.username", "==", "test"),
//     orderBy("createdAt", "desc")
//   );

//   // const unsubscribe =
//   return onSnapshot(
//     q,
//     (snapshot) => {
//       console.log("posts listener triggered!");
//       const results = snapshot.docs.map((doc) => ({
//         ...doc.data(),
//         id: doc.id,
//       }));

//       const ll = toRef(list);
//       ll.value = results;
//     },
//     (err) => {
//       console.log(err.message);

//       list = "error";
//     }
//   );
// };

export const addPost = async (vals) => {
  const colRef = collection(db, "posts");

  const docRef = await addDoc(colRef, {
    ...vals,
  });

  return { docRef };
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

  return { docRef };
};
