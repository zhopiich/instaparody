<template>
  <div
    class="h-full w-full relative dropzone"
    @dragover="dragover"
    @dragleave="dragleave"
    @drop="drop"
    ref="dropzone"
  >
    <div
      class="size-full viewport"
      :class="{
        'pointer-events-none': isDraggingOver,
      }"
    >
      <slot></slot>
    </div>

    <template v-if="route.name !== 'messages' && isDraggingOver">
      <Teleport to="#messagesContainer">
        <div
          class="absolute top-0 border-2 rounded-lg border-dashed border-sky-400 pointer-events-none m-2 z-10"
          id="dropzoneMarking"
        ></div>
      </Teleport>
    </template>

    <template v-if="route.name === 'messages' && isDraggingOver">
      <div
        class="absolute top-0 border-2 rounded-lg border-dashed border-sky-400 pointer-events-none m-2"
        id="dropzoneMarking"
      ></div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

import { useMessageStore } from "../../stores/message";
const messageStore = useMessageStore();

const isDraggingOver = ref(false);

const dropzone = ref(null);

const dragover = (e) => {
  e.preventDefault();

  if (isDraggingOver.value) return;

  isDraggingOver.value = true;
};

const dragleave = (e) => {
  e.preventDefault();

  if (!isDraggingOver.value) return;
  if (e.target !== dropzone.value) return;

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

if (route.name !== "messages") {
  watch(isDraggingOver, (newVal) => {
    const tab = document.getElementById("messageTab");
    if (newVal) {
      tab.classList.add("draggingOver");
    } else {
      tab.classList.remove("draggingOver");
    }
  });
}
</script>

<style scoped>
#dropzoneMarking {
  width: calc(100% - 16px);
  height: calc(100% - 16px);
}

.viewport.pointer-events-none :deep(.pointer-events-none) * {
  pointer-events: none;
}
</style>

<style>
#messageTab.draggingOver {
  pointer-events: none;
}
</style>
