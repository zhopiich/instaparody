<template>
  <Teleport to="body">
    <div
      class="fixed top-0 left-0 w-screen max-w-full h-dvh z-[60]"
      :class="customClass.join(' ')"
      @click.self="$emit('close')"
    >
      <Transition name="fade">
        <div
          v-if="isBraced"
          class="pointer-events-none bg-black/65 absolute w-full h-full top-0 left-0"
        ></div
      ></Transition>
      <div
        v-if="isShowCloseBtn"
        class="absolute left-0 top-0 m-3 bg-black/40 backdrop-blur-sm aspect-square h-9 rounded-full hover:bg-slate-600/75 transition-colors cursor-pointer z-[61]"
        @click.stop="$emit('close')"
      >
        <div class="text-white h-full w-full flex justify-center items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>
      </div>
      <Transition name="zoom">
        <div
          v-if="isBraced"
          class="relative pointer-events-none"
          :class="{ '*:pointer-events-auto': isPointerEventsAuto }"
        >
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

const props = defineProps({
  isShowCloseBtn: {
    type: Boolean,
    default: true,
  },
  customClass: {
    type: Array,
    default: ["flex", "justify-center", "items-center"],
  },
  isPointerEventsAuto: { type: Boolean, default: true },
});

const emits = defineEmits(["close"]);

const isFirst = ref(false);

const isBraced = ref(false);

onMounted(() => {
  const body = document.body;
  if (!body.classList.contains("modalOpen")) {
    isFirst.value = true;
    body.classList.add("modalOpen");
  }

  isBraced.value = true;
});
onUnmounted(() => {
  if (isFirst.value) {
    const body = document.body;
    body.classList.remove("modalOpen");
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
</style>
