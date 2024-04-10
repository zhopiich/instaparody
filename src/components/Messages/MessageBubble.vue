<template>
  <div
    class="flex flex-col mt-0"
    :class="[
      isFromMe ? '*:self-end' : '*:self-start',
      // { lastMessage: isLast },
      isChained ? (isFromMe ? 'pb-0' : 'pb-1.5') : 'pb-6',
    ]"
    @mouseenter="isShowMore = true"
    @mouseleave="isShowMore = false"
  >
    <div class="flex">
      <div
        class="chatBubble overflow-hidden shadow-x"
        :class="[
          isChained ? 'chained' : isFromMe ? 'fromMe  ' : 'fromOther  ',
          isFromMe ? 'bg-blue-300/90' : 'bg-gray-200',
        ]"
        :id="message.id"
      >
        <!-- img -->
        <div
          v-if="
            (!message.at && messageStore.isImageSending) ||
            (message.at && message.image)
          "
          class="cursor-pointer"
        >
          <img
            :src="message.image"
            class="h-full w-full"
            @click="messageStore.openImageViewer(message.image)"
          />
        </div>

        <!-- content -->
        <div v-if="message.content" class="py-3 px-4">
          <p class="leading-5">
            {{ message.content }}
          </p>
        </div>

        <!-- <div
        class="absolute h-0 top-1/2 pointer-events-none"
        id="seenBeacon"
      ></div> -->
      </div>

      <div class="self-center" :class="isFromMe ? 'pr-1 -order-1' : 'pl-1'">
        <div class="relative" ref="more">
          <MoreButton
            @click="isShowMoreMenu = true"
            class="transition-opacity"
            :class="[
              { 'pointer-events-none': isShowMoreMenu },
              isShowMore ? 'opacity-100' : 'opacity-0',
            ]"
          />
          <Transition name="menu">
            <MoreMenu
              v-if="isShowMoreMenu"
              :more="more"
              :isFromMe="isFromMe"
              @close="isShowMoreMenu = false"
              @delete="handleDelete"
              @copy="handleCopy"
            />
          </Transition>
        </div>
      </div>
    </div>
    <div class="chat-footer opacity-50 flex min-h-0">
      <p>
        <time v-if="message.at && !isChained">
          {{ time.hour + ":" + time.minute }}
          <span>{{ " · " }}</span>
        </time>
        <template v-if="isFromMe && message.at">
          {{ isSeen ? "Seen" : "Sent" }}
        </template>
      </p>

      <div v-if="isFromMe && !message.at">Sending...</div>
    </div>
  </div>
</template>

<script setup>
import MoreButton from "./MoreButton.vue";
import MoreMenu from "./MoreMenu.vue";

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

const more = ref(null);

const props = defineProps([
  "message",
  "isFromMe",
  "isLast",
  "messagesViewport",
  "nextMessage",
  "isBottom",
]);
const messageId = props.message.id;

const emit = defineEmits(["lastMounted"]);

import { useMessageStore } from "../../stores/message";
const messageStore = useMessageStore();

const handleDelete = () => {
  messageStore.deleteMessage(props.message.id, props.isLast);
};

const handleCopy = () => {
  const copied = [props.message.image, props.message.content]
    .filter((i) => i)
    .join(" ");

  navigator.clipboard.writeText(copied).then(() => {
    //
    console.log("Copied!");
    isShowMoreMenu.value = false;
  });
};

const isSeen = computed(() => {
  const byWho = !props.isFromMe ? "me" : "other";

  if (!props.message.at || !messageStore.currentContact.lastSeeAt[byWho])
    return;

  return (
    messageStore.currentContact.lastSeeAt[byWho].seconds >=
    props.message.at.seconds
  );
});

import { getTime } from "../../utils/date";
let time;
if (!props.message.at) {
  const unwatch = watch(
    () => props.message.at,
    (newVal) => {
      if (typeof newVal.seconds === "number" && !Number.isNaN(newVal.seconds)) {
        time = getTime(newVal.seconds);

        unwatch();
      }
    }
  );
} else {
  time = getTime(props.message.at.seconds);
}

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

const isShowMore = ref(false);
const isShowMoreMenu = ref(false);

const getDate = (dateStr) => new Date(dateStr * 1000);

// Group together the bubbles from the same user within the same minute
const isChained = ref(false);
const setIsChained = (nextMessage) => {
  if (!nextMessage) {
    isChained.value = false;
    return;
  }

  if (nextMessage.from !== props.message.from) {
    isChained.value = false;
    return;
  }

  if (nextMessage.at) {
    isChained.value =
      messageStore.firstNewMessageId !== nextMessage.id &&
      nextMessage.at.seconds - props.message.at.seconds < 60000 &&
      getDate(props.message.at.seconds).getMinutes() ===
        getDate(nextMessage.at.seconds).getMinutes();
  } else {
    isChained.value = false;
  }
};

watch(
  () => props.nextMessage,
  (newVal) => setIsChained(newVal),
  { immediate: true }
);

onMounted(() => {
  if (!props.isFromMe) {
    // window[messageId] = document.getElementById(messageId);
    // console.log(window[messageId]);

    if (!isSeen.value) {
      // const seenBeacon = ref(null);
      // const seenBeacon = document.getElementById("seenBeacon");

      if (!props.isBottom) {
        messageStore.appendNewMessage({
          id: messageId,
          at: props.message.at,
        });
      }

      const bubble = document.getElementById(messageId);
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

<style scoped>
.chatBubble {
  border-top-left-radius: 1.5rem;
  border-top-right-radius: 1.5rem;
}

.fromMe {
  border-bottom-left-radius: 1.5rem;
  border-bottom-right-radius: 0.25rem;
}

.fromOther {
  border-bottom-left-radius: 0.25rem;
  border-bottom-right-radius: 1.5rem;
}

.chained {
  border-bottom-left-radius: 1.5rem;
  border-bottom-right-radius: 1.5rem;
}

.menu-enter-active,
.menu-leave-active {
  transition: scale 0.15s ease;
}

.menu-enter-from,
.menu-leave-to {
  scale: 0;
}

.shadow-x {
  box-shadow: rgb(229, 234, 236) 0px 2px 12px;
}
</style>
