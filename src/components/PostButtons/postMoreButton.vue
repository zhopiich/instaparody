<template>
  <div
    class="flex items-center justify-center h-9 aspect-square rounded-full cursor-pointer hover:bg-neutral-200/50 active:bg-neutral-300 *:active:text-neutral-500 transition-colors *:pointer-events-none"
    @click="isShowMenu = true"
  >
    <FontAwesomeIcon :icon="faEllipsis" class="fa-lg text-neutral-800" />
  </div>

  <postMoreMenu
    v-if="isShowMenu"
    :postId="postId"
    :images="images"
    :prevPath="prevPath"
    @close="isShowMenu = false"
  />
</template>

<script setup>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";

import postMoreMenu from "./postMoreMenu.vue";

const props = defineProps(["postId", "images", "prevPath"]);

import { ref, computed, onMounted, toRefs, onBeforeMount } from "vue";

const isShowMenu = ref(false);
</script>

<style scoped></style>
