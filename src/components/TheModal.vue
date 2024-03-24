<template>
  <Teleport to="body">
    <div
      class="modalFrame z-50"
      :class="{ overlay: stack !== 1 }"
      @click.self="$emit('close')"
    >
      <div class="backdrop pointer-events-none"></div>
      <button
        class="text-center absolute left-0 top-0 m-3 bg-black/40 backdrop-blur-sm aspect-square h-9 rounded-full hover:bg-slate-600/75 transition-colors"
        @click="$emit('close')"
      >
        <FontAwesomeIcon
          :icon="faXmark"
          class="text-white leading-none fa-lg cursor-pointer"
        />
      </button>
      <div class="modalContent">
        <slot></slot>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

import { onMounted, onUnmounted } from "vue";
// import TheIcon from "./TheIcon.vue";

const props = defineProps({
  stack: {
    type: Number,
    default: 1,
  },
});

defineEmits(["close"]);

onMounted(() => {
  if (props.stack === 1) {
    document.body.classList.add("modal-open");
  }
});
onUnmounted(() => {
  if (props.stack === 1) {
    document.body.classList.remove("modal-open");
  }
});
</script>

<style>
body.modal-open {
  overflow: hidden;
}
</style>
<style scoped>
.modalFrame {
  position: fixed;
  width: 100vw;
  height: 100dvh;
  max-width: 100%;
  left: 0;
  top: 0;
  display: grid;
  place-items: center;
  z-index: 10;
}

.modalFrame.overlay {
  z-index: v-bind(stack);
}

.backdrop {
  background: rgba(0, 0, 0, 0.56);
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
}

.modalContent {
  position: relative;
  background: white;
  border-radius: 10px;
  overflow: hidden;
}

.modalContent::-webkit-scrollbar {
  display: none;
}

.closeBtn {
  position: absolute;
  background: none;
  border: none;
  right: 10px;
  top: 10px;
}

.closeBtn svg {
  width: 32px;
  height: 32px;
}
</style>
