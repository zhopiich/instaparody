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
      case "saved":
        col = "likes";
      case "created":
        filter = where(
          // Get a property key depending on its value
          `${filtered}By.${Object.keys(who).find((key) => who[key])}`,
          "==",
          `${who.userId || who.username}`
        );
        break;
      // default:
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

  async function uploadPost({ image, description }) {
    const imageUrl = await uploadFile(image);

    await addPost({
      image: imageUrl,
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

  // const actions = {
  //   like: {
  //     actedBies: "liked_bies",
  //     actedByME: "likedByMe",
  //     actPost: likePost,
  //   },
  //   favor: {
  //     actedBies: "favored_bies",
  //     actedByME: "favoredByMe",
  //     actPost: favorPost,
  //   },
  // };
  async function toggleActions({ postId, post }) {
    if (!userStore.isLoggedIn) return;

    let n;
    if (isLikedByMe.value[post.id]) {
      n = -1;

      await deleteDoc(doc(db, "likes", isLikedByMe.value[post.id]));

      isLikedByMe.value[post.id] = false;
    } else {
      n = 1;

      const docRef = await addDoc(collection(db, "likes"), {
        postId: post.id,
        image: post.image,
        description: post.description,
        createdBy: post.createdBy,
        createdAt: post.createdAt,
        likedBy: {
          avatar: userStore.user.photoURL,
          userId: userStore.user.uid,
          username: userStore.userDoc.username,
        },
        likedAt: serverTimestamp(),
      });

      isLikedByMe.value[post.id] = docRef.id;
    }

    const postRef = doc(db, "posts", post.id);

    await updateDoc(postRef, {
      likes: increment(n),
    });
  }

  async function loadIsLikedByMe(_postId) {
    if (!userStore.isLoggedIn) return;

    const q = query(
      collection(db, "likes"),
      where("likedBy.userId", "==", userStore.user.uid)
    );

    const postsLiked = await getDocs(q);
    const likedByUser = postsLiked.docs.find((post) => {
      return post.data().postId === _postId;
    });

    if (likedByUser) {
      isLikedByMe.value[_postId] = likedByUser.id;
    } else {
      isLikedByMe.value[_postId] = false;
    }
  }

  function resetIsLikedByMe() {
    isLikedByMe.value = {};
    console.log("isLikedByMe", isLikedByMe);
  }

  // No need
  // async function updateActionsCount(id) {
  //   const post = list.value.find((post) => post.id === id);
  //   const newCounts = await loadActionsCount(id);
  //   for (const action in newCounts) {
  //     post[action] = newCounts[action];
  //   }
  // }

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
    loadIsLikedByMe,
    resetIsLikedByMe,
  };
});
