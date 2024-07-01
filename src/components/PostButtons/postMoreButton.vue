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
    @edit="isShowPostEdit = true"
    @close="isShowMenu = false"
  />

  <PostEdit
    v-if="isShowPostEdit"
    :postId="postId"
    :desc="desc"
    :images="images"
    @close="isShowPostEdit = false"
  />
</template>

<script setup>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";

import postMoreMenu from "./postMoreMenu.vue";
import PostEdit from "./PostEdit.vue";

const props = defineProps(["postId", "desc", "images", "prevPath"]);

import { ref, computed, onMounted, toRefs, onBeforeMount } from "vue";

const isShowMenu = ref(false);
const isShowPostEdit = ref(false);
</script>

<style scoped></style>
