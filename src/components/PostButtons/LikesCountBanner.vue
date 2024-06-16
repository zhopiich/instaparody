<template>
  <div class="flex items-start">
    <div v-if="post.likes === 0">
      <p class="leading-5">
        Be the first to
        <span
          class="font-bold hover:text-neutral-500 active:text-neutral-400 select-none cursor-pointer"
          @click="postStore.toggleActions({ postId: post.id, post })"
          >like this</span
        >
      </p>
    </div>
    <div v-else>
      <p
        class="cursor-pointer font-bold hover:text-neutral-500 active:text-neutral-400 leading-5 select-none"
        @click="showLikes(post.id)"
      >
        {{ post.likes + " like" + `${post.likes > 1 ? "s" : ""}` }}
      </p>
    </div>
  </div>
  <LikesList v-if="isShowLikesList" @close="closeLikes" />
</template>

<script setup>
import LikesList from "../LikesList.vue";

import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

import { useMediaQueryStore } from "../../stores/mediaQuery";
const mediaQueryStore = useMediaQueryStore();
const isMobile = computed(() => mediaQueryStore.isMobile);

const props = defineProps({
  post: {
    type: Object,
    default: {},
  },
});

import { usePostStore } from "../../stores/post";
const postStore = usePostStore();

const isShowLikesList = ref(false);

const showLikes = (postId) => {
  if (isMobile.value) {
    router.push("/post/" + postId + "/liked_by");
  } else {
    isShowLikesList.value = true;

    postStore.getUsersLike(postId);
  }
};

const closeLikes = () => {
  isShowLikesList.value = false;

  postStore.cleanUsersLike();
};
</script>

<style scoped></style>
