<template>
  <div class="w-full h-full grid grid-rows-[1fr_56px]">
    <div class="relative overflow-hidden" id="messagesViewport">
      <div class="h-full overflow-auto">
        <div ref="messagesFlow" class="bg-zinc-200 min-h-full px-3">
          <MessageBubble
            v-for="(message, index) in list"
            :key="message.id"
            :message="message"
            :index="index"
            @last-mounted.once="scrollToBottom"
          />
          <div class="h-0" ref="bottomBeacon"></div>
        </div>
      </div>
      <ToBottomButton :isBottom="isBottom" :messagesFlow="messagesFlow" />
    </div>

    <MessageInput />
  </div>
</template>

<script setup>
import MessageBubble from "./MessageBubble.vue";
import MessageInput from "./MessageInput.vue";
import ToBottomButton from "./TobottomButton.vue";

import { ref, shallowRef, computed, onMounted, onUnmounted, watch } from "vue";

const messagesFlow = ref(null);
// const messagesViewport = document.getElementById("messagesViewport");

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

const isBottomExceptFirstTime = (() => {
  let executed = false;
  return (isFromMe) => {
    if (!executed) {
      executed = true;
      return true;
    }

    return isBottom.value || isFromMe;
  };
})();

const scrollToBottom = (isFromMe) => {
  if (!isBottomExceptFirstTime(isFromMe)) return;

  messagesFlow.value.scrollIntoView({ block: "end", behavior: "smooth" });
};

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
