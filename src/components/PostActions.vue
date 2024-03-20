<template>
  <div class="postActions">
    <TheIcon
      icon="like"
      @click="postStore.toggleActions({ postId: post.id, post })"
      :fill="isLikedByMe ? '#FF3C3C' : 'none'"
      :stroke="isLikedByMe ? '#FF3C3C' : '#000000'"
    /><span>{{ post.likes || "" }}</span>
    <TheIcon
      icon="comment"
      @click="
        !postStore.isShowPostDetails && postStore.showPostDetails(post.id)
      "
      fill="none"
      stroke="#000000"
    /><span>{{ post.comments || "" }}</span>
    <TheIcon
      icon="favorite"
      @click="postStore.toggleActions({ postId: post.id, post, type: 'saved' })"
      :fill="isSavedByMe ? '#FFD12E' : 'none'"
      :stroke="isSavedByMe ? '#FFD12E' : '#000000'"
    /><span>{{ post.saves || "" }}</span>
  </div>
</template>

<script setup>
import TheIcon from "./TheIcon.vue";

import { ref, onMounted, computed, watchEffect, watch } from "vue";

// import { db } from "../firebase/firebase.js";
// import { collection, query, where, getDocs } from "firebase/firestore";

const props = defineProps({
  post: {
    type: Object,
    default: {},
  },
});

import { usePostStore } from "../stores/post";
const postStore = usePostStore();

// import { useUserStore } from "../stores/user";
// const userStore = useUserStore();

const isLikedByMe = computed(() => postStore.isLikedByMe[props.post.id]);
const isSavedByMe = computed(() => postStore.isSavedByMe[props.post.id]);

onMounted(async () => {
  // if (postStore.isLikedByMe[props.post.id] === undefined) {
  if (!postStore.isLikedByMe[props.post.id]) {
    postStore.loadIsActedByMe({ postId: props.post.id, type: "liked" });
  }
  if (!postStore.isSavedByMe[props.post.id]) {
    postStore.loadIsActedByMe({ postId: props.post.id, type: "saved" });
  }
});
</script>

<style scoped>
.postActions {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  justify-items: center;
  column-gap: 16px;
  row-gap: 4px;
}

.postActions > svg {
  width: 32px;
  height: 32px;
  grid-row: 1 / 2;
  cursor: pointer;
}

.postActions > span {
  font-size: 14px;
}
</style>
