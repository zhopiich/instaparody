<template>
  <div
    class="chat pt-0 pb-6"
    :class="[isFromMe ? 'chat-end' : 'chat-start', { lastMessage: isLast }]"
  >
    <div
      class="chat-bubble leading-7"
      :class="{ 'chat-bubble-warning': isFromMe }"
      :id="message.id"
    >
      <div
        v-if="
          (!message.at && messageStore.isImageSending) ||
          (message.at && message.image)
        "
        class="w-[280px] aspect-square flex justify-center items-center"
      >
        <img
          :src="message.image"
          class="max-h-full max-w-full"
          @click="messageStore.openImageViewer(message.image)"
        />
      </div>

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
  toRef,
} from "vue";

const props = defineProps([
  "message",
  "isFromMe",
  "isLast",
  "messagesViewport",
]);
const messageId = props.message.id;

const emit = defineEmits(["lastMounted"]);

import { useMessageStore } from "../../stores/message";
const messageStore = useMessageStore();

const isSeen = computed(() => {
  const byWho = !props.isFromMe ? "me" : "other";

  if (!props.message.at || !messageStore.currentContact.lastSeeAt[byWho])
    return;

  return (
    messageStore.currentContact.lastSeeAt[byWho].seconds >=
    props.message.at.seconds
  );
});

import { dateToRelative } from "../../utils/date";

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
  if (!props.isFromMe) {
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

  if (props.isLast) {
    // const lastMessage = document.querySelector(".lastMessage");
    //   scrollToBottom(lastMessage);
    // console.log(lastMessage.innerText, "mounted");
    emit("lastMounted", props.isFromMe);
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
