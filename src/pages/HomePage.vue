<template>
  <div class="py-16">
    <!-- <PostList :isError="!posts" :isPostsEmpty="posts?.length === 0"> -->
    <PostList :postsStatus="postsStatus">
      <PostItem v-for="post in posts" :post="post" :key="post.id" />
    </PostList>
    <!-- <PostDetails v-if="isShowPostDetails" /> -->
    <PostUpload v-if="isShowPostUpload" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { onBeforeRouteLeave } from "vue-router";
import PostList from "../components/PostList.vue";
import PostItem from "../components/PostItem.vue";
// import PostDetails from "../components/PostDetails.vue";
import PostUpload from "../components/PostUpload.vue";

import { usePostStore } from "../stores/post";
import { useUserStore } from "../stores/user";

const postStore = usePostStore();
const isShowPostUpload = computed(() => postStore.isShowPostUpload);
// const isShowPostDetails = computed(() => postStore.isShowPostDetails);
const posts = computed(() => postStore.list);

const postsStatus = computed(() => {
  if (!posts.value) return "loading";
  if (posts.value === "error") return "error";
  if (posts.value.length === 0) return "empty";
});

const userStore = useUserStore();

// import { db } from "../firebase/firebase.js";
// import {
//   collection,
//   collectionGroup,
//   getDocs,
//   getDoc,
//   query,
//   where,
//   onSnapshot,
//   doc,
//   serverTimestamp,
// } from "firebase/firestore";

// onMounted(() => {
//   // postStore.loadPostsAll();
//   // console.log("Home", posts.value);
//   const colRef = collection(db, "posts");
//   // const docRef = doc(db, "comment", "kyCmLrRejsiezhRljy7E");
//   // const subColRef = collectionGroup(db, "likedBy");

//   let q;
//   let w;
//   // w = ["userId", "==", "uid-b"];
//   w = ["description", "==", "username"];
//   // w = ["userId", "array-contains-any", ["oo"]];
//   if (w) {
//     // q = query(subColRef, where(...w));
//     q = query(colRef, where(...w));
//   }

//   // onSnapshot(docRef, (snapshot) => {
//   //   // console.log("posts listener triggered!");
//   //   // const results = snapshot.docs.map((doc) => ({
//   //   //   ...doc.data(),
//   //   //   id: doc.id,
//   //   // }));

//   //   console.log("home: ", snapshot.data());
//   // });

//   // onSnapshot(q, (snapshot) => {
//   //   // console.log("posts listener triggered!");
//   //   // const results = snapshot.docs.map((doc) => ({
//   //   //   ...doc.data(),
//   //   //   id: doc.id,
//   //   // }));

//   //   snapshot.forEach((doc) => {
//   //     console.log(doc.id, "->", doc.data().createdBy?.username);
//   //   });
//   //   // console.log("home_sub: ", results);
//   // });

//   // const getBooks = async () => {
//   //   const booksCol = collection(db, "posts");
//   //   const bookSnapshot = await getDocs(query(booksCol, where(...w)));
//   //   const bookList = bookSnapshot.docs.map((doc) => ({
//   //     ...doc.data(),
//   //     id: doc.id,
//   //   }));
//   //   console.log(bookList);
//   // };
//   // getBooks();
// });

onBeforeRouteLeave(() => {
  // console.log(postStore.unsubscribe);
  postStore.triggerUnSub();
});
</script>

<style scoped></style>
