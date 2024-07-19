<template>
  <ConfirmModal
    @close="emits('close')"
    @action="postStore.toggleShowPostUpload(false)"
  >
    <template #header>Discard post?</template>
    <template #content>If you leave, your edits won't be saved.</template>
    <template #action>Discard</template>
  </ConfirmModal>
</template>

<script setup>
import ConfirmModal from "../ConfirmModal.vue";

import { usePostStore } from "../../stores/post";
const postStore = usePostStore();

const emits = defineEmits(["close"]);
</script>

<style scoped></style>
