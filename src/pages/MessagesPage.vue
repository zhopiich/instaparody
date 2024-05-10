<template>
  <div class="w-full messagesHeight">
    <div class="size-full flex justify-center">
      <div v-if="!isMobile" class="border-l w-[400px] lg:w-[450px] shrink-0">
        <Contacts />
      </div>
      <div class="w-full border-x max-w-[600px] shrink">
        <Messages v-if="isBraced && route.params.chatId" />
      </div>
    </div>
  </div>
</template>

<script setup>
import Contacts from "../components/Messages/Contacts.vue";
import Messages from "../components/Messages/Messages.vue";
import Chat from "../components/Messages/Chat.vue";

import { ref, computed, watch, onMounted } from "vue";
import {
  useRoute,
  useRouter,
  onBeforeRouteUpdate,
  onBeforeRouteLeave,
} from "vue-router";

const route = useRoute();
const router = useRouter();

import { useMediaQueryStore } from "../stores/mediaQuery";
const mediaQueryStore = useMediaQueryStore();
const isMobile = computed(() => mediaQueryStore.isMobile);

import { useMessageStore } from "../stores/message";
const messageStore = useMessageStore();

const isEnterChat = computed(() => messageStore.isEnterChat);

// Hold <Messages /> until contactsList in messageStore gets results
const isBraced = computed(() => typeof messageStore.isThereNew === "boolean");

const messagesList = computed(() => messageStore.messagesList);
watch(messagesList, (newVal) => {
  if (newVal === "noSuchChat") {
    router.push("/messages");
  }
});

const areThereNews = computed(() => messageStore.areThereNews);

onBeforeRouteUpdate((to) => {
  messageStore.triggerUnSubMessages();
  messageStore.cleanChat();
  messageStore.resetNewMessages();

  if (!to.params.chatId) return;
  messageStore.setCurrentChat(to.params.chatId);
  messageStore.loadMessages(to.params.chatId);
});

onBeforeRouteLeave(() => {
  messageStore.triggerUnSubMessages();
  messageStore.cleanChat();
  messageStore.resetNewMessages();
  // messageStore.setCurrentChat(null);
});
</script>

<style scoped>
.messagesHeight {
  height: calc(100dvh - 80px);
}
</style>
