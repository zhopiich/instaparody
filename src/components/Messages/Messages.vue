<template>
  <MessageDragAndDrop v-slot="slotProps">
    <div class="w-full h-full" id="chatRoom">
      <div class="grow relative overflow-hidden" id="messagesViewport">
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

            <div class="w-full h-2 absolute bottom-0" ref="bottomBeacon"></div>
          </div>
        </div>
        <ToBottomButton :isBottom="isBottom" :messagesFlow="messagesFlow" />
      </div>

      <div class="">
        <MessageInput />
      </div>
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

// const props = defineProps(["chatId"]);

import { ref, computed, onMounted, onBeforeUnmount, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

// Width of the scrollbar
const scrollStrip = ref(null);

const observerScrollbar = new ResizeObserver((entries) => {
  const element = entries[0].target;
  const scrollbarWidth = element.offsetWidth - element.clientWidth;

  messageStore.setScrollbarWidth(scrollbarWidth);
});

const messagesFlow = ref(null);

import { useMessageStore } from "../../stores/message";
const messageStore = useMessageStore();
const list = computed(() => messageStore.messagesList);

const isThereNew = computed(() => messageStore.isThereNew);

import { useUserStore } from "../../stores/user.js";
const userStore = useUserStore();
const me = userStore.user.uid;

// Observe whether messagesFlow is at bottom
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

// Determine whether messagesFlow will be scrolled.
let isBottomExceptFirstTime,
  isSameAsPrevExceptFirstTime,
  firstElement,
  firstPosition;
const setConditions = () => {
  isBottomExceptFirstTime = (() => {
    let executed = false;
    return (isFromMe, firstBool = true) => {
      if (!executed) {
        executed = true;
        return firstBool;
      }

      return isBottom.value || isFromMe;
    };
  })();

  isSameAsPrevExceptFirstTime = (() => {
    let executed = false;
    return (isFromMe, isSameAsPrev) => {
      if (!executed) {
        executed = true;
        return false;
      }

      return isFromMe && !isSameAsPrev;
    };
  })();

  firstElement = (() => {
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

  firstPosition = (() => {
    let executed = false;
    return () => {
      if (!executed) {
        executed = true;
        return isThereNew.value ? { block: "start" } : { block: "end" };
      }

      return { block: "end" };
    };
  })();
};

setConditions();

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

const scrollDrivedByDateTag = ([isSameAsPrev, isFromMe]) => {
  if (isSameAsPrevExceptFirstTime(isFromMe, isSameAsPrev)) {
    scrollToBottom();
  }
};
const scrollDrivedByMessage = (isFromMe) => {
  // Scroll to bottom anyway once messagesFlow's loaded
  if (isBottomExceptFirstTime(isFromMe)) {
    scrollToBottom(firstElement(), firstPosition());
  }
};
const scrollDrivedByIndicator = () => {
  if (isBottom.value) scrollToBottom();
};

const setBottomObserver = () => {
  const newMessages = computed(() => messageStore.newMessages);

  if (isThereNew.value && newMessages.value.length === 0) {
    // Hold the observerBottom so that isBottom.value remains false
    // until the first new message is appended to newMessages
    let unwatch = watch(
      () => newMessages.value.length,
      (newVal) => {
        if (newVal > 0) {
          observerBottom.observe(bottomBeacon.value);

          unwatch();
          unwatch = null;
        }
      }
    );
  } else {
    observerBottom.observe(bottomBeacon.value);
  }
};

// Reset observerBottom and the conditions every time the route changes
if (route.name === "messages") {
  watch(
    () => route.params.chatId,
    (newVal) => {
      observerBottom.disconnect();
      //  Remains false
      isBottom.value = false;

      setConditions();
      setBottomObserver();
    }
  );
}

onMounted(() => {
  observerScrollbar.observe(scrollStrip.value);

  setBottomObserver();
});

onBeforeUnmount(() => {
  observerScrollbar.disconnect();

  observerBottom.disconnect();

  messageStore.resetReplied();
});
</script>

<style scoped>
#chatRoom {
  display: flex;
  flex-direction: column;
}
</style>
