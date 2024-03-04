<template>
  <div class="flex">
    <input
      v-model="messageContent"
      type="text"
      placeholder="Write Message"
      class="input input-bordered w-full max-w-xs"
    />
    <button class="btn btn-success" @click="sendMessage(messageContent)">
      Send
    </button>
  </div>
</template>

<script setup>
import { ref, shallowRef, computed, onMounted, watch } from "vue";

import { useMessageStore } from "../../stores/message";
const messageStore = useMessageStore();

import { useUserStore } from "../../stores/user.js";
const userStore = useUserStore();

const messageContent = ref(null);

const sendMessage = async (content) => {
  messageContent.value = null;
  messageStore.appendLocalList(content);
  await messageStore.sendMessage(content);
};
</script>

<style scoped></style>
