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
  or,
} from "firebase/firestore";
import { uploadFile, deleteFile } from "../firebase/storage.js";

import { dateToRelative } from "../utils/date";

export const useMessageStore = defineStore("message", () => {
  const isExtended = ref(false);

  const toggle = (bool = null) => {
    if (bool !== true && bool !== false) {
      isExtended.value = !isExtended.value;
    } else {
      isExtended.value = bool;
    }
  };

  const contactsList = ref(null);
  const messagesList = ref(null);

  const isEnterChat = ref(false);
  const currentChatId = ref(null);

  const setCurrentChat = (chatId) => {
    currentChatId.value = chatId;
  };

  // const selectedContactIndex = ref(null);
  // const setCurrentContact = ({ index = null, chatId = null } = {}) => {
  //   selectedContactIndex.value = index;
  // };

  const currentContact = computed(() => {
    if (!contactsList.value) return;
    return contactsList.value.find(
      (contact) => contact.chatId === currentChatId.value
    );
  });
  // const currentContact = computed(
  //   () => contactsList.value[selectedContactIndex.value]
  // );

  const enterChat = (bool) => {
    isEnterChat.value = bool;
  };

  const cleanChat = () => {
    messagesList.value = null;
  };

  // Contact a user

  const userStore = useUserStore();

  const findChat = async ({ userId1, userId2 }) => {
    if (!userStore.isLoggedIn) return;

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

  const addContact = async ({ username = null, userId = null } = {}) => {
    if (!userStore.isLoggedIn) return;

    const me = {
      username: userStore.userDoc.username,
      userId: userStore.user.uid,
    };

    if (username === me.username || userId === me.userId) return;

    const contact = { username, userId };

    //
    try {
      const { isChatExists, chatId } = await findChat({
        userId1: me.userId,
        userId2: contact.userId,
      });

      if (isChatExists) {
        return chatId;
      }
    } catch (error) {
      console.log(error);
      return;
    }

    try {
      const newChatRef = await addChat({
        // users: [me.userId, contact.userId],
        users: { [me.userId]: true, [contact.userId]: true },
        usersInfo: [{ ...me }, { ...contact }],

        lastMessage: null,
        lastSeeAt: {
          [me.userId]: null,
          [contact.userId]: null,
        },
      });

      return newChatRef.id;
    } catch (error) {
      console.log(error);
      return;
    }
  };

  // const getContacts = async () => {
  //   const messagesRef = collection(db, "messages");
  //   const q = query(
  //     messagesRef,
  //     where(`users.${userStore.user.uid}`, "==", true)
  //   );

  //   const querySnapshot = await getDocs(q);
  //   const results = querySnapshot.docs.map((doc) => ({
  //     ...doc.data(),
  //     id: doc.id,
  //   }));

  //   contactsList.value = results.map((chat) => ({
  //     ...(chat.usersInfo[0].userId === userStore.user.uid
  //       ? { ...chat.usersInfo[1], index: 1 }
  //       : { ...chat.usersInfo[0], index: 0 }),
  //     lastMessage: chat.lastMessage,
  //     chatId: chat.id,
  //   }));
  // };

  // const getContactsInfo = async (newContactsList) => {
  //   let contactsInfo;

  //   try {
  //     contactsInfo = await Promise.all(
  //       newContactsList.map((user) =>
  //         userStore.getUserInfo({ userId: user.userId })
  //       )
  //     );
  //   } catch (error) {
  //     console.log(error);
  //     return;
  //   }

  //   contactsInfo.forEach((info, index) => {
  //     ["avatar", "displayName"].forEach((item) => {
  //       contactsList.value[index][item] = info[item];
  //     });
  //   });
  // };

  const lastMessagesAt = ref({});

  const contactsListener = () => {
    if (!userStore.isLoggedIn) return;

    console.log("**Contacts Listening...");

    const contactFormat = (chat) => {
      const isMeFirst = chat.usersInfo[0].userId === userStore.user.uid;

      return {
        ...chat.usersInfo[isMeFirst ? 1 : 0],
        // index: isMeFirst ? 1 : 0,
        lastSeeAt: {
          me: chat.lastSeeAt[chat.usersInfo[!isMeFirst ? 1 : 0].userId],
          other: chat.lastSeeAt[chat.usersInfo[isMeFirst ? 1 : 0].userId],
        },
        lastMessage: chat.lastMessage,
        chatId: chat.id,
      };
    };

    const sortByLastSee = (contacts) => {
      // get the last time the users saw the messages in each chat
      const lastTime = (lastSeeAt) => {
        let lastTimeList = [];
        for (let user in lastSeeAt) {
          lastTimeList.push(lastSeeAt[user]);
        }

        return lastTimeList.sort((a, b) => b - a)[0];
      };

      return contacts.sort(
        (a, b) => lastTime(b.lastSeeAt) - lastTime(a.lastSeeAt)
      );
    };

    const getLastAt = async (contact) => {
      if (!contact.lastMessage) {
        lastMessagesAt.value[contact.chatId] = "noMessages";
        return;
      }

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
    };

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

        if (contactsList.value === null) {
          const results = snapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }));

          const unsorted = results.map((contact) => contactFormat(contact));
          contactsList.value = sortByLastSee(unsorted);

          // getContactsInfo(contactsList.value);
          contactsList.value.forEach((contact) => {
            userStore.addUserInfo(contact.userId);
          });

          // Update lastMessagesAt if there's new
          contactsList.value.forEach((contact) => {
            getLastAt(contact);
          });
        } else {
          snapshot.docChanges().forEach((change) => {
            if (change.type === "added") {
              const added = contactFormat(change.doc.data());
              added.chatId = change.doc.id;

              contactsList.value.unshift(added);
              // getContactsInfo([added]);
              userStore.addUserInfo(added.userId);
              getLastAt(added);
            }
            if (change.type === "modified") {
              const modified = change.doc.data();

              const modifiedIndex = contactsList.value.findIndex(
                (contact) => contact.chatId === change.doc.id
              );

              const oldLastAt =
                lastMessagesAt.value[change.doc.id] === "noMessages"
                  ? "noOldMessages"
                  : lastMessagesAt.value[change.doc.id].at;
              const oldLastMessageId = !contactsList.value[modifiedIndex]
                .lastMessage
                ? "noOldMessages"
                : contactsList.value[modifiedIndex].lastMessage.id;

              if (
                oldLastMessageId === "noOldMessages" ||
                !modified.lastMessage ||
                oldLastMessageId !== modified.lastMessage.id
              ) {
                contactsList.value[modifiedIndex].lastMessage =
                  modified.lastMessage;
              }

              contactsList.value[modifiedIndex].lastSeeAt = {
                me: modified.lastSeeAt[userStore.user.uid],
                other:
                  modified.lastSeeAt[contactsList.value[modifiedIndex].userId],
              };

              const raiseNewFromContact = () => {
                if (
                  !modified.lastMessage ||
                  (modified.lastMessage &&
                    oldLastMessageId === modified.lastMessage.id)
                )
                  return;

                const newLastAt =
                  lastMessagesAt.value[change.doc.id] === "noMessages"
                    ? "noNewMessages"
                    : lastMessagesAt.value[change.doc.id].at;

                const isNewFromContact =
                  modified.lastMessage.from !== userStore.user.uid &&
                  (oldLastAt === "noOldMessages" ||
                    (newLastAt !== "noNewMessages" &&
                      oldLastAt.seconds <= newLastAt.seconds));

                if (isNewFromContact) {
                  contactsList.value.unshift(
                    contactsList.value.splice(modifiedIndex, 1)[0]
                  );
                }
              };

              const getLastBeforeRaise = async () => {
                // if there's new or the last had been deleted
                await getLastAt(contactsList.value[modifiedIndex]);
                raiseNewFromContact();
              };

              getLastBeforeRaise();
            }
            if (change.type === "removed") {
              // to be completed

              enterChat(false);
              resetNewMessages();
              resetReplied();
              triggerUnSubMessages();
              cleanChat();
              setCurrentChat(null);

              contactsList.value = contactsList.value.filter(
                (contact) => contact.chatId !== change.doc.id
              );
            }
          });
        }
      },
      (err) => {
        console.log(err.message);

        // contactsList.value = "error";
      }
    );
  };

  let unSubContacts;
  const loadContacts = () => {
    if (!userStore.isLoggedIn) return;

    unSubContacts = contactsListener();
  };

  const triggerUnSubContacts = () => {
    if (unSubContacts) {
      unSubContacts();
      unSubContacts = null;
      console.log("**Contacts unsubbed");
    }
  };

  const areThereNews = computed(() => {
    if (!contactsList.value) return {};

    for (const contact of contactsList.value) {
      if (!lastMessagesAt.value[contact.chatId]) return {};
    }

    const obj = {};

    contactsList.value.forEach((contact) => {
      obj[contact.chatId] =
        contact.lastMessage !== null &&
        contact.lastMessage.from !== userStore.user.uid &&
        ((contact.lastSeeAt.me &&
          lastMessagesAt.value[contact.chatId] !== "noMessages" &&
          lastMessagesAt.value[contact.chatId].at.seconds >
            contact.lastSeeAt.me.seconds) ||
          !contact.lastSeeAt.me);
    });

    return obj;
  });

  // const isThereNew = computed(
  //   () => areThereNews.value[currentContact.value.chatId]
  // );
  const isThereNew = computed(() => areThereNews.value[currentChatId.value]);

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

  const isChatMine = ref(false);
  const noNeedToCheckChat = () => {
    isChatMine.value = true;
  };

  const isChatAvailable = async (chatId) => {
    if (!userStore.isLoggedIn) return false;

    if (isChatMine.value) {
      isChatMine.value = false;
      return true;
    }

    const chatRef = doc(db, "messages", chatId);

    try {
      const chatSnap = await getDoc(chatRef);
      return chatSnap.exists();
    } catch (err) {
      // console.log(err);

      // the chat doesn't exist or isn't yours,
      // rejected by Firestore due to the security rules
      return false;
    }
  };

  const messagesListener = (chatId) => {
    if (!userStore.isLoggedIn) return;

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

  let unSubMessages = null;
  const triggerUnSubMessages = () => {
    if (unSubMessages !== null) {
      unSubMessages();
      unSubMessages = null;
      console.log("**messages unsubbed");
    }
  };

  const loadMessages = async (chatId) => {
    if (unSubMessages !== null) {
      triggerUnSubMessages();
    }

    if (!(await isChatAvailable(chatId))) {
      messagesList.value = "chatNotAvailable";
      return;
    }

    unSubMessages = messagesListener(chatId);
  };

  const initialReplied = { content: null, image: null };
  const repliedMessage = reactive({ ...initialReplied });

  const isThereReplied = computed(() =>
    ["content", "image"].some((type) => repliedMessage[type] !== null)
  );

  const replyToWho = ref(null);

  const replyToMessage = ({ content = null, image = null } = {}, isFromMe) => {
    if (!content && !image) return;

    Object.assign(repliedMessage, { content, image });

    replyToWho.value = isFromMe
      ? userStore.user.displayName
      : currentContact.value.displayName;
  };

  const resetReplied = () => {
    if (isThereReplied.value) {
      Object.assign(repliedMessage, initialReplied);
    }

    replyToWho.value = null;
  };

  const sendMessage = async (content, image = null) => {
    if (!userStore.isLoggedIn) return;

    const imageUrl = image
      ? await uploadFile(
          image,
          "messageImages/" + userStore.userDoc.username + "/"
        )
      : null;

    const data = {
      from: userStore.user.uid,
      content,
      ...(imageUrl ? { image: imageUrl } : {}),
      ...(isThereReplied.value ? { replyTo: { ...repliedMessage } } : {}),
      at: serverTimestamp(),
    };

    resetReplied();

    const messagesRef = collection(db, "messages");

    return await addDoc(
      collection(messagesRef, currentChatId.value, "chat"),
      data
    );
  };

  const updateLastMessage = async (
    { content = null, id = null, from = userStore.user.uid } = {},
    isImageSent = isImageSending.value
  ) => {
    if (!userStore.isLoggedIn) return;

    const chatRef = doc(db, "messages", currentChatId.value);

    let lastMessage = null;
    if (id) {
      const messageDocRef = doc(chatRef, "chat", id);

      lastMessage = {
        content,
        isImageSent,
        id,
        docRef: messageDocRef,
        from,
      };
    }

    await updateDoc(chatRef, { lastMessage });
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

  const deleteMessage = async ({
    messageId,
    imageUrl = null,
    isLast = false,
  } = {}) => {
    if (!userStore.isLoggedIn) return;

    const chatRef = doc(db, "messages", currentChatId.value);

    const messageDocRef = doc(chatRef, "chat", messageId);

    await deleteDoc(messageDocRef);

    if (imageUrl) {
      await deleteFile(imageUrl);
    }

    // Update last message if the last message was deleted
    if (isLast) {
      const lastMessage = messagesList.value[messagesList.value.length - 1];
      //
      const content = lastMessage ? lastMessage.content || null : null;
      const id = lastMessage ? lastMessage.id : null;
      const from = lastMessage ? lastMessage.from : null;
      const isImageSent = lastMessage && lastMessage.image ? true : false;

      await updateLastMessage({ content, id, from }, isImageSent);
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
    if (!userStore.isLoggedIn) return;

    const chatRef = doc(db, "messages", currentChatId.value);

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

  // Search users to add to contact

  const isShowSearch = ref(false);

  const toggleSearch = (bool = null) => {
    if (bool === null) {
      isShowSearch.value = !isShowSearch.value;
    } else {
      isShowSearch.value = bool;
    }
  };

  // Width of the scrollbar

  const scrollbarWidth = ref(0);

  const setScrollbarWidth = (width) => {
    scrollbarWidth.value = width;
  };

  const input = ref(null);
  const setInput = (ele) => {
    if (input.value === ele) return;
    input.value = ele;
  };

  // Reset all states when log out
  const reset = () => {
    triggerUnSubContacts();
    triggerUnSubMessages();

    resetReplied();

    isExtended.value = false;
    contactsList.value = null;
    messagesList.value = null;

    isEnterChat.value = false;
    currentChatId.value = null;

    lastMessagesAt.value = {};

    newMessages.value = [];

    imagePreview.value = null;
    imageToBeSent.value = null;
    isImageSending.value = false;

    isShowSearch.value = false;
  };

  // emoji picker data
  const emojiIndex = ref(null);

  const importEmojiData = async () => {
    const [data, { EmojiIndex }] = await Promise.all([
      import("emoji-mart-vue-fast/data/twitter.json"),
      import("emoji-mart-vue-fast/src"),
    ]);

    emojiIndex.value = new EmojiIndex(data.default);
  };

  return {
    isExtended,
    toggle,
    contactsList,
    messagesList,
    isEnterChat,
    currentChatId,
    currentContact,
    cleanChat,
    setCurrentChat,
    // setCurrentContact,
    enterChat,
    addContact,
    // getContacts,
    // contactsListener,
    loadContacts,
    triggerUnSubContacts,
    newMessages,
    appendNewMessage,
    removeNewMessage,
    resetNewMessages,
    firstNewMessageId,
    noNeedToCheckChat,
    messagesListener,
    loadMessages,
    triggerUnSubMessages,
    repliedMessage,
    isThereReplied,
    replyToWho,
    replyToMessage,
    resetReplied,
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
    isThereNew,
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
    isShowSearch,
    toggleSearch,
    scrollbarWidth,
    setScrollbarWidth,
    lastMessagesAt,
    input,
    setInput,
    reset,
    emojiIndex,
    importEmojiData,
  };
});
