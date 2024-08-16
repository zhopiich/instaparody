import { ref, reactive, computed } from "vue";
import { defineStore } from "pinia";

import { auth } from "../firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";

import { db } from "../firebase/firebase.js";
import {
  collection,
  getDocs,
  getDoc,
  query,
  where,
  doc,
  and,
  or,
} from "firebase/firestore";

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

            resolve();
          }
        };
      })();

      onAuthStateChanged(auth, (newUser) => {
        if (newUser) {
          user.value = newUser;
        } else {
          user.value = "guest";
          userDoc.value = null;
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
      return;
    }

    const userRef = doc(db, "users", user.value.uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      userDoc.value = userSnap.data();
    } else {
      // docSnap.data() will be undefined in this case
    }
  };

  const getUserInfo = async ({ username, userId }) => {
    try {
      if (username) {
        const q = query(
          collection(db, "users"),
          where("username", "==", username)
        );
        const querySnap = await getDocs(q);

        if (querySnap.docs.length === 1) {
          return { ...querySnap.docs[0].data(), userId: querySnap.docs[0].id };
        }
      }

      if (userId) {
        const docSnap = await getDoc(doc(db, "users", userId));

        if (docSnap.exists()) {
          return { ...docSnap.data(), userId };
        }
      }

      return "noSuchUser";
    } catch (err) {
      console.log(err);
    }
  };

  const getOtherUserDoc = async (username) => {
    otherUserDoc.value = await getUserInfo({ username });
  };

  const userInfoList = reactive({});

  const addUserInfo = async (userId) => {
    if (userInfoList[userId]) return;

    userInfoList[userId] = "pending";

    const { avatar, displayName } = await getUserInfo({ userId });
    userInfoList[userId] = { avatar, displayName };
  };

  const initializeUser = async () => {
    await auth.authStateReady();

    user.value = auth.currentUser;
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
    getUserInfo,
    getOtherUserDoc,
    userInfoList,
    addUserInfo,
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
