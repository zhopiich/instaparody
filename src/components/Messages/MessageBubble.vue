<template>
  <div
    class="chat pb-6 pt-0"
    :class="[
      message.from === me ? 'chat-end' : 'chat-start',
      { lastMessage: isLast },
    ]"
  >
    <div
      class="chat-bubble leading-7"
      :class="{ 'chat-bubble-warning': message.from === me }"
    >
      {{ message.content }}
    </div>
    <div class="chat-footer opacity-50">
      <time v-if="message.id">{{ dateToRelative(message.at?.seconds) }}</time>
      <div v-else>Sending...</div>

      <!-- <div v-if="message.from === me" class="inline-block">
            {{ " · " }}
            {{ message.isSeen ? "Seen" : "Sent" }}
          </div> -->
    </div>
  </div>
</template>

<script setup>
import { ref, shallowRef, computed, onMounted, watch, watchEffect } from "vue";

const props = defineProps(["message", "index"]);
const emit = defineEmits(["setLast"]);

import { useMessageStore } from "../../stores/message";
const messageStore = useMessageStore();

const list = computed(() => messageStore.messagesList);

import { useUserStore } from "../../stores/user.js";
const userStore = useUserStore();

const me = userStore.user.uid;

import { dateToRelative } from "../../utils/date";

const scrollToBottom = (element) => {
  element.scrollIntoView({ block: "end", behavior: "smooth" });
};

//
const isLast = computed(() => props.index + 1 === list.value.length);
// if (props.index + 1 === list.value.length) {
//   isLast.value = true;
// }

onMounted(() => {
  if (isLast.value) {
    const lastMessage = document.querySelector(".lastMessage");
    scrollToBottom(lastMessage);
  }
});
</script>

<style scoped></style>
