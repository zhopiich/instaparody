<template>
  <div
    class="chat pt-0 pb-6"
    :class="[isFromMe ? 'chat-end' : 'chat-start', { lastMessage: isLast }]"
  >
    <div
      class="chat-bubble leading-7 relative"
      :class="{ 'chat-bubble-warning': isFromMe }"
      :id="message.id"
    >
      {{ message.content }}
      <!-- <div
        class="absolute h-0 top-1/2 pointer-events-none"
        id="seenBeacon"
      ></div> -->
    </div>
    <div class="chat-footer opacity-50">
      <time v-if="message.at">{{ dateToRelative(message.at.seconds) }}</time>

      <div v-if="isFromMe && message.at" class="inline-block">
        {{ " · " }}
        {{ isSeen ? "Seen" : "Sent" }}
      </div>
      <div v-if="isFromMe && !message.at">Sending...</div>
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

const props = defineProps(["message", "index", "messagesViewport"]);
const messageId = props.message.id;

const emit = defineEmits(["lastMounted"]);

import { useMessageStore } from "../../stores/message";
const messageStore = useMessageStore();

const list = computed(() => messageStore.messagesList);

import { useUserStore } from "../../stores/user.js";
const userStore = useUserStore();

const me = userStore.user.uid;
const isFromMe = props.message.from === me;

const isSeen = computed(() => {
  if (!props.message.at || !messageStore.currentContact.lastSeeAt) return;

  const byWho = !isFromMe ? "me" : "other";

  return (
    messageStore.currentContact.lastSeeAt[byWho].seconds >=
    props.message.at.seconds
  );
});

import { dateToRelative } from "../../utils/date";

//
const isLast = computed(() => props.index + 1 === list.value.length);
// if (props.index + 1 === list.value.length) {
//   isLast.value = true;
// }

let observer;
const setObserver = (el) => {
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

          observer.unobserve(el);
        }, 500);
      }
    },
    {
      // root: messagesViewport,
      // threshold: 1,
    }
  );

  observer.observe(el);
};

onMounted(() => {
  if (!isFromMe) {
    // window[messageId] = document.getElementById(messageId);
    // console.log(window[messageId]);

    if (!isSeen.value) {
      // const seenBeacon = ref(null);
      // const seenBeacon = document.getElementById("seenBeacon");
      const bubble = document.getElementById(messageId);

      //
      setObserver(bubble);
    }
  }

  if (isLast.value) {
    // const lastMessage = document.querySelector(".lastMessage");
    //   scrollToBottom(lastMessage);
    // console.log(lastMessage.innerText, "mounted");
    emit("lastMounted", isFromMe);
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
