<template>
  <div
    class="h-10 aspect-square cursor-pointer"
    :class="{ 'pointer-events-none': isDisabled }"
  >
    <div
      class="w-full h-full flex justify-center items-center hover:text-neutral-500 active:text-neutral-400"
      @click="
        isToPage
          ? $router.push('/post/' + post.id + '/comments')
          : $route.name !== 'postDetails' && !postStore.isShowPostDetails
          ? postStore.showPostDetails(post.id)
          : emits('focusInput')
      "
      ref="commentButton"
    >
      <FontAwesomeIcon
        :icon="faComment"
        class="fa-xl transition-transform"
        :class="{ 'text-neutral-300': isDisabled }"
      />
    </div>
  </div>
</template>

<script setup>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faComment } from "@fortawesome/free-regular-svg-icons";

const props = defineProps({
  post: {
    // type: Object,
    default: {},
  },
  isToPage: {
    type: Boolean,
    default: false,
  },
  isDisabled: {
    type: Boolean,
    default: false,
  },
});

const emits = defineEmits(["focusInput"]);

import { usePostStore } from "../../stores/post";
const postStore = usePostStore();
</script>

<style scoped></style>
