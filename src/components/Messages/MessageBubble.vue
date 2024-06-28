<template>
  <div
    class="flex flex-col mt-0 px-4 *:flex"
    :class="[
      // isFromMe ? '*:self-end' : '*:self-start',
      isFromMe ? '*:justify-end' : '*:justify-start',
      // { lastMessage: isLast },
      isChained ? (isFromMe ? 'pb-0' : 'pb-1.5') : 'pb-6',
      { 'bg-slate-100': isNew },
    ]"
    @mouseenter="isShowMore = true"
    @mouseleave="isShowMore = false"
    ref="messageBlock"
  >
    <div class="flex">
      <div
        class="chatBubble overflow-hidden shadow-x"
        :class="[
          isChained ? 'chained' : isFromMe ? 'fromMe  ' : 'fromOther  ',
          isFromMe ? 'bg-blue-300/90' : 'bg-gray-200',
          { grow: isThereImage },
        ]"
        :id="messageId"
      >
        <!-- img -->
        <div
          v-if="isThereImage"
          class="image rounded-t-[inherit] cursor-pointer w-full aspect-square overflow-hidden relative"
          :id="messageId + '-image'"
          @click="messageStore.openImageViewer(message.image)"
        >
          <img
            :src="message.image"
            class="size-full object-cover"
            alt="attached image"
          />

          <div
            class="magnifyingGlass absolute right-0 bottom-0 h-10 aspect-square rounded-full overflow-hidden backdrop-blur m-3 transition-transform duration-200"
          >
            <div
              class="size-full flex justify-center items-center bg-white/25 hover:bg-white/65 *:hover:text-black active:bg-white/75 *:active:text-neutral-500 transition-colors"
            >
              <FontAwesomeIcon
                :icon="faMagnifyingGlassPlus"
                class="fa-xl text-neutral-700"
              />
            </div>
          </div>
        </div>

        <!-- content -->
        <div v-if="message.content" class="py-3 px-4">
          <pre class="font-sans message-content leading-5">{{
            message.content
          }}</pre>
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
          {{ time }}
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
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faMagnifyingGlassPlus } from "@fortawesome/free-solid-svg-icons";

import MoreButton from "./MoreButton.vue";
import MoreMenu from "./MoreMenu.vue";

import { ref, computed, watch, onMounted, onBeforeUnmount } from "vue";

const more = ref(null);
const messageBlock = ref(null);

const isShowMore = ref(false);
const isShowMoreMenu = ref(false);

const props = defineProps([
  "message",
  "isFromMe",
  "isLast",
  "messagesViewport",
  "prevMessage",
  "nextMessage",
  "isBottom",
]);
const messageId = props.message.id;

const emits = defineEmits(["lastMounted", "imageMounted"]);

import { useMessageStore } from "../../stores/message";
const messageStore = useMessageStore();

const isThereImage = computed(
  () =>
    (!props.message.at && messageStore.isImageSending) ||
    (props.message.at && props.message.image)
);

import { useAlertStore } from "../../stores/alert";
const alertStore = useAlertStore();

const handleDelete = () => {
  messageStore.deleteMessage(messageId, props.isLast);
};

const handleCopy = () => {
  const copied = [props.message.image, props.message.content]
    .filter((i) => i)
    .join(" ");

  navigator.clipboard.writeText(copied).then(() => {
    alertStore.addAlert({ content: "Copied to clipboard" });
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

const getDate = (dateStr) => new Date(dateStr * 1000);

// Group together the bubbles from the same user within the same minute

const setIsChained = (nextMessage) => {
  if (
    nextMessage &&
    nextMessage.from === props.message.from &&
    nextMessage.at
  ) {
    return (
      messageStore.firstNewMessageId !== nextMessage.id &&
      nextMessage.at.seconds - props.message.at.seconds < 60000 &&
      getDate(props.message.at.seconds).getMinutes() ===
        getDate(nextMessage.at.seconds).getMinutes()
    );
  }

  return false;
};
const isChained = computed(() => setIsChained(props.nextMessage));

const isNew = computed(() =>
  messageStore.newMessages.some((message) => message.id === messageId)
);

onMounted(() => {
  if (!props.isFromMe) {
    // window[messageId] = document.getElementById(messageId);
    // console.log(window[messageId]);

    if (!isSeen.value) {
      // const seenBeacon = ref(null);
      // const seenBeacon = document.getElementById("seenBeacon");

      if (!props.isBottom) {
        // When the previous message is not new to user
        if (
          messageStore.newMessages.length > 0 &&
          !messageStore.newMessages.some(
            (message) => message.id === props.prevMessage.id
          )
        ) {
          messageStore.resetNewMessages();
        }

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

    emits("lastMounted", props.isFromMe);
  }
});

onBeforeUnmount(() => {
  // if (observer) {
  //   // observer.unobserve(bubble);
  //   // console.log("obs exists");
  //   observer.disconnect();
  //   observer = null;
  // }

  // When the contact delete his/her message which is new to the user
  if (isNew.value && messageStore.isEnterChat) {
    messageStore.removeNewMessage(messageId);
  }
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

.menu-enter-active {
  transition: opacity 0.3s ease;
}

.menu-enter-from {
  opacity: 0;
}

.shadow-x {
  box-shadow: rgb(229, 234, 236) 0px 2px 12px;
}

.message-content {
  overflow-wrap: break-word;
  white-space: pre-wrap;
}

.magnifyingGlass {
  transform: translateY(calc(100% + 12px));
}

.image:hover .magnifyingGlass {
  transform: translateY(0);
}
</style>
