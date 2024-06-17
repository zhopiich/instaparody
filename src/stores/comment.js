import { ref, computed, watch } from "vue";
import { defineStore } from "pinia";

// import { createComment, loadComments } from "../apis/comment";
import { usePostStore } from "./post.js";
import { useUserStore } from "./user.js";

//
import { addComment } from "../firebase/firestore.js";
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
  serverTimestamp,
  increment,
} from "firebase/firestore";
//

export const useCommentStore = defineStore("comment", () => {
  const list = ref([]);

  // function initializeComments(comments) {
  //   list.value = comments;
  // }

  // const postStore = usePostStore();
  // function increaseCommentCount(id) {
  //   const post = postStore.list.find((post) => post.id === id);
  //   post.comments++;
  // }

  let unsubscribe = null;

  const triggerUnSub = () => {
    if (unsubscribe) {
      unsubscribe();
      unsubscribe = null;
      console.log("comments unsub!");
    }
  };

  async function loadComments(_postId) {
    const colRef = collection(db, "comments");

    const q = query(colRef, where("postId", "==", _postId));

    unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        console.log("comments listener triggered!");
        const results = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));

        list.value = results;
        console.log(results);
      },
      (err) => {
        console.log(err.message);

        // list.value = false;

        // triggerUnSub();
      }
    );

    // const unwatch = watch(unsub, () => {
    //   unsub.value = false;
    //   console.log("comments unsub!");
    //   unsubscribe();
    //   unwatch();
    // });
  }

  function cleanComments() {
    list.value = [];
  }

  const userStore = useUserStore();

  async function uploadComment({ content, postId }) {
    if (!userStore.isLoggedIn) return;

    await Promise.all([
      addComment({
        content,
        postId,
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
  }

  async function deleteComment({ commentId, postId }) {
    await Promise.all([
      deleteDoc(doc(db, "comments", commentId)),
      updateDoc(doc(db, "posts", postId), {
        comments: increment(-1),
      }),
    ]);
  }

  const isFocusOnMounted = ref(false);
  const setIsFocus = (bool) => {
    isFocusOnMounted.value = bool;
  };

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
