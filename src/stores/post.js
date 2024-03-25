import { ref, reactive, computed, watch, toRef } from "vue";
import { defineStore } from "pinia";

// import {
//   createPost,
//   likePost,
//   favorPost,
//   loadPosts,
//   getPostsFiltered,
//   loadActionsCount,
// } from "../apis/post";
import { useCommentStore } from "./comment";
import { useUserStore } from "./user.js";

import { addPost } from "../firebase/firestore.js";
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
  serverTimestamp,
  increment,
  startAt,
  endAt,
} from "firebase/firestore";
import { uploadFile } from "../firebase/storage.js";
//

export const usePostStore = defineStore("post", () => {
  const isShowPostUpload = ref(false);
  function toggleShowPostUpload(bool) {
    isShowPostUpload.value = bool;
  }

  const isShowPostDetails = ref(false);
  function toggleShowPostDetails(bool) {
    isShowPostDetails.value = bool;
  }

  const list = ref(null);
  function leadPostsShown(postsToBeShown) {
    list.value = postsToBeShown;
  }

  function postsListener({
    receiver = list,
    filtered = null,
    who = { userId: null, username: null },
    // searchTerm = null,
  } = {}) {
    let col = "posts";
    let filter;
    // let search = [null];

    switch (filtered) {
      case "liked":
        col = "likes";
        break;
      case "saved":
        col = "saves";
        break;
      // case "created":
      // break;
      // default:
    }

    if (filtered) {
      filter = where(
        // Get a property key depending on its value
        `${filtered}By.${Object.keys(who).find((key) => who[key])}`,
        "==",
        `${who.userId || who.username}`
      );
    }

    // if (searchTerm) {
    //   search = [
    //     where("description", ">=", searchTerm),
    //     where("description", "<=", searchTerm + "\uf8ff"),
    //   ];
    // }

    const colRef = collection(db, col);

    // const q = query(
    //   ...[
    //     colRef,
    //     orderBy("description"),
    //     startAt(searchTerm),
    //     endAt(searchTerm + "\uf8ff"),
    //   ].filter((i) => i)
    // );
    const q = query(
      ...[
        colRef,
        filter,
        // ...search,
        orderBy("createdAt", "desc"),
      ].filter((i) => i)
    );

    return onSnapshot(
      q,
      (snapshot) => {
        console.log("posts listener triggered! " + filtered);
        const results = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));

        receiver.value = results;
      },
      (err) => {
        console.log(err.message);

        receiver.value = "error";
      }
    );
  }

  let unsubscribe;

  function loadPostsAll() {
    unsubscribe = postsListener();
  }

  const triggerUnSub = () => {
    unsubscribe();
    unsubscribe = null;
    console.log("unsub! All");
  };

  function cleanPostsAll() {
    list.value = null;
  }

  const types = ["created", "liked", "saved"];
  // Temp post lists
  const postsFiltered = (() => {
    const obj = {};

    for (const type of types) {
      obj[type] = ref(null);
    }

    return obj;
  })();

  function cleanPostsFiltered() {
    for (const type in postsFiltered) {
      // Negligence -> postsFiltered[type] = ref(null);
      postsFiltered[type].value = null;
    }
  }

  const unsubFiltered = {};

  // Upon a tab seleted
  async function loadPostsFiltered(
    type = "created",
    who = { userId: userStore.user.userId }
  ) {
    if (postsFiltered[type].value) return;

    unsubFiltered[type] = postsListener({
      receiver: postsFiltered[type],
      filtered: type,
      who,
    });
  }

  const triggerUnSubFiltered = () => {
    for (const type in unsubFiltered) {
      unsubFiltered[type]();
      delete unsubFiltered[type];
    }
  };

  const userStore = useUserStore();

  async function uploadPost({ images, description }) {
    // const imageUrl = await uploadFile(image);

    const imagesUrl = await Promise.all(
      images.map((image) => uploadFile(image))
    );

    await addPost({
      images: imagesUrl,
      description,
      createdBy: {
        displayName: userStore.user.displayName,
        avatar: userStore.user.photoURL,
        userId: userStore.user.uid,
        username: userStore.userDoc.username,
      },
      createdAt: serverTimestamp(),
      likes: 0,
      saves: 0,
      comments: 0,
    });

    toggleShowPostUpload(false);
  }

  const isLikedByMe = ref({});
  const isSavedByMe = ref({});

  async function toggleActions({ postId, post, type = "liked" } = {}) {
    if (!userStore.isLoggedIn) return;

    let receiver, col, actedBy, actedAt, count;
    switch (type) {
      case "liked":
        receiver = isLikedByMe;
        col = "likes";
        actedBy = "likedBy";
        actedAt = "likedAt";
        count = "likes";
        break;
      case "saved":
        receiver = isSavedByMe;
        col = "saves";
        actedBy = "savedBy";
        actedAt = "savedAt";
        count = "saves";
        break;
    }

    let n;
    if (receiver.value[post.id]) {
      n = -1;

      await deleteDoc(doc(db, col, receiver.value[post.id]));

      receiver.value[post.id] = false;
    } else {
      n = 1;

      const docRef = await addDoc(collection(db, col), {
        postId: post.id,
        images: post.images,
        description: post.description,
        createdBy: post.createdBy,
        createdAt: post.createdAt,
        [actedBy]: {
          avatar: userStore.user.photoURL,
          userId: userStore.user.uid,
          username: userStore.userDoc.username,
        },
        [actedAt]: serverTimestamp(),
      });

      receiver.value[post.id] = docRef.id;
    }

    const postRef = doc(db, "posts", post.id);

    await updateDoc(postRef, {
      [count]: increment(n),
    });
  }

  async function loadIsActedByMe({ postId, type = "liked" } = {}) {
    if (!userStore.isLoggedIn) return;

    let receiver, col, actedBy;
    switch (type) {
      case "liked":
        receiver = isLikedByMe;
        col = "likes";
        actedBy = "likedBy";
        break;
      case "saved":
        receiver = isSavedByMe;
        col = "saves";
        actedBy = "savedBy";
        break;
    }

    const q = query(
      collection(db, col),
      where(actedBy + ".userId", "==", userStore.user.uid)
    );

    const postsActed = await getDocs(q);
    const actedByUser = postsActed.docs.find((post) => {
      return post.data().postId === postId;
    });

    if (actedByUser) {
      receiver.value[postId] = actedByUser.id;
    } else {
      receiver.value[postId] = false;
    }
  }

  function resetIsActedByMe() {
    isLikedByMe.value = {};
    isSavedByMe.value = {};
  }

  const commentStore = useCommentStore();

  const postIdClicked = ref(null);

  async function showPostDetails(id, { idLikedOrSaved = null } = {}) {
    postIdClicked.value = id;

    if (userStore.isLoggedIn) {
      commentStore.loadComments(idLikedOrSaved || id);
    }

    toggleShowPostDetails(true);
  }

  function hidePostDetails() {
    commentStore.triggerUnSub();
    // setCurrentId(null);
    commentStore.cleanComments();
    toggleShowPostDetails(false);
  }

  async function searchPosts(term) {
    const postsResult = await loadPosts(
      "filters[description][$contains]=" + term
    );
    leadPostsShown(postsResult);
  }

  return {
    isShowPostUpload,
    toggleShowPostUpload,
    isShowPostDetails,
    toggleShowPostDetails,
    list,
    // loadAllPosts,
    loadPostsAll,
    cleanPostsAll,
    // unsubscribe,
    triggerUnSub,
    cleanPostsFiltered,
    postsFiltered,
    loadPostsFiltered,
    triggerUnSubFiltered,
    uploadPost,
    toggleActions,
    postIdClicked,
    showPostDetails,
    hidePostDetails,
    // postDetails,
    // searchResult,
    searchPosts,
    isLikedByMe,
    isSavedByMe,
    loadIsActedByMe,
    resetIsActedByMe,
  };
});
