<template>
  <div class="w-full h-full grid grid-rows-[1fr_56px]">
    <div class="bg-zinc-200 w-full px-3 pt-3 pb-2 overflow-auto" @click="back">
      <div
        v-for="message in list"
        class="chat"
        :class="message.from === me ? 'chat-end' : 'chat-start'"
      >
        <div
          class="chat-bubble"
          :class="{ 'chat-bubble-warning': message.from === me }"
        >
          {{ message.content }}
        </div>
        <div class="chat-footer opacity-50">
          <time>{{ message.at }}</time>

          <div v-if="message.from === me" class="inline-block">
            {{ " · " }}
            {{ message.isSeen ? "Seen" : "Sent" }}
          </div>
        </div>
      </div>
    </div>
    <div class="flex">
      <input
        v-model="messageContent"
        type="text"
        placeholder="Write Message"
        class="input input-bordered w-full max-w-xs"
      />
      <button class="btn btn-success" @click="sendMessage">Send Message</button>
    </div>
  </div>
</template>

<script setup>
import { ref, shallowRef, onMounted } from "vue";

import { useMessageStore } from "../../stores/message";
const messageStore = useMessageStore();

const back = () => {
  messageStore.enterChat(false);
};

const list = ref([]);

const messageContent = ref(null);

const sendMessage = async () => {
  await messageStore.sendMessage(messageContent.value);
  messageContent.value = null;
};

onMounted(() => {
  messageStore.messagesListener();
});
</script>

<style scoped></style>
