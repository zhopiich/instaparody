<template>
  <div
    class="px-4 flex hover:cursor-pointer transition-colors duration-500"
    :class="[
      {
        'sticky top-0 z-[2]': isEnterChat,
      },
      isExtended && isEnterChat
        ? 'bg-white/75 backdrop-blur left-for-scrollbar'
        : !isExtended && isNotified
        ? 'bg-blue-400'
        : 'bg-white',
    ]"
    @click="messageStore.toggle"
    id="messageTab"
  >
    <div v-if="isExtended && isEnterChat">
      <div class="w-14 h-full flex justify-start items-center">
        <div class="h-9 aspect-square relative">
          <div
            class="w-full h-full flex items-center justify-center rounded-full cursor-pointer hover:bg-neutral-300/50 transition-colors"
            @click.stop="leaveChat"
          >
            <FontAwesomeIcon :icon="faArrowLeft" class="fa-lg scale-90" />
          </div>
          <div
            v-if="isThereNewFromOther"
            class="absolute top-1 right-1 h-[9px] aspect-square bg-blue-400 rounded-full border border-white pointer-events-none"
          ></div>
        </div>
      </div>
    </div>

    <div v-if="!isEnterChat" class="grow flex items-center justify-start">
      <h1 class="font-bold text-xl">Messages</h1>
      <div class="ml-1.5 flex items-center pointer-events-none">
        <div
          class="w-3 aspect-square rounded-full transition-colors duration-500"
          :class="
            !isExtended && isThereAnyNew ? 'bg-blue-400' : 'bg-transparent'
          "
        ></div>
      </div>
    </div>
    <div v-else class="grow flex flex-col justify-center">
      <div class="flex">
        <div class="font-bold text-[20px] leading-6">
          {{ currentContact.displayName }}
        </div>
        <div class="ml-1.5 flex items-center pointer-events-none">
          <div
            class="w-3 aspect-square rounded-full transition-colors duration-500"
            :class="
              !isExtended && isThereNewCurrent
                ? 'bg-blue-400'
                : 'bg-transparent'
            "
          ></div>
        </div>
      </div>
      <div class="text-[13px] leading-4">@{{ currentContact.username }}</div>
    </div>

    <div v-if="!isEnterChat" class="flex items-center">
      <div
        class="flex items-center justify-center h-9 aspect-square rounded-full cursor-pointer hover:bg-neutral-300/50 transition-colors"
        @click.stop="messageStore.toggleSearch(true)"
      >
        <FontAwesomeIcon :icon="faCommentMedical" class="fa-xl scale-90" />
      </div>
    </div>

    <div class="flex items-center">
      <div
        class="flex items-center justify-center h-9 aspect-square rounded-full cursor-pointer hover:bg-neutral-300/50 transition-colors"
      >
        <FontAwesomeIcon
          :icon="isExtended ? faAnglesDown : faAnglesUp"
          class="fa-xl scale-75"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  faCommentMedical,
  faAnglesDown,
  faAnglesUp,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";

import { ref, shallowRef, computed, watch, onMounted } from "vue";

const props = defineProps(["isEnterChat", "isExtended", "heightTab"]);

import { useMessageStore } from "../../stores/message";
const messageStore = useMessageStore();

const currentContact = computed(() => messageStore.currentContact);

const leaveChat = () => {
  messageStore.enterChat(false);
  messageStore.resetNewMessages();

  //
  messageStore.triggerUnSubMessages();
  messageStore.cleanChat();
  messageStore.setCurrentChat(null);
};

const scrollbarWidth = computed(() => messageStore.scrollbarWidth + "px");

//
const areThereNews = computed(() => messageStore.areThereNews);
const isThereAnyNew = computed(() => {
  // if (!areThereNews.value) return false;

  return Object.values(areThereNews.value).some((bool) => bool);
});
const isThereNewFromOther = computed(
  () => isThereAnyNew.value && !areThereNews.value[currentContact.value.chatId]
);
const isThereNewCurrent = computed(
  () => areThereNews.value[currentContact.value.chatId]
);

const isNotified = ref(false);
let countdown;
watch(isThereAnyNew, (newVal) => {
  if (props.isExtended) return;

  if (newVal) {
    isNotified.value = true;
    countdown = setTimeout(() => {
      isNotified.value = false;
      countdown = null;
    }, 5000);
  }
});
watch(
  () => props.isExtended,
  (newVal) => {
    if (newVal && countdown) {
      clearTimeout(countdown);
      isNotified.value = false;
      countdown = null;
    }
  }
);
</script>

<style scoped>
#messageTab {
  height: v-bind("props.heightTab");
}

.left-for-scrollbar {
  margin-right: v-bind(scrollbarWidth);
}
</style>
