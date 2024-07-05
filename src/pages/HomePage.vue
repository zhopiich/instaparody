<template>
  <div class="py-16">
    <div
      v-if="['error', 'empty'].some((status) => postsStatus === status)"
      class="font-sans text-lg text-zinc-500"
    >
      {{
        {
          error: "Sorry, something went wrong...",
          empty: "No posts",
        }[postsStatus]
      }}
    </div>

    <PostList v-else>
      <template v-if="postsStatus === 'loading'">
        <PostItemLoader v-for="n in 3" :key="n" />
      </template>

      <template v-else>
        <PostItem v-for="post in posts" :post="post" :key="post.id" />
      </template>
    </PostList>
  </div>

  <PostDetails v-if="isShowPostDetails" />
  <!-- <PostUpload v-if="isShowPostUpload" /> -->
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { onBeforeRouteLeave } from "vue-router";
import PostList from "../components/PostList.vue";
import PostItem from "../components/PostItem.vue";
import PostDetails from "../components/PostDetails.vue";
// import PostUpload from "../components/PostUpload.vue";
import PostItemLoader from "../components/PostItemLoader.vue";

import { usePostStore } from "../stores/post";
// import { useUserStore } from "../stores/user";

const postStore = usePostStore();
// const isShowPostUpload = computed(() => postStore.isShowPostUpload);
const isShowPostDetails = computed(() => postStore.isShowPostDetails);
const posts = computed(() => postStore.list);

const postsStatus = computed(() => {
  if (!posts.value) return "loading";
  if (posts.value === "error") return "error";
  if (posts.value.length === 0) return "empty";
});

// const userStore = useUserStore();

onBeforeRouteLeave(() => {
  postStore.triggerUnSub();
});

onUnmounted(() => {
  postStore.cleanPostsAll();
});
</script>

<style scoped></style>
