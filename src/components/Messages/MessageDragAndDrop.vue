<template>
  <div
    class="h-full w-full"
    @dragover="dragover"
    @dragleave="dragleave"
    @drop="drop"
  >
    <slot></slot>
    <div
      v-if="isDraggingOver"
      class="absolute top-0 border-2 rounded-xl border-dashed border-sky-400 pointer-events-none m-[10px]"
      id="dropzoneMarking"
    ></div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";

import { useMessageStore } from "../../stores/message";
const messageStore = useMessageStore();

const isDraggingOver = ref(false);

const dragover = (e) => {
  e.preventDefault();

  isDraggingOver.value = true;
};

const dragleave = (e) => {
  e.preventDefault();

  isDraggingOver.value = false;
};

const drop = (e) => {
  e.preventDefault();
  isDraggingOver.value = false;

  let imagesFile = [];
  imagesFile.push(...e.dataTransfer.files);

  if (imagesFile.length > 1) {
    ///
    return;
  }

  if (!imagesFile.every((file) => file.type.startsWith("image/"))) {
    ///
    return;
  }

  messageStore.setImagePreview(imagesFile[0]);
  messageStore.setImageToBeSent(imagesFile[0]);
};
</script>

<style scoped>
#dropzoneMarking {
  width: calc(100% - 20px);
  height: calc(100% - 20px);
}
</style>
