<template>
  <Transition name="button">
    <div
      v-if="isShow"
      class="absolute w-full bottom-0 mb-2 flex justify-center pointer-events-none *:pointer-events-auto"
    >
      <div
        class="h-9 w-fit px-5 border rounded-full flex items-center shadow-x bg-white cursor-pointer hover:bg-neutral-100 active:bg-neutral-300 active:border-neutral-300 transition-colors relative"
        @click="goToBottom"
      >
        <FontAwesomeIcon
          :icon="faArrowDown"
          class="fa-lg scale-95 text-blue-500 pointer-events-none"
        />

        <Transition name="dot">
          <div
            v-if="isThereNew"
            class="absolute top-0 right-0 h-2 aspect-square rounded-full bg-blue-400 pointer-events-none"
          ></div>
        </Transition>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faArrowDown } from "@fortawesome/free-solid-svg-icons";

import { ref, toRef, watch } from "vue";

const props = defineProps(["isBottom", "messagesFlow", "isThereNew"]);

const messagesFlow = toRef(() => props.messagesFlow);

const isShow = ref(false);

let timeoutID;

watch(
  () => !props.isBottom,
  (newVal) => {
    if (newVal) {
      timeoutID = setTimeout(() => (isShow.value = true), 450);
    } else {
      isShow.value = false;
      clearTimeout(timeoutID);
    }
  }
);

const goToBottom = () => {
  messagesFlow.value.scrollIntoView({ block: "end", behavior: "smooth" });
};
</script>

<style scoped>
.button-enter-active {
  transition: opacity 0.3s ease;
}

.button-leave-active {
  transition: opacity 0.2s ease;
}

.button-enter-from,
.button-leave-to {
  opacity: 0;
}

.button-enter-to,
.button-leave-from {
  opacity: 1;
}

.shadow-x {
  box-shadow: rgba(101, 119, 134, 0.15) 0px 0px 8px,
    rgba(101, 119, 134, 0.1) 0px 1px 3px 1px;
}

.dot-enter-active,
.dot-leave-active {
  transition: scale 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.dot-enter-from,
.dot-leave-to {
  scale: 0;
}
</style>
