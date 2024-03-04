<template>
  <div class="z-[2] absolute">
    <button class="btn" @click="leaveChat">Back</button>
  </div>
  <div class="w-full h-full grid grid-rows-[1fr_56px]">
    <div class="bg-zinc-200 w-full px-3 overflow-auto" @click="back">
      <MessageBubble
        v-for="(message, index) in list"
        :key="message.id"
        :message="message"
        :index="index"
      />
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

const leaveChat = () => {
  messageStore.enterChat(false);
  messageStore.triggerUnSubMessages();
};

const list = computed(() => messageStore.messagesList);

onMounted(() => {
  // messageStore.messagesListener();
});

onUnmounted(() => {
  if (messageStore.isEnterChat === false) {
    messageStore.cleanChat();
    console.log("**chat clear");
  }
});
</script>

<style scoped></style>
