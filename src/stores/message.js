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
  orderBy,
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
  and,
} from "firebase/firestore";

export const useMessageStore = defineStore("message", () => {
  const meInfo = ref(null);

  const contactsList = ref(null);
  const messagesList = ref(null);

  const isEnterChat = ref(false);
  let currentChatId = null;

  const setCurrentChat = (chatId) => {
    currentChatId = chatId;
  };

  const enterChat = (bool) => {
    isEnterChat.value = bool;
  };

  const cleanChat = () => {
    messagesList.value = null;
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

  const findChat = async ({ userId1, userId2 }) => {
    const user = (userId) => `users.${userId}`;

    const q = query(
      collection(db, "messages"),
      and(where(user(userId1), "==", true), where(user(userId2), "==", true))
    );

    const chats = await getDocs(q);

    let list = [];
    chats.forEach((doc) => {
      list.push(doc.id);
    });

    return { isChatExists: list.length !== 0, chatId: list[0] };
  };

  const addContact = async (_username) => {
    const q = query(
      collection(db, "users"),
      where("username", "==", _username)
    );

    const querySnap = await getDocs(q);

    if (querySnap.docs.length === 0) {
      console.log("No Such User");
      return;
    }

    const me = getUserInfo(userStore.userDoc, userStore.user.uid);
    const contact = getUserInfo(querySnap.docs[0].data(), querySnap.docs[0].id);

    //
    const { isChatExists, chatId } = await findChat({
      userId1: me.userId,
      userId2: contact.userId,
    });

    if (isChatExists) {
      return;
    }

    // const chatRef =
    await addChat({
      // users: [me.userId, contact.userId],
      users: { [me.userId]: true, [contact.userId]: true },
      usersInfo: [{ ...me }, { ...contact }],
    });
  };

  const loadContacts = async () => {
    const messagesRef = collection(db, "messages");
    const q = query(
      messagesRef,
      where(`users.${userStore.user.uid}`, "==", true)
    );

    const querySnapshot = await getDocs(q);
    const results = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));

    contactsList.value = results.map((chat) => ({
      ...(chat.usersInfo[0].userId === userStore.user.uid
        ? chat.usersInfo[1]
        : chat.usersInfo[0]),
      chatId: chat.id,
    }));
  };

  const messagesListener = (chatId) => {
    const messagesRef = collection(db, "messages");
    const chatRef = collection(messagesRef, chatId, "chat");
    const q = query(chatRef, orderBy("at", "asc"));

    return onSnapshot(
      q,
      (snapshot) => {
        console.log("contacts listener triggered! ");
        const results = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));

        messagesList.value = results;
      },
      (err) => {
        console.log(err.message);

        messagesList.value = "error";
      }
    );
  };

  let unSubMessages;
  const loadLastMessages = (chatId) => {
    unSubMessages = messagesListener(chatId);
  };

  const triggerUnSubMessages = () => {
    unSubMessages();
    unSubMessages = null;
    console.log("**messages unsubbed");
  };

  const contactsListener = () => {
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
      },
      (err) => {
        console.log(err.message);

        contactsList.value = "error";
      }
    );
  };

  const sendMessage = async (content) => {
    const chatRef = collection(db, "messages");

    await addDoc(collection(chatRef, currentChatId, "chat"), {
      from: userStore.user.uid,
      content,
      at: serverTimestamp(),
    });
  };

  const appendLocalList = (content) => {
    messagesList.value.push({ from: userStore.user.uid, content });
  };

  return {
    contactsList,
    messagesList,
    isEnterChat,
    cleanChat,
    setCurrentChat,
    enterChat,
    addContact,
    loadContacts,
    contactsListener,
    messagesListener,
    loadLastMessages,
    triggerUnSubMessages,
    sendMessage,
    appendLocalList,
    findChat,
  };
});
