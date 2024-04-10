<template>
  <div
    class="px-4 flex hover:cursor-pointer transition-colors duration-500"
    :class="[
      {
        'sticky top-0 z-[2]   ': isEnterChat,
      },
      isExtended && isEnterChat
        ? 'bg-white/75 backdrop-blur left-for-scrollbar'
        : 'bg-white',
      {
        'bg-blue-400': !isExtended && isNotified,
      },
    ]"
    @click="messageStore.toggle"
    id="messageTab"
  >
    <div v-if="isExtended && isEnterChat">
      <div class="w-14 h-full flex justify-start items-center">
        <div
          class="flex items-center justify-center h-9 aspect-square rounded-full cursor-pointer hover:bg-neutral-300/50 transition-colors"
          @click.stop="leaveChat"
        >
          <FontAwesomeIcon :icon="faArrowLeft" class="fa-lg scale-90" />
        </div>
      </div>
    </div>

    <div v-if="!isEnterChat" class="grow flex items-center justify-start">
      <h1 class="font-bold text-xl">Messages</h1>
      <div class="ml-1.5 flex items-center pointer-events-none">
        <div
          class="w-3 aspect-square rounded-full transition-colors duration-500"
          :class="
            !isExtended && isThereAtLeastOneNew
              ? 'bg-blue-400'
              : 'bg-transparent'
          "
        ></div>
      </div>
    </div>
    <div v-else class="grow flex flex-col justify-center">
      <div class="font-bold text-[20px] leading-6">
        {{ currentContact.displayName }}
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
  messageStore.triggerUnSubMessages();
  messageStore.resetNewMessages();
};

const scrollbarWidth = computed(() => messageStore.scrollbarWidth + "px");

//
const areThereNews = computed(() => messageStore.areThereNews);
const isThereAtLeastOneNew = ref(false);

watch(
  areThereNews,
  (newVal) => {
    if (!newVal) return;

    isThereAtLeastOneNew.value = Object.values(newVal).some((bool) => bool);
  },
  {
    deep: true,
    immediate: true,
  }
);

const isNotified = ref(false);
let countdown;
watch(isThereAtLeastOneNew, (newVal) => {
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
