<template>
  <MessageDragAndDrop v-slot="slotProps">
    <div class="w-full h-full grid" id="chatRoom">
      <div class="relative overflow-hidden" id="messagesViewport">
        <div class="h-full overflow-auto" ref="scrollStrip">
          <div ref="messagesFlow" class="relative min-h-full" id="messagesFlow">
            <template v-for="(message, index) in list" :key="message.id">
              <DateTag
                v-if="message.at"
                :prevMessageAt="list[index - 1]?.at.seconds"
                :messageAt="message.at.seconds"
                :isFromMe="message.from === me"
                :isLast="index + 1 === list.length"
                @last-mounted.once="scrollDrivedByDateTag"
              />
              <NewMessageIndicator
                v-if="messageStore.firstNewMessageId === message.id"
                :isMoreThanOne="messageStore.newMessages.length > 1"
                @mounted.once="scrollDrivedByIndicator"
                id="newMessageIndicator"
              />
              <MessageBubble
                :message="message"
                :isFromMe="message.from === me"
                :isLast="index + 1 === list.length"
                :prevMessage="index > 0 ? list[index - 1] : null"
                :nextMessage="index + 1 < list.length ? list[index + 1] : null"
                :isBottom="isBottom"
                @last-mounted.once="scrollDrivedByMessage"
              />
            </template>

            <div class="h-2 absolute bottom-0" ref="bottomBeacon"></div>
          </div>
        </div>
        <ToBottomButton :isBottom="isBottom" :messagesFlow="messagesFlow" />
      </div>

      <MessageInput />
      <ImageViewer v-if="messageStore.isShowImageViewer" />
    </div>
  </MessageDragAndDrop>
</template>

<script setup>
import MessageBubble from "./MessageBubble.vue";
import DateTag from "./DateTag.vue";
import NewMessageIndicator from "./NewMessageIndicator.vue";
import MessageInput from "./MessageInput.vue";
import ToBottomButton from "./TobottomButton.vue";
import ImageViewer from "./ImageViewer.vue";
import MessageDragAndDrop from "./MessageDragAndDrop.vue";

import { ref, shallowRef, computed, onMounted, onUnmounted, watch } from "vue";

const messagesFlow = ref(null);

import { useMessageStore } from "../../stores/message";
const messageStore = useMessageStore();
const list = computed(() => messageStore.messagesList);

const isThereNew = computed(
  () => messageStore.areThereNews[messageStore.currentContact.chatId]
);

import { useUserStore } from "../../stores/user.js";
const userStore = useUserStore();
const me = userStore.user.uid;

// Observe if it at bottom

const bottomBeacon = ref(null);
const isBottom = ref(false);

const observerBottom = new IntersectionObserver(
  ([{ isIntersecting }]) => {
    isBottom.value = isIntersecting;
  },
  {
    threshold: 0,
  }
);

// Scrolling to bottom

const scrollToBottom = (
  _el = null,
  { block = "end", behavior = "smooth" } = {}
) => {
  let el = _el;
  if (!el) el = messagesFlow.value;

  el.scrollIntoView({
    block,
    behavior,
  });
};

const isBottomExceptFirstTime = (() => {
  let executed = false;
  return (isFromMe, firstBool = true) => {
    if (!executed) {
      executed = true;
      return firstBool;
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

const scrollDrivedByDateTag = ([isSameAsPrev, isFromMe]) => {
  if (isSameAsPrevExceptFirstTime(isFromMe, isSameAsPrev)) {
    scrollToBottom();
  }
};

const scrollDrivedByMessage = (isFromMe) => {
  // Scroll to bottom anyway when messages flow loaded
  if (isBottomExceptFirstTime(isFromMe)) {
    const firstElement = (() => {
      let executed = false;
      return () => {
        if (!executed) {
          executed = true;
          return isThereNew.value
            ? document.getElementById(messageStore.firstNewMessageId)
            : null;
        }

        return null;
      };
    })();

    const firstPosition = (() => {
      let executed = false;
      return () => {
        if (!executed) {
          executed = true;
          return isThereNew.value ? { block: "start" } : { block: "end" };
        }

        return { block: "end" };
      };
    })();

    scrollToBottom(firstElement(), firstPosition());
  }
};

const scrollDrivedByIndicator = () => {
  if (isBottom.value) scrollToBottom();
};

// Width of the scrollbar

const scrollStrip = ref(null);

const observerScrollbar = new ResizeObserver((entries) => {
  const element = entries[0].target;
  const scrollbarWidth = element.offsetWidth - element.clientWidth;

  messageStore.setScrollbarWidth(scrollbarWidth);
});

onMounted(() => {
  observerScrollbar.observe(scrollStrip.value);

  if (isThereNew.value) {
    // Hold the isBottom observer until the first new message is appended to newMessages
    // so that there always be a new message indicator line if new messages are sent when
    // the user doesn't enter chat
    const newMessages = computed(() => messageStore.newMessages);
    let unwatch = watch(
      newMessages,
      (newVal) => {
        if (newVal.length > 0) {
          observerBottom.observe(bottomBeacon.value);

          unwatch();
          unwatch = null;
        }
      },
      { deep: true }
    );
  } else {
    observerBottom.observe(bottomBeacon.value);
  }
});

onUnmounted(() => {
  observerBottom.disconnect();
  observerScrollbar.disconnect();

  if (messageStore.isEnterChat === false) {
    messageStore.triggerUnSubMessages();
    messageStore.cleanChat();
  }
});
</script>

<style scoped>
#chatRoom {
  grid-template-rows: 1fr max-content;
}
</style>
