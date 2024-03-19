<template>
  <Teleport to="body">
    <Transition>
      <div
        v-if="messageStore.isShowImageViewer"
        class="bg-black/75 fixed w-dvw max-w-full h-dvh top-0 left-0 grid place-items-center z-10"
        @click.self="messageStore.closeImageViewer"
      >
        <div class="relative overflow-hidden">
          <img
            class="max-h-dvh max-w-dvw"
            alt="image sent"
            :src="messageStore.imageViewedSrc"
          />
        </div>
        <button
          class="text-center absolute left-0 top-0 m-3 bg-black/40 backdrop-blur-sm aspect-square h-9 rounded-full hover:bg-slate-600/75 transition-colors"
          @click="messageStore.closeImageViewer"
        >
          <FontAwesomeIcon
            :icon="faXmark"
            class="text-white leading-none fa-lg cursor-pointer"
          />
        </button>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

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
