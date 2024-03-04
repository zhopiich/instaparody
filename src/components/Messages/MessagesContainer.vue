<template>
  <div
    class="z-[1] fixed bottom-0 right-0 mr-5 bg-orange-400 h-[500px] w-[450px] transition-transform duration-300"
    :class="isExtended ? 'translate-y-0' : 'translate-y-full'"
  >
    <div
      class="h-11 absolute -top-11 w-full bg-amber-800 text-4xl hover:cursor-pointer"
      @click="toggle"
    >
      {{ isExtended ? "ˇ" : "^" }}
    </div>

    <Transition name="slide">
      <template v-if="isExtended">
        <Chat />
      </template>
    </Transition>
  </div>
</template>

<script setup>
import Chat from "./Chat.vue";

import { useMessageStore } from "../../stores/message";
const messageStore = useMessageStore();

import { ref, shallowRef, onMounted } from "vue";

const isExtended = ref(false);

const toggle = () => {
  isExtended.value = !isExtended.value;
};

onMounted(() => {});
</script>

<style scoped>
/* Remove the contents after slide down */
.slide-leave-active {
  /* transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1); */
  transition: opacity 0s ease 0.3s;
}

.slide-leave-to {
  /* transform: translateY(100%); */
  opacity: 0;
}
</style>
