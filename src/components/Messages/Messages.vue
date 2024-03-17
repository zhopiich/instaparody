<template>
  <div class="w-full h-full grid grid-rows-[1fr_56px]">
    <div class="relative overflow-hidden" id="messagesViewport">
      <div class="h-full overflow-auto">
        <div ref="messagesFlow" class="relative bg-zinc-200 min-h-full px-3">
          <template v-for="(message, index) in list" :key="message.id">
            <DateTag
              v-if="message.at"
              :prevMessageAt="list[index - 1]?.at.seconds"
              :messageAt="message.at.seconds"
              :isFromMe="message.from === me"
              :isLast="index + 1 === list.length"
              @last-mounted.once="scrollDrivedByDateTag"
            />
            <MessageBubble
              :message="message"
              :isFromMe="message.from === me"
              :isLast="index + 1 === list.length"
              @last-mounted.once="scrollDrivedByMessage"
            />
          </template>

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
import DateTag from "./DateTag.vue";
import MessageInput from "./MessageInput.vue";
import ToBottomButton from "./TobottomButton.vue";

import { ref, shallowRef, computed, onMounted, onUnmounted, watch } from "vue";

const messagesFlow = ref(null);
// const messagesViewport = document.getElementById("messagesViewport");

import { useMessageStore } from "../../stores/message";
const messageStore = useMessageStore();
const list = computed(() => messageStore.messagesList);

import { useUserStore } from "../../stores/user.js";
const userStore = useUserStore();
const me = userStore.user.uid;
// const isFromMe = props.messageFrom === me;

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

const isSameAsPrevExceptFirstTime = (() => {
  let executed = false;
  return (isFromMe, isSameAsPrev) => {
    if (!executed) {
      executed = true;
      return false;
    }

    return isFromMe && !isSameAsPrev;
  };
})();

const scrollToBottom = () => {
  messagesFlow.value.scrollIntoView({
    block: "end",
    behavior: "smooth",
  });
};

const scrollDrivedByMessage = (isFromMe) => {
  // Scroll to bottom anyway when messages flow loaded
  if (isBottomExceptFirstTime(isFromMe)) {
    scrollToBottom();
  }
};

const scrollDrivedByDateTag = ([isSameAsPrev, isFromMe]) => {
  if (isSameAsPrevExceptFirstTime(isFromMe, isSameAsPrev)) {
    scrollToBottom();
  }
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
