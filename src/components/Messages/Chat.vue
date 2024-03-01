<template>
  <div class="w-full h-full absolute top-0 left-0 overflow-hidden">
    <div
      class="w-[200%] h-full absolute top-0 left-0 transition-transform duration-300"
      :class="!isEnterChat ? 'translate-x-0' : '-translate-x-1/2'"
    >
      <Transition name="switch">
        <div v-if="!isEnterChat" class="w-1/2 h-full absolute left-0">
          <Contacts />
        </div>
        <div v-else class="w-1/2 h-full absolute right-0"><Messages /></div>
      </Transition>
    </div>
  </div>
</template>

<script setup>
import Contacts from "./Contacts.vue";
import Messages from "./Messages.vue";

import { useMessageStore } from "../../stores/message";
const messageStore = useMessageStore();

import { ref, shallowRef, computed, onMounted } from "vue";

const isEnterChat = computed(() => messageStore.isEnterChat);
</script>

<style scoped>
.switch-leave-active {
  /* transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1); */
  transition: opacity 0s ease 0.3s;
}

.switch-leave-to {
  /* transform: translateY(100%); */
  opacity: 0;
}
</style>
