<template>
  <div>
    <!-- <h2 class="title">Search Result: plant</h2> -->
    <PostList :isResultEmpty="searchResult.length === 0">
      <PostItem v-for="post in searchResult" :post="post" :key="post.id" />
    </PostList>
    <PostDetails v-if="isShowPostDetails" />
  </div>
</template>

<script setup>
import { computed, onBeforeMount } from "vue";
import { useRouter, onBeforeRouteUpdate } from "vue-router";
import PostList from "../components/PostList.vue";
import PostItem from "../components/PostItem.vue";
import PostDetails from "../components/PostDetails.vue";

import { usePostStore } from "../stores/post";
const postStore = usePostStore();
// const searchResult = computed(() => postStore.searchResult);
const searchResult = computed(() => postStore.list);
const isShowPostDetails = computed(() => postStore.isShowPostDetails);

const props = defineProps(["query"]);
onBeforeMount(() => {
  postStore.searchPosts(props.query);
});

const router = useRouter();
onBeforeRouteUpdate((to) => {
  if (!to.query.q) {
    router.push({
      name: "home",
    });
  }
  postStore.searchPosts(to.query.q);
});
</script>

<style scoped></style>
