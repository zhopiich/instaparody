<template>
  <!-- <div> -->
  <PostList :isError="!posts" :isPostsEmpty="posts?.length === 0">
    <!-- <PostItem v-for="n in 10" /> -->
    <PostItem v-for="post in posts" :post="post" :key="post.id" />
  </PostList>
  <PostDetails v-if="isShowPostDetails" />
  <PostUpload v-if="isShowPostUpload" />
  <!-- </div> -->
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { onBeforeRouteLeave } from "vue-router";
import PostList from "../components/PostList.vue";
import PostItem from "../components/PostItem.vue";
import PostDetails from "../components/PostDetails.vue";
import PostUpload from "../components/PostUpload.vue";

import { usePostStore } from "../stores/post";

const postStore = usePostStore();
const isShowPostUpload = computed(() => postStore.isShowPostUpload);
const isShowPostDetails = computed(() => postStore.isShowPostDetails);
const posts = computed(() => postStore.list);
// const posts = ref([]);

onMounted(() => {
  // postStore.loadPostsAll();
  // console.log("Home", posts.value);
});

onBeforeRouteLeave(() => {
  // console.log(postStore.unsubscribe);
  postStore.triggerUnSub();
});
</script>

<style scoped></style>
