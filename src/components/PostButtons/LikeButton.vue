<template>
  <div class="h-10 aspect-square cursor-pointer">
    <div
      class="w-full h-full flex justify-center items-center"
      :class="{
        'hover:text-neutral-500 active:text-neutral-400': !isLikedByMe,
      }"
      @click="postStore.toggleActions({ postId: post.id, post })"
      @mouseenter="!isLikedByMe && removeBounce()"
      @mouseleave="!isLikedByMe && addBounce()"
      ref="likeButton"
    >
      <FontAwesomeIcon
        :icon="isLikedByMe ? filledHeart : emptyHeart"
        class="fa-xl transition-transform"
        :class="{ 'text-red-500 active:text-red-400 liked': isLikedByMe }"
      />
    </div>
  </div>
</template>

<script setup>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faHeart as emptyHeart } from "@fortawesome/free-regular-svg-icons";
import { faHeart as filledHeart } from "@fortawesome/free-solid-svg-icons";

import { ref, onMounted, computed, watchEffect, watch } from "vue";

const likeButton = ref(null);

const props = defineProps({
  post: {
    type: Object,
    default: {},
  },
});

import { usePostStore } from "../../stores/post";
const postStore = usePostStore();

const isLikedByMe = computed(() => postStore.isLikedByMe[props.post.id]);

const removeBounce = () => {
  if (likeButton.value.classList.contains("mouseleft")) {
    likeButton.value.classList.remove("mouseleft");
  }
};
const addBounce = () => {
  if (!likeButton.value.classList.contains("mouseleft")) {
    likeButton.value.classList.add("mouseleft");
  }
};

onMounted(() => {
  if (!postStore.isLikedByMe[props.post.id]) {
    postStore.loadIsActedByMe({ postId: props.post.id, type: "liked" });
  }
});
</script>

<style scoped>
.liked,
.mouseleft {
  animation: bounce 0.4s cubic-bezier(0.47, 1.64, 0.41, 0.8);
  transform: translate3d(0, 0, 0);
}

@keyframes bounce {
  0%,
  100% {
    transform: scale(1);
  }

  40% {
    transform: scale(1.2);
  }

  75% {
    transform: scale(0.9);
  }
}
</style>
