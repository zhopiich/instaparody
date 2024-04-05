<template>
  <Teleport to="body">
    <div class="modalFrame" @click.self="$emit('close')">
      <Transition name="fade">
        <div v-if="isBraced" class="backdrop pointer-events-none"></div
      ></Transition>
      <button
        v-if="isShowCloseBtn"
        class="text-center absolute left-0 top-0 m-3 bg-black/40 backdrop-blur-sm aspect-square h-9 rounded-full hover:bg-slate-600/75 transition-colors"
        @click="$emit('close')"
      >
        <FontAwesomeIcon
          :icon="faXmark"
          class="text-white leading-none fa-lg cursor-pointer"
        />
      </button>
      <Transition name="zoom">
        <div v-if="isBraced" class="modalContent">
          <slot></slot>
        </div>
      </Transition>
    </div>
  </Teleport>
</template>

<script setup>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

import { ref, onMounted, onUnmounted } from "vue";
// import TheIcon from "./TheIcon.vue";

const props = defineProps({
  stack: {
    type: Number,
    default: 1,
  },
  isShowCloseBtn: {
    type: Boolean,
    default: true,
  },
});

const emits = defineEmits(["close"]);

const isFirst = ref(false);

const isBraced = ref(false);

// div.classList.contains('secondary');

onMounted(() => {
  if (!document.body.classList.contains("modalOpen")) {
    isFirst.value = true;
    document.body.classList.add("modalOpen");
  }

  isBraced.value = true;
});
onUnmounted(() => {
  if (isFirst.value) {
    document.body.classList.remove("modalOpen");
  }
});
</script>

<style>
body.modalOpen {
  overflow: hidden;
}
</style>
<style scoped>
.zoom-enter-active {
  transition: transform 0.15s cubic-bezier(0.4, 0, 0.2, 1);
}

.zoom-enter-from {
  transform: scale(0.98);
}
.zoom-enter-to {
  transform: scale(1);
}

.fade-enter-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from {
  opacity: 0.5;
}
.fade-enter-to {
  opacity: 1;
}

/*  */
.modalFrame {
  position: fixed;
  width: 100vw;
  height: 100dvh;
  max-width: 100%;
  left: 0;
  top: 0;
  display: grid;
  place-items: center;
  z-index: 60;
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
