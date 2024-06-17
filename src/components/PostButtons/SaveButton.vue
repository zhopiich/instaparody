<template>
  <div
    class="h-10 aspect-square cursor-pointer"
    :class="{ 'pointer-events-none': isDisabled }"
  >
    <div
      class="w-full h-full flex justify-center items-center"
      :class="{
        'hover:text-neutral-500 active:text-neutral-400': !isSavedByMe,
      }"
      @click="postStore.toggleActions({ postId: post.id, post, type: 'saved' })"
      ref="saveButton"
    >
      <FontAwesomeIcon
        :icon="isSavedByMe ? filledBookmark : emptyBookmark"
        class="fa-xl transition-transform"
        :class="[
          { 'text-neutral-300': isDisabled },
          { 'text-blue-600 active:text-blue-400 liked': isSavedByMe },
        ]"
      />
    </div>
  </div>
</template>

<script setup>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faBookmark as emptyBookmark } from "@fortawesome/free-regular-svg-icons";
import { faBookmark as filledBookmark } from "@fortawesome/free-solid-svg-icons";

import { ref, onMounted, computed, watchEffect, watch } from "vue";

const likeButton = ref(null);

const props = defineProps({
  post: {
    type: Object,
    default: {},
  },
  isDisabled: {
    type: Boolean,
    default: false,
  },
});

import { usePostStore } from "../../stores/post";
const postStore = usePostStore();

const isSavedByMe = computed(() => postStore.isSavedByMe[props.post.id]);

onMounted(() => {
  if (!postStore.isSavedByMe[props.post.id]) {
    postStore.loadIsActedByMe({ postId: props.post.id, type: "saved" });
  }
});
</script>

<style scoped></style>
