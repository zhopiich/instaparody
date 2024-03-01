import { ref, reactive, computed, watch, toRef } from "vue";
import { defineStore } from "pinia";

import { useUserStore } from "./user.js";

import { auth } from "../firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";

import { addChat } from "../firebase/firestore.js";
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
  arrayUnion,
  arrayRemove,
  serverTimestamp,
} from "firebase/firestore";

export const useMessageStore = defineStore("message", () => {
  const meInfo = ref(null);

  const contactsList = ref(null);
  const messagesList = ref(null);

  const isEnterChat = ref(true);

  const enterChat = (bool) => {
    isEnterChat.value = bool;
  };

  // Contact a user
  const userStore = useUserStore();
  const getUserInfo = (allUserInfo, userId) => {
    const { gender, intro, mobilePhone, website, ...userInfo } = {
      ...allUserInfo,
      userId,
    };
    return userInfo;
  };

  const addContact = async (_username) => {
    const me = getUserInfo(userStore.userDoc, userStore.user.uid);

    const q = query(
      collection(db, "users"),
      where("username", "==", _username)
    );

    const querySnap = await getDocs(q);

    if (querySnap.docs.length === 0) {
      console.log("No Such User");
      return;
    }

    const contact = getUserInfo(querySnap.docs[0].data(), querySnap.docs[0].id);

    await addChat({
      users: [me.userId, contact.userId],
      usersInfo: [{ ...me }, { ...contact }],
      // chat: [],
    });

    // console.log("done");

    // meInfo.value = me;
  };

  const loadContacts = async () => {
    console.log("loadContacts");
    // const me = getUserInfo(userStore.userDoc, userStore.user.uid);

    const messagesRef = collection(db, "messages");
    const q = query(
      messagesRef,
      where("users", "array-contains", userStore.user.uid)
    );

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, " => ", doc.data());
    });
  };

  const messagesListener = () => {
    // const me = getUserInfo(userStore.userDoc, userStore.user.uid);
    // console.log("me", me);

    const messagesRef = collection(db, "messages");
    const chatRef = collection(
      messagesRef,
      "9uRoeLhHgjPd33YAHnKw",
      "landmarks"
    );

    return onSnapshot(
      chatRef,
      (snapshot) => {
        console.log("contacts listener triggered! ");
        const results = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));

        messagesList.value = results;

        console.log(messagesList.value);
      },
      (err) => {
        console.log(err.message);

        messagesList.value = "error";
      }
    );
  };

  const contactsListener = () => {
    // const me = getUserInfo(userStore.userDoc, userStore.user.uid);
    // console.log("me", me);

    const contactsRef = collection(db, "messages");
    const q = query(
      contactsRef,
      where("users", "array-contains", userStore.user.uid)
    );

    return onSnapshot(
      q,
      (snapshot) => {
        console.log("contacts listener triggered! ");
        const results = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));

        contactsList.value = results;

        console.log(contactsList.value);
      },
      (err) => {
        console.log(err.message);

        contactsList.value = "error";
      }
    );
  };

  const sendMessage = async (content) => {
    const chatRef = collection(db, "messages");
    // const chatRef = doc(db, "messages", "kZGH4RwnbMNHK3rO60jo");

    await addDoc(collection(chatRef, "9uRoeLhHgjPd33YAHnKw", "chat"), {
      from: userStore.user.uid,
      content,
      at: serverTimestamp(),
    });
  };

  return {
    contactsList,
    messagesList,
    isEnterChat,
    enterChat,
    addContact,
    loadContacts,
    contactsListener,
    messagesListener,
    sendMessage,
  };
});
