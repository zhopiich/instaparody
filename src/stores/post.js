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
import { uploadFile, deleteFile } from "../firebase/storage.js";
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

    const q = query(
      ...[
        colRef,
        filter,
        // ...search,
        orderBy(filtered ? `${filtered}At` : "createdAt", "desc"),
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
    if (unsubscribe) {
      unsubscribe();
      unsubscribe = null;
      console.log("unsub! All");
    } else {
      console.log("No postsListener");
    }
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
      console.log("unsub", type);
    }
  };

  //
  const postSnapshot = ref(null);

  const postListener = (postId) => {
    return onSnapshot(
      doc(db, "posts", postId),
      (doc) => {
        if (doc.data()) {
          postSnapshot.value = { ...doc.data(), id: doc.id };
        } else {
          postSnapshot.value = "noSuchPost";
        }
      },
      (err) => {
        console.log(err.message);
      }
    );
  };

  let unsubPost = null;

  const loadPost = (postId) => {
    if (unsubPost !== null) {
      unsubPost();
    }

    unsubPost = postListener(postId);
  };

  const triggerUnSubPost = () => {
    if (unsubPost !== null) {
      unsubPost();
      unsubPost = null;
      console.log("unsub! Post");
    } else {
      console.log("No postListener");
    }

    postSnapshot.value = null;
  };

  const userStore = useUserStore();

  async function uploadPost({ images, description }) {
    if (!userStore.isLoggedIn) return;

    if (!images.length) {
      console.log("uploadPost: No images.");
      return;
    }

    const imagesUrl = await Promise.all(
      images.map((image) => uploadFile(image))
    );

    const docRef = await addPost({
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

    return docRef;
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
        // images: post.images,
        // description: post.description,
        createdBy: { userId: post.createdBy.userId },
        // createdAt: post.createdAt,
        [actedBy]: {
          avatar: userStore.user.photoURL,
          userId: userStore.user.uid,
          username: userStore.userDoc.username,
          displayName: userStore.user.displayName,
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

  // shown in the modal
  async function showPostDetails(id) {
    postIdClicked.value = id;

    if (userStore.isLoggedIn) {
      commentStore.loadComments(id);
    }

    toggleShowPostDetails(true);
  }

  function hidePostDetails() {
    postIdClicked.value = null;

    commentStore.triggerUnSub();
    commentStore.cleanComments();

    toggleShowPostDetails(false);
  }

  const clickedPost = computed(() =>
    postIdClicked.value && (list.value || postsFiltered.created.value)
      ? (list.value || postsFiltered.created.value).find(
          (post) => post.id === postIdClicked.value
        ) || "noSuchPost"
      : null
  );

  // loaded every time enter the page
  const loadPostDetails = (postId) => {
    loadPost(postId);

    if (userStore.isLoggedIn) {
      commentStore.loadComments(postId);
    }
  };

  const resetPostDetailsPage = () => {
    triggerUnSubPost();

    commentStore.triggerUnSub();
    commentStore.cleanComments();
  };

  async function searchPosts(term) {
    const postsResult = await loadPosts(
      "filters[description][$contains]=" + term
    );
    leadPostsShown(postsResult);
  }

  const usersLike = ref(null);

  const getUsersLike = async (postId, { isToBeChecked = false } = {}) => {
    if (isToBeChecked) {
      const docRef = doc(db, "posts", postId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        usersLike.value = "noSuchPost";
        return;
      }
    }

    const colRef = collection(db, "likes");
    const q = query(colRef, where("postId", "==", postId));

    const querySnapshot = await getDocs(q);

    usersLike.value = querySnapshot.docs.map((doc) => doc.data().likedBy);
  };

  const cleanUsersLike = () => {
    usersLike.value = null;
  };

  const infoUserCard = ref({});

  const getPostsByUser = async (_userId) => {
    if (infoUserCard.value.userId && infoUserCard.value.userId === _userId)
      return;

    infoUserCard.value = {};
    infoUserCard.value.userId = _userId;

    const userRef = doc(db, "users", _userId);

    const postsRef = collection(db, "posts");
    const queryPosts = query(
      postsRef,
      where("createdBy.userId", "==", _userId),
      orderBy("createdAt", "desc")
    );

    const [userSnap, postsSnap] = await Promise.all([
      getDoc(userRef),
      getDocs(queryPosts),
    ]);

    infoUserCard.value.intro = userSnap.data().intro;

    const posts = postsSnap.docs.map((doc) => doc.data());
    infoUserCard.value.countPosts = posts.length;
    infoUserCard.value.last3Posts = posts
      .slice(0, 3)
      .map((post) => post.image || post.images[0]);
  };

  const postsCount = ref(0);

  const getPostsCount = async (username) => {
    const postsRef = collection(db, "posts");
    const queryPosts = query(
      postsRef,
      where("createdBy.username", "==", username)
    );

    const postsSnap = await getDocs(queryPosts);

    postsCount.value = postsSnap.docs.length;
  };

  const deletePost = async ({ postId, images }) => {
    try {
      ["likes", "comments", "saves"].forEach(async (coll) => {
        const q = query(
          ...[
            collection(db, coll),
            where("postId", "==", postId),
            coll === "saves" &&
              // Required by the security rules
              where("createdBy.userId", "==", userStore.user.uid),
          ].filter((bool) => bool)
        );
        const querySnapshot = await getDocs(q);

        const involvedList = [];

        querySnapshot.forEach((doc) => {
          involvedList.push(doc.id);
        });

        await Promise.all(
          involvedList.map((id) => deleteDoc(doc(db, coll, id)))
        );
      });

      await Promise.all(images.map((url) => deleteFile(url)));

      await deleteDoc(doc(db, "posts", postId));
    } catch (err) {
      console.log(err);
      return err;
    }
  };

  const updateDescription = async ({ postId, newDesc }) => {
    const postRef = doc(db, "posts", postId);

    try {
      await updateDoc(postRef, {
        description: newDesc,
      });
    } catch (err) {
      console.log(err);
      return err;
    }
  };

  const deleteImage = async ({ postId, allImages, leftImages }) => {
    const discardedImages = allImages.filter(
      (image) => !leftImages.includes(image)
    );

    const postRef = doc(db, "posts", postId);

    try {
      await Promise.all(discardedImages.map((url) => deleteFile(url)));

      await updateDoc(postRef, {
        images: leftImages,
      });
    } catch (err) {
      console.log(err);
      return err;
    }
  };

  const getPostById = async (postId) => {
    const postRef = doc(db, "posts", postId);
    const postSnap = await getDoc(postRef);

    return postSnap.exists() ? postSnap.data() : "NoSuchPost";
  };

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
    postSnapshot,
    loadPost,
    triggerUnSubPost,
    uploadPost,
    toggleActions,
    postIdClicked,
    showPostDetails,
    hidePostDetails,
    clickedPost,
    loadPostDetails,
    resetPostDetailsPage,
    // postDetails,
    // searchResult,
    searchPosts,
    isLikedByMe,
    isSavedByMe,
    loadIsActedByMe,
    resetIsActedByMe,
    usersLike,
    getUsersLike,
    cleanUsersLike,
    infoUserCard,
    getPostsByUser,
    getPostsCount,
    postsCount,
    deletePost,
    updateDescription,
    deleteImage,
    getPostById,
  };
});
