<template>
  <div class="w-full messagesHeight">
    <div class="size-full flex justify-center">
      <div v-if="!isMobile" class="border-l w-[400px] lg:w-[450px] shrink-0">
        <div class="size-full flex flex-col">
          <div class="w-full h-[53px] shrink-0">
            <div class="h-full px-4 flex">
              <div class="grow flex items-center justify-start">
                <h1 class="font-bold text-xl">Messages</h1>
              </div>

              <div class="flex items-center">
                <div
                  class="flex items-center justify-center h-9 aspect-square rounded-full cursor-pointer hover:bg-neutral-300/50 transition-colors"
                  @click.stop="messageStore.toggleSearch(true)"
                >
                  <FontAwesomeIcon
                    :icon="faCommentMedical"
                    class="fa-xl scale-90"
                  />
                </div>
              </div>
            </div>
          </div>

          <div class="grow">
            <Contacts />
          </div>
        </div>
      </div>

      <div class="w-full border-x max-w-[600px] shrink">
        <div v-if="isBraced && route.params.chatId" class="size-full relative">
          <div class="absolute top-0 w-full h-[53px] z-[1]" id="messageTab">
            <div
              class="h-full px-4 bg-white/75 backdrop-blur left-for-scrollbar flex justify-center"
            >
              <div class="flex items-center mr-2">
                <AvatarLink
                  :isShowCard="false"
                  :user="{
                    username: currentContact.username,
                    avatar: currentContact.avatar,
                  }"
                  :widthAvatar="10"
                />
              </div>

              <div class="grow flex items-center">
                <div class="font-bold text-[18px] leading-5">
                  {{ currentContact.displayName }}
                </div>
              </div>
            </div>
          </div>

          <Messages />
        </div>
      </div>
    </div>
  </div>

  <SearchPeople
    v-if="messageStore.isShowSearch"
    @close="messageStore.toggleSearch(false)"
  />
</template>

<script setup>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faCommentMedical } from "@fortawesome/free-solid-svg-icons";

import Contacts from "../components/Messages/Contacts.vue";
import Messages from "../components/Messages/Messages.vue";
import Chat from "../components/Messages/Chat.vue";
import AvatarLink from "../components/AvatarLink.vue";
import SearchPeople from "../components/Messages/SearchPeople.vue";

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

const scrollbarWidth = computed(() => messageStore.scrollbarWidth + "px");

const isEnterChat = computed(() => messageStore.isEnterChat);

const currentContact = computed(() => messageStore.currentContact);

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

.left-for-scrollbar {
  margin-right: v-bind(scrollbarWidth);
}

:deep(#messagesFlow) {
  padding-top: 53px;
}
</style>
