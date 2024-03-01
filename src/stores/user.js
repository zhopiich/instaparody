import { ref, computed } from "vue";
import { defineStore } from "pinia";

// import { getUser, login, register, logout } from "../apis/auth";
// import { updateProfile } from "../apis/user";

//
// import { userListener } from "../firebase/firestore.js";
import { auth } from "../firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";

import { db } from "../firebase/firebase.js";
import {
  collection,
  getDocs,
  getDoc,
  query,
  where,
  limit,
  onSnapshot,
  addDoc,
  setDoc,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";

//

export const useUserStore = defineStore("user", () => {
  const user = ref(null);

  const userDoc = ref(null);

  const otherUserDoc = ref(null);

  async function initializeAuthListener() {
    return new Promise((resolve) => {
      const resolveOnce = (() => {
        let resolved = false;
        return () => {
          if (!resolved) {
            resolved = true;

            console.log("** Resolved ** (once)");
            resolve();
          }
        };
      })();

      onAuthStateChanged(auth, async (newUser) => {
        console.log("** Auth Listener Triggered! ** (unique everytime)");

        if (newUser) {
          user.value = newUser;
          console.log("Current user is: ", newUser.email, newUser.uid);

          // await getUserDoc();
          // console.log("userDoc waited?", userDoc.value);
        } else {
          user.value = "guest";
          userDoc.value = null;

          console.log("***User is logged out");
        }
        resolveOnce();
      });
    });
  }

  // constant
  // For a scenario that userDoc being resolved doesn't be waited
  // Or the value depending on userDoc will be edited
  const getUserDoc = async () => {
    if (user.value === "guest") {
      console.log("userDoc: not logged in");
      // userDoc.value = "guest";
      return;
    }

    const userRef = doc(db, "users", user.value.uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      userDoc.value = userSnap.data();
      // console.log("userDoc", userDoc);
    } else {
      // docSnap.data() will be undefined in this case
      console.log("No such document!");
    }
  };

  const getOtherUserDoc = async (_username) => {
    // if (!user.value) {
    //   console.log("userDoc: not logged in");
    //   return;
    // }

    const q = query(
      collection(db, "users"),
      where("username", "==", _username)
    );

    const querySnap = await getDocs(q);

    if (querySnap.docs.length === 0) {
      console.log("No Such User");
    } else {
      otherUserDoc.value = querySnap.docs[0].data();
    }
  };

  const initializeUser = async () => {
    await auth.authStateReady();

    user.value = auth.currentUser;

    console.log("init user ", user?.value?.uid, user?.value?.email);
  };

  const isLoggedIn = computed(() => user.value && user.value !== "guest");

  return {
    user,
    userDoc,
    otherUserDoc,
    getUserDoc,
    getOtherUserDoc,
    initializeAuthListener,
    initializeUser,
    isLoggedIn,
  };
});
