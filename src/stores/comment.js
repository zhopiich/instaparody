import { ref } from "vue";
import { defineStore } from "pinia";

import { useUserStore } from "./user.js";

import { addComment } from "../firebase/firestore.js";
import { db } from "../firebase/firebase.js";
import {
  collection,
  getDoc,
  query,
  where,
  onSnapshot,
  doc,
  deleteDoc,
  updateDoc,
  serverTimestamp,
  increment,
} from "firebase/firestore";

export const useCommentStore = defineStore("comment", () => {
  const list = ref([]);

  let unsubscribe = null;

  const triggerUnSub = () => {
    if (unsubscribe === null) return;

    unsubscribe();
    unsubscribe = null;
  };

  const loadComments = async (_postId) => {
    triggerUnSub();

    const colRef = collection(db, "comments");
    const q = query(colRef, where("postId", "==", _postId));

    unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const results = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));

        list.value = results;
      },
      (err) => {
        console.log(err.message);
      }
    );
  };

  const cleanComments = () => (list.value = []);

  const userStore = useUserStore();

  const uploadComment = async ({ content, postId, postCreatedBy }) => {
    if (!userStore.isLoggedIn) return;

    await Promise.all([
      addComment({
        content,
        postId,
        postCreatedBy,
        createdBy: {
          displayName: userStore.user.displayName,
          avatar: userStore.user.photoURL,
          userId: userStore.user.uid,
          username: userStore.userDoc.username,
        },
        createdAt: serverTimestamp(),
      }),
      updateDoc(doc(db, "posts", postId), {
        comments: increment(1),
      }),
    ]);
  };

  const deleteComment = async ({ commentId, postId }) => {
    await Promise.all([
      deleteDoc(doc(db, "comments", commentId)),
      updateDoc(doc(db, "posts", postId), {
        comments: increment(-1),
      }),
    ]);
  };

  const isFocusOnMounted = ref(false);
  const setIsFocus = (bool) => (isFocusOnMounted.value = bool);

  return {
    list,
    loadComments,
    cleanComments,
    triggerUnSub,
    uploadComment,
    deleteComment,
    isFocusOnMounted,
    setIsFocus,
  };
});
