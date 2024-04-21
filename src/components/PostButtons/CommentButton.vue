<template>
  <div class="h-10 aspect-square cursor-pointer">
    <div
      class="w-full h-full flex justify-center items-center hover:text-neutral-500 active:text-neutral-400"
      @click="emits('focusInput')"
      ref="commentButton"
    >
      <FontAwesomeIcon :icon="faComment" class="fa-xl transition-transform" />
    </div>
  </div>
</template>

<script setup>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faComment } from "@fortawesome/free-regular-svg-icons";

import { ref, onMounted, computed, watchEffect, watch } from "vue";

const props = defineProps({
  post: {
    type: Object,
    default: {},
  },
});

const emits = defineEmits(["focusInput"]);

import { usePostStore } from "../../stores/post";
const postStore = usePostStore();
</script>

<style scoped></style>
