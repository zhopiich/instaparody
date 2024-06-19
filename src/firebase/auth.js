import { ref } from "vue";

// firebase imports
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
  const err = {
    isErr: false,
    msg: null,
  };
  let uid;

  await createUserWithEmailAndPassword(auth, email, password)
    .then((credential) => {
      //
      console.log("Signed Up!");
      uid = credential.user.uid;
    })
    .catch((error) => {
      console.log("err code: ", error.code);
      console.log(error.message);

      err.isErr = true;
      err.msg = error.message;
    });

  await addUserDoc({ uid, username });

  return err;
};

export const signIn = async (email, password) => {
  const err = {
    isErr: false,
    msg: null,
  };

  await signInWithEmailAndPassword(auth, email, password)
    .then((credential) => {
      //
      // console.log("Signed In!");
      // console.log(credential.user);
    })
    .catch((error) => {
      console.log("err code: ", error.code);
      console.log(error.message);

      err.isErr = true;
      err.msg = error.message;
    });

  return err;
};

export const logOut = async () => {
  await signOut(auth)
    // .then(() => {
    //   console.log("logged Out!");
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
    .then(() => {
      console.log("auth: Profile updated!");
    })
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
