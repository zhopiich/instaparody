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
  // onSnapshot,
  addDoc,
  setDoc,
  doc,
  deleteDoc,
  updateDoc,
  and,
  or,
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

      onAuthStateChanged(auth, (newUser) => {
        console.log("** Auth Listener Triggered! ** (unique everytime)");

        if (newUser) {
          user.value = newUser;
          console.log("Current user is: ", newUser.email, newUser.uid);
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

  const findUserByName = async (_username) => {
    const q = query(
      collection(db, "users"),
      where("username", "==", _username)
    );

    return await getDocs(q);
  };

  const getOtherUserDoc = async (username) => {
    const querySnap = await findUserByName(username);

    if (querySnap.docs.length === 0) {
      // console.log("No Such User");
      otherUserDoc.value = "noSuchUser";
    } else {
      otherUserDoc.value = {
        ...querySnap.docs[0].data(),
        userId: querySnap.docs[0].id,
      };
    }
  };

  const initializeUser = async () => {
    await auth.authStateReady();

    user.value = auth.currentUser;

    console.log("init user ", user?.value?.uid, user?.value?.email);
  };

  const isLoggedIn = computed(() => user.value && user.value !== "guest");

  // Search
  const results = ref(null);

  const cleanResults = () => {
    results.value = null;
  };

  const search = async (term) => {
    if (results) results.value = null;

    const usersRef = collection(db, "users");

    const queryUsers = query(
      usersRef,
      or(
        and(
          where("displayName", ">=", term),
          where("displayName", "<=", term + "\uf8ff")
        ),
        and(
          where("username", ">=", term),
          where("username", "<=", term + "\uf8ff")
        )
      )
    );

    const usersSnap = await getDocs(queryUsers);

    results.value = usersSnap.docs.map((doc) => ({
      ...doc.data(),
      userId: doc.id,
    }));
  };

  const searchTerm = ref("");

  const saveSearchTerm = (_searchTerm) => {
    searchTerm.value = _searchTerm;
  };

  return {
    user,
    userDoc,
    otherUserDoc,
    getUserDoc,
    findUserByName,
    getOtherUserDoc,
    initializeAuthListener,
    initializeUser,
    isLoggedIn,
    results,
    cleanResults,
    search,
    searchTerm,
    saveSearchTerm,
  };
});
