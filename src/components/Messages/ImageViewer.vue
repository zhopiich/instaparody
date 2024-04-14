<template>
  <TheModal @close="messageStore.closeImageViewer">
    <div class="h-fit w-fit">
      <img
        class="max-h-dvh max-w-dvw"
        alt="image sent"
        :src="messageStore.imageViewedSrc"
      /></div
  ></TheModal>
</template>

<script setup>
import TheModal from "../TheModal.vue";

import { useMessageStore } from "../../stores/message";
const messageStore = useMessageStore();
</script>

<style scoped>
.v-enter-active {
  transition: opacity 0.3s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
