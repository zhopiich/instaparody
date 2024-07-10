<template>
  <div
    class="flex flex-col mt-0 px-4 *:cursor-pointer"
    :class="[
      // isFromMe ? '*:self-end' : '*:self-start',
      isFromMe ? '*:justify-end' : '*:justify-start',
      // { lastMessage: isLast },
      isChained ? 'pb-1.5' : 'pb-6',
      { 'bg-slate-100/60': isNew },
    ]"
    @mouseenter="isShowMore = true"
    @mouseleave="isShowMore = false"
    ref="messageBlock"
  >
    <div class="flex" @click="emits('focusBubble', messageId)">
      <div
        class="shrink min-w-0 flex flex-col *:max-w-full"
        :class="[
          isFromMe ? '*:self-end' : '*:self-start',
          { grow: isThereImage },
        ]"
      >
        <RepliedBubble
          v-if="message.replyTo"
          :message="message"
          :isFromMe="isFromMe"
          @mounted="onRepliedMounted"
        />

        <!-- main bubble -->
        <div
          class="chatBubble overflow-hidden shadow-x relative transition-colors"
          :class="[
            isChained ? 'chained' : isFromMe ? 'fromMe' : 'fromOther',
            isFromMe
              ? 'bg-blue-400 hover:bg-[rgb(0,_131,_235)] active:bg-sky-700'
              : 'bg-gray-200 hover:bg-neutral-300 active:bg-neutral-400',
            { 'w-full': isThereImage },
            { 'bg-[rgb(0,_131,_235)]': isFocus && isFromMe },
            { 'bg-neutral-300': isFocus && !isFromMe },
          ]"
          :id="messageId"
        >
          <!-- img -->
          <div
            v-if="isThereImage"
            class="messageImage cursor-pointer w-full aspect-square overflow-hidden relative"
            :class="
              message.content ? 'rounded-t-[inherit]' : 'rounded-[inherit]'
            "
            @click.stop="messageStore.openImageViewer(message.image)"
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
            <pre
              class="font-sans leading-6 break-words whitespace-pre-wrap"
              :class="[isFromMe ? 'text-white' : 'text-black']"
              >{{ message.content }}</pre
            >
          </div>
        </div>
      </div>

      <!-- more button -->
      <div
        class="shrink-0 self-center"
        :class="isFromMe ? 'pr-1 -order-1' : 'pl-1'"
      >
        <div class="relative" ref="more">
          <MoreButton
            @click.stop="isShowMoreMenu = true"
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
              :isSent="message.at"
              @close="isShowMoreMenu = false"
              @reply="handleReply"
              @delete="handleDelete"
              @copy="handleCopy"
            />
          </Transition>
        </div>
      </div>
    </div>

    <div
      v-if="!isChained || isFocus"
      class="chat-footer text-gray-500 mt-1.5 flex min-h-0"
      @click="emits('focusBubble', messageId)"
    >
      <span v-if="isFromMe && !message.at">Sending...</span>
      <span v-else>
        <time v-if="message.at">
          {{ time }}
        </time>
        <template v-if="isFromMe && message.at && (!isSameState || isFocus)">
          <span>{{ " · " }}</span>
          {{ isSeen ? "Seen" : "Sent" }}
        </template>
      </span>
    </div>
  </div>
</template>

<script setup>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faMagnifyingGlassPlus } from "@fortawesome/free-solid-svg-icons";

import {
  defineAsyncComponent,
  ref,
  computed,
  watch,
  onMounted,
  onBeforeUnmount,
} from "vue";

import MoreButton from "./MoreButton.vue";
import RepliedBubble from "./RepliedBubble.vue";

// const RepliedBubble = defineAsyncComponent(() => import("./RepliedBubble.vue"));
const MoreMenu = defineAsyncComponent(() => import("./MoreMenu.vue"));

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
  "me",
  "isBottom",
  "focusId",
]);

const messageId = props.message.id;

const isFocus = computed(() => props.focusId === messageId);

const emits = defineEmits(["lastMounted", "repliedMounted", "focusBubble"]);

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
  messageStore.deleteMessage({
    messageId,
    imageUrl: props.message.image,
    isLast: props.isLast,
  });
};

const handleReply = () => {
  isShowMoreMenu.value = false;

  // No reply to a message that has not been fully sent
  if (!props.message.at) return;

  messageStore.replyToMessage(
    {
      content: props.message.content || null,
      image: props.message.image || null,
    },
    props.isFromMe
  );

  messageStore.input.focus();
};

const handleCopy = () => {
  const copied = [
    props.message.at ? props.message.image : null,
    props.message.content,
  ]
    .filter((i) => i)
    .join(" ");

  navigator.clipboard.writeText(copied).then(() => {
    alertStore.addAlert({ content: "Copied to clipboard" });
    isShowMoreMenu.value = false;
  });
};

const isNextSeen = computed(() => {
  if (!props.nextMessage) return;
  if (props.nextMessage.from !== props.me) return;
  if (!props.nextMessage.at || !messageStore.currentContact.lastSeeAt.other)
    return;

  return (
    messageStore.currentContact.lastSeeAt.other.seconds >=
    props.nextMessage.at.seconds
  );
});

const isSeen = computed(() => {
  if (isNextSeen.value) return true;

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

let observer = null;
const setObserver = (el) => {
  observer = new IntersectionObserver(
    (entries) => {
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

          observer.disconnect();
          observer = null;
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

// Group together the bubbles from the same user within the same minute,
// and in the same state

const isSameMinute = computed(
  () =>
    props.nextMessage &&
    props.nextMessage.from === props.message.from &&
    props.nextMessage.at &&
    messageStore.firstNewMessageId !== props.nextMessage.id &&
    props.nextMessage.at.seconds - props.message.at.seconds < 60000 &&
    getDate(props.message.at.seconds).getMinutes() ===
      getDate(props.nextMessage.at.seconds).getMinutes()
);

const isSameState = computed(() => {
  if (!props.isFromMe || props.nextMessage?.from !== props.me) return;

  return (
    (!props.message.at && !props.nextMessage.at) ||
    isNextSeen.value ||
    (!isSeen.value && !isNextSeen.value)
  );
});

const isChained = computed(
  () =>
    isSameMinute.value &&
    ((!props.isFromMe && props.nextMessage.from !== props.me) ||
      isSameState.value)
);

const isNew = computed(() =>
  messageStore.newMessages.some((message) => message.id === messageId)
);

const onRepliedMounted = () => {};

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
  if (observer !== null) {
    observer.disconnect();
    observer = null;
  }

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

.messageImage:hover .magnifyingGlass {
  transform: translateY(0);
}
</style>
