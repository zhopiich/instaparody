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
import { uploadFile } from "../firebase/storage.js";

import { dateToRelative } from "../utils/date";

export const useMessageStore = defineStore("message", () => {
  const meInfo = ref(null);

  const contactsList = ref(null);
  const messagesList = ref(null);

  const isEnterChat = ref(false);
  let currentChatId = null;

  const setCurrentChat = (chatId) => {
    currentChatId = chatId;
  };

  const selectedContactIndex = ref(null);
  const setCurrentContact = (index) => {
    selectedContactIndex.value = index;
  };

  const currentContact = computed(
    () => contactsList.value[selectedContactIndex.value]
  );

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
    const { isChatExists } = await findChat({
      userId1: me.userId,
      userId2: contact.userId,
    });

    if (isChatExists) {
      return;
    }

    // const newChatRef =
    await addChat({
      // users: [me.userId, contact.userId],
      users: { [me.userId]: true, [contact.userId]: true },
      usersInfo: [{ ...me }, { ...contact }],

      lastMessage: null,
      lastSeeAt: {
        [me.userId]: null,
        [contact.userId]: null,
      },
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
        ? { ...chat.usersInfo[1], index: 1 }
        : { ...chat.usersInfo[0], index: 0 }),
      lastMessage: chat.lastMessage,
      chatId: chat.id,
    }));
  };

  // const lastMessageIds = ref({});
  const lastMessagesAt = ref({});

  const contactsListener = () => {
    console.log("**Contacts Listening...");

    const messagesRef = collection(db, "messages");
    const q = query(
      messagesRef,
      // where("users", "array-contains", userStore.user.uid)
      where(`users.${userStore.user.uid}`, "==", true)
    );

    return onSnapshot(
      q,
      (snapshot) => {
        console.log("contacts listener triggered! ");
        const results = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));

        contactsList.value = results.map((chat) => ({
          ...(chat.usersInfo[0].userId === userStore.user.uid
            ? {
                ...chat.usersInfo[1],
                index: 1,
                lastSeeAt: {
                  me: chat.lastSeeAt[chat.usersInfo[0].userId],
                  other: chat.lastSeeAt[chat.usersInfo[1].userId],
                },
              }
            : {
                ...chat.usersInfo[0],
                index: 0,
                lastSeeAt: {
                  me: chat.lastSeeAt[chat.usersInfo[1].userId],
                  other: chat.lastSeeAt[chat.usersInfo[0].userId],
                },
              }),
          lastMessage: chat.lastMessage,
          chatId: chat.id,
        }));

        // Update lastMessagesAt if there's new
        contactsList.value.forEach(async (contact) => {
          if (!contact.lastMessage) return;

          // if (!lastMessagesAt.value[contact.chatId]) {
          //   lastMessagesAt.value[contact.chatId] = {
          //     messageId: null,
          //     at: null,
          //   };
          // }

          if (
            !lastMessagesAt.value[contact.chatId] ||
            lastMessagesAt.value[contact.chatId].messageId !==
              contact.lastMessage.id
          ) {
            const lastMessageRef = await getDoc(contact.lastMessage.docRef);

            lastMessagesAt.value[contact.chatId] = {
              messageId: contact.lastMessage.id,
              at: lastMessageRef.data().at,
            };
          }
        });
      },
      (err) => {
        console.log(err.message);

        // contactsList.value = "error";
      }
    );
  };

  const areThereNews = computed(() => {
    if (!contactsList.value) return;

    return contactsList.value.map((contact) => {
      // if (lastMessagesAt.value[contact.chatId] && contact.lastSeeAt.me) {
      //   return {
      //     [contact.chatId]:
      //       contact.lastMessage.from !== userStore.user.uid &&
      //       lastMessagesAt.value[contact.chatId].at.seconds >
      //         contact.lastSeeAt.me.seconds,
      //   };
      // } else {
      //   return {
      //     [contact.chatId]: false,
      //   };
      // }

      return {
        [contact.chatId]:
          !contact.lastSeeAt.me ||
          (lastMessagesAt.value[contact.chatId] &&
            contact.lastSeeAt.me &&
            contact.lastMessage.from !== userStore.user.uid &&
            lastMessagesAt.value[contact.chatId].at.seconds >
              contact.lastSeeAt.me.seconds),
      };
    });
  });

  // For new messages indicator line

  const newMessages = ref([]);

  const appendNewMessage = ({ id, at }) => {
    newMessages.value.push({ id, at });
  };

  const removeNewMessage = (id) => {
    newMessages.value = newMessages.value.filter(
      (message) => message.id !== id
    );
  };

  const resetNewMessages = () => {
    newMessages.value = [];
  };

  const firstNewMessageId = computed(() =>
    newMessages.value.length > 0
      ? newMessages.value.reduce((acc, cur) => {
          console.log("in reduce", acc.at.seconds);

          return acc.at.seconds <= cur.at.seconds ? acc : cur;
        }).id
      : null
  );

  const messagesListener = (chatId) => {
    const messagesRef = collection(db, "messages");
    const chatRef = collection(messagesRef, chatId, "chat");
    const q = query(chatRef, orderBy("at", "asc"));

    return onSnapshot(
      q,
      (snapshot) => {
        console.log("messages listener triggered! ");
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

  const sendMessage = async (content, image = null) => {
    let imageUrl = null;
    if (image) {
      imageUrl = await uploadFile(image, "messageImages/");
    }

    const data = {
      from: userStore.user.uid,
      content,
      image: imageUrl,
      at: serverTimestamp(),
    };

    const removeNullValue = (obj) => {
      const result = {};
      for (const key in obj) {
        if (obj[key]) {
          result[key] = obj[key];
        }
      }
      return result;
    };

    const messagesRef = collection(db, "messages");

    return await addDoc(
      collection(messagesRef, currentChatId, "chat"),
      removeNullValue(data)
    );
  };

  const updateLastMessage = async (
    { content, id },
    isImageSent = isImageSending.value
  ) => {
    // const isImageSent = isImageSending.value;

    const chatRef = doc(db, "messages", currentChatId);

    const messageDocRef = doc(chatRef, "chat", id);

    await updateDoc(chatRef, {
      lastMessage: {
        content,
        isImageSent,
        id,
        docRef: messageDocRef,
        from: userStore.user.uid,
      },
    });
  };

  const appendLocalList = (content) => {
    messagesList.value.push({
      from: userStore.user.uid,
      at: null,
      content,
      image: imagePreview.value,
    });

    if (imagePreview.value) {
      isImageSending.value = true;
      imagePreview.value = null;
    } else {
      isImageSending.value = false;
    }
  };

  const deleteMessage = async (messageId, isLast = false) => {
    const chatRef = doc(db, "messages", currentChatId);

    const messageDocRef = doc(chatRef, "chat", messageId);

    await deleteDoc(messageDocRef);

    // Update last message if the last message was deleted
    if (isLast) {
      const lastMessage = messagesList.value[messagesList.value.length - 1];
      //
      const content = lastMessage.content || null;
      const isImageSent = lastMessage.image ? true : false;

      await updateLastMessage({ content, id: lastMessage.id }, isImageSent);
    }
  };

  // Update lastSeeAt

  const messagesReading = ref([]);
  const isKept = ref({});

  const readMessage = (messageId) => {
    messagesReading.value.push(messageId);
    isKept.value[messageId] = false;
  };

  const keepLastMessage = (messageId) => {
    isKept.value[messageId] = true;
  };

  const updateLastSeeAt = async (time) => {
    const chatRef = doc(db, "messages", currentChatId);

    await updateDoc(chatRef, {
      [`lastSeeAt.${userStore.user.uid}`]: time,
    });
  };

  const lastSeeAt = ref(null);

  const setWhenLastSee = (time) => {
    if (lastSeeAt.value && time.seconds <= lastSeeAt.value.seconds) {
      return;
    }

    lastSeeAt.value = time;
  };

  const resetLastSee = () => {
    messagesReading.value = [];
    isKept.value = {};
    lastSeeAt.value = null;
  };

  const updateAndReset = () => {
    updateLastSeeAt(lastSeeAt.value);
    resetLastSee();
  };

  // Notification

  // const newMessages = ref([]);

  // Image
  const imagePreview = ref(null);
  const imageToBeSent = ref(null);

  // const imagePost = ref(null);

  const isImageSending = ref(false);

  const setImagePreview = (imageFile) => {
    imagePreview.value = URL.createObjectURL(imageFile);
  };

  const removeImagePreview = () => {
    imagePreview.value = null;
  };

  const setImageToBeSent = (imageFile) => {
    imageToBeSent.value = imageFile;
  };

  const removeImageToBeSent = () => {
    imageToBeSent.value = null;
  };

  const isShowImageViewer = ref(false);

  const imageViewedSrc = ref(null);

  const openImageViewer = (src) => {
    imageViewedSrc.value = src;
    isShowImageViewer.value = true;
  };

  const closeImageViewer = () => {
    isShowImageViewer.value = false;
    imageViewedSrc.value = null;
  };

  return {
    contactsList,
    messagesList,
    isEnterChat,
    currentContact,
    cleanChat,
    setCurrentChat,
    setCurrentContact,
    enterChat,
    addContact,
    loadContacts,
    contactsListener,
    newMessages,
    appendNewMessage,
    removeNewMessage,
    resetNewMessages,
    firstNewMessageId,
    messagesListener,
    loadLastMessages,
    triggerUnSubMessages,
    sendMessage,
    updateLastMessage,
    appendLocalList,
    deleteMessage,
    findChat,
    updateLastSeeAt,
    setWhenLastSee,
    updateAndReset,
    messagesReading,
    keepLastMessage,
    isKept,
    readMessage,
    areThereNews,
    imagePreview,
    isImageSending,
    setImagePreview,
    removeImagePreview,
    setImageToBeSent,
    removeImageToBeSent,
    imageToBeSent,
    isShowImageViewer,
    imageViewedSrc,
    openImageViewer,
    closeImageViewer,
  };
});
