<template>
  <div class="w-full h-full grid grid-rows-[1fr_56px]">
    <div class="bg-zinc-200 w-full px-3 overflow-auto" @click="back">
      <MessageBubble
        v-for="(message, index) in list"
        :key="message.id"
        :message="message"
        :index="index"
      />
      <div class="h-0" ref="bottomBeacon"></div>

      <!--  -->
      <div class="absolute bottom-[50%] right-[50%]">
        {{ isBottom }}
      </div>
    </div>

    <MessageInput />
  </div>
</template>

<script setup>
import MessageBubble from "./MessageBubble.vue";
import MessageInput from "./MessageInput.vue";

import { ref, shallowRef, computed, onMounted, onUnmounted, watch } from "vue";

import { useMessageStore } from "../../stores/message";
const messageStore = useMessageStore();

import { useUserStore } from "../../stores/user.js";
const userStore = useUserStore();

const list = computed(() => messageStore.messagesList);

const bottomBeacon = ref(null);
const isBottom = ref(null);

const observerBottom = new IntersectionObserver(
  ([{ isIntersecting }]) => {
    isBottom.value = isIntersecting;
  },
  {
    threshold: 1,
  }
);

onMounted(() => {
  observerBottom.observe(bottomBeacon.value);
});

onUnmounted(() => {
  if (messageStore.isEnterChat === false) {
    messageStore.cleanChat();
  }
});
</script>

<style scoped></style>
