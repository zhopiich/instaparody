import { ref } from "vue";

import { auth } from "./firebase.js";
import { addUserDoc } from "./firestore.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";

export const signUp = async ({ email, username, password }) => {
  try {
    const credential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const uid = credential.user.uid;
    await addUserDoc({ uid, username });
  } catch (err) {
    return err.code;
  }
};

export const signIn = async (email, password) => {
  try {
    const credential = await signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    return err.code;
  }
};

export const logOut = async () => {
  await signOut(auth)
    // .then(() => {
    //
    // })
    .catch((error) => {
      console.log(error);
    });
};

export const updateUserProfile = async (profileData) => {
  const updatedProfile = {};

  if (typeof profileData.displayName === "string") {
    updatedProfile.displayName = profileData.displayName;
  }
  if (typeof profileData.avatar === "string") {
    updatedProfile.photoURL = profileData.avatar;
  }

  updateProfile(auth.currentUser, updatedProfile)
    // .then(() => {
    //
    // })
    .catch((error) => {
      console.log("auth: ", error);
    });
};

export const changePassword = async (email, currentPassword, newPassword) => {
  const credential = EmailAuthProvider.credential(email, currentPassword);

  try {
    const res = await reauthenticateWithCredential(
      auth.currentUser,
      credential
    );
  } catch (err) {
    return "incorrectPassword";
  }

  return updatePassword(auth.currentUser, newPassword)
    .then(() => {
      return "passwordChanged";
    })
    .catch((err) => {
      return "error";
    });
};
