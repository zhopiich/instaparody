<template>
  <!-- <button class="z-[10] btn" @click="messageStore.updateLastSeeAt(message.at)">
    test
  </button> -->

  <div
    class="chat mt-6 py-0"
    :class="[
      message.from === me ? 'chat-end' : 'chat-start',
      { lastMessage: isLast },
    ]"
  >
    <div
      class="chat-bubble leading-7"
      :class="{ 'chat-bubble-warning': message.from === me }"
      :id="message.id"
    >
      {{ message.content }}
    </div>
    <div class="chat-footer opacity-50">
      <time v-if="message.at">{{ dateToRelative(message.at.seconds) }}</time>

      <div v-if="message.from === me && message.at" class="inline-block">
        {{ " · " }}
        {{ isSeen ? "Seen" : "Sent" }}
      </div>
      <div v-if="message.from === me && !message.at">Sending...</div>
    </div>
  </div>
</template>

<script setup>
import {
  ref,
  shallowRef,
  computed,
  onMounted,
  onBeforeUnmount,
  watch,
  watchEffect,
} from "vue";

const props = defineProps(["message", "index"]);
const messageId = props.message.id;

import { useMessageStore } from "../../stores/message";
const messageStore = useMessageStore();

const isSeen = computed(() => {
  if (!props.message.at) return;
  if (!messageStore.currentContact.lastSeeAt) return;

  return (
    messageStore.currentContact.lastSeeAt.seconds >= props.message.at.seconds
  );
});

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

let observer;
const setObserver = () => {
  const bubble = document.getElementById(messageId);

  observer = new IntersectionObserver(
    (entries, observer) => {
      if (entries[0].isIntersecting) {
        if (messageStore.messagesReading.length > 0) {
          const count = messageStore.messagesReading.length;
          const lastMessageId = messageStore.messagesReading[count - 1];
          messageStore.keepLastMessage(lastMessageId);
        }

        messageStore.readMessage(messageId);

        setTimeout(() => {
          messageStore.setWhenLastSee(props.message.at);

          if (!messageStore.isKept[messageId]) {
            messageStore.updateAndReset();
          }

          observer.unobserve(bubble);
        }, 500);
      }
    },
    {
      // root: ul, // 觀察窗口為 ul 的元素範圍
      // threshold: [0, 0.75],
      // threshold: [threshold],
    }
  );

  observer.observe(bubble);
};

onMounted(() => {
  if (props.message.from !== me) {
    // window[messageId] = document.getElementById(messageId);
    // console.log(window[messageId]);

    if (!isSeen.value) {
      //
      setObserver();
    }
  }

  if (isLast.value) {
    const lastMessage = document.querySelector(".lastMessage");
    scrollToBottom(lastMessage);
  }
});

onBeforeUnmount(() => {
  // if (observer) {
  //   // observer.unobserve(bubble);
  //   // console.log("obs exists");
  //   observer.disconnect();
  //   observer = null;
  // }
});
</script>

<style scoped></style>
