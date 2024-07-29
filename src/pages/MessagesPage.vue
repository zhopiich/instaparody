<template>
  <div class="w-full messagesHeight" :class="{ mobile: isMobile }">
    <div class="size-full" :class="{ 'flex justify-center': isMobile }">
      <div
        class="size-full"
        :class="isMobile ? 'overflow-hidden relative' : 'block'"
      >
        <div
          :class="[
            isMobile
              ? route.params.chatId
                ? '-translate-x-1/2'
                : 'translate-x-0'
              : null,
            isMobile
              ? 'w-[200%] h-full absolute flex transition-transform duration-300'
              : 'size-full flex justify-center',
          ]"
        >
          <div
            :class="
              isMobile
                ? 'w-1/2 h-full'
                : 'border-l w-[400px] lg:w-[450px] shrink-0'
            "
          >
            <div class="size-full flex flex-col">
              <div class="w-full h-[53px] shrink-0">
                <div class="h-full px-4 flex">
                  <div class="grow flex items-center justify-start">
                    <h1 class="font-bold text-xl">Messages</h1>
                  </div>

                  <div class="flex items-center">
                    <div
                      class="flex items-center justify-center h-9 aspect-square rounded-full cursor-pointer hover:bg-neutral-300/50 transition-colors"
                      :class="{ 'pointer-events-none': !userStore.isLoggedIn }"
                      @click.stop="messageStore.toggleSearch(true)"
                    >
                      <FontAwesomeIcon
                        :icon="faCommentMedical"
                        class="fa-xl scale-90"
                        :class="{ 'text-neutral-300': !userStore.isLoggedIn }"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div v-if="userStore.isLoggedIn" class="grow overflow-hidden">
                <Contacts />
              </div>

              <div v-else class="grow w-full">
                <div class="size-full px-4 flex items-center">
                  <div class="w-full text-center">
                    <span
                      class="text-xl md:text-base break-words whitespace-pre-line"
                    >
                      Please
                      <router-link
                        to="/login"
                        class="underline text-neutral-600 hover:text-neutral-400 active:text-neutral-700"
                        >log in</router-link
                      >
                      to send messages
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            :class="
              isMobile
                ? 'w-1/2 h-full'
                : 'w-full border-x max-w-[600px] shrink min-w-0'
            "
          >
            <div
              v-if="userStore.isLoggedIn && isBraced && route.params.chatId"
              class="size-full relative"
            >
              <div class="absolute top-0 w-full h-[53px] z-[1]" id="messageTab">
                <div
                  class="h-full px-4 bg-white/75 backdrop-blur left-for-scrollbar flex justify-center"
                >
                  <div
                    v-if="isMobile"
                    class="w-14 h-full flex justify-start items-center"
                  >
                    <div class="h-9 aspect-square relative">
                      <div
                        class="w-full h-full flex items-center justify-center rounded-full cursor-pointer hover:bg-neutral-300/50 transition-colors"
                        @click.stop="router.push('/messages')"
                      >
                        <FontAwesomeIcon
                          :icon="faArrowLeft"
                          class="fa-lg scale-90"
                        />
                      </div>

                      <Transition>
                        <div
                          v-if="isThereNewFromOther"
                          class="absolute top-1 right-1 h-[9px] aspect-square bg-blue-400 rounded-full border border-white pointer-events-none"
                        ></div>
                      </Transition>
                    </div>
                  </div>

                  <div class="flex items-center mr-2">
                    <AvatarLink
                      :isShowCard="false"
                      :user="{
                        userId: currentContact.userId,
                        username: currentContact.username,
                        // avatar: currentContact.avatar,
                      }"
                      :widthAvatar="12"
                    />
                  </div>

                  <div class="grow flex items-center">
                    <div class="font-bold text-[18px] leading-5">
                      {{ currentContactInfo?.displayName }}
                    </div>
                  </div>
                </div>
              </div>

              <Messages />
            </div>
          </div>
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
import {
  faCommentMedical,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";

import Contacts from "../components/Messages/Contacts.vue";
import Messages from "../components/Messages/Messages.vue";
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

import { useUserStore } from "../stores/user";
const userStore = useUserStore();

import { useMessageStore } from "../stores/message";
const messageStore = useMessageStore();

const scrollbarWidth = computed(() => messageStore.scrollbarWidth + "px");

const isEnterChat = computed(() => messageStore.isEnterChat);

const currentContact = computed(() => messageStore.currentContact);
const currentContactInfo = computed(
  () => userStore.userInfoList[currentContact.value.userId]
);

// Hold <Messages /> until contactsList in messageStore gets results
const isBraced = computed(() => typeof messageStore.isThereNew === "boolean");

const messagesList = computed(() => messageStore.messagesList);
watch(
  messagesList,
  (newVal) => {
    if (newVal === "chatNotAvailable") {
      router.push("/messages");
    }
  },
  { immediate: true }
);

const areThereNews = computed(() => messageStore.areThereNews);
const isThereAnyNew = computed(() => {
  if (!areThereNews.value) return false;

  return Object.values(areThereNews.value).some((bool) => bool);
});
const isThereNewFromOther = computed(
  () => isThereAnyNew.value && !areThereNews.value[currentContact.value.chatId]
);

watch(
  () => currentContact.value,
  (newVal) => {
    if (newVal) {
      document.title =
        (currentContactInfo.value?.displayName &&
        currentContactInfo.value.displayName !== newVal.username
          ? currentContactInfo.value.displayName + " "
          : "") +
        "@" +
        newVal.username +
        " • " +
        "Instaparody";
    }
  },
  { immediate: true }
);

onBeforeRouteUpdate((to) => {
  messageStore.resetReplied();
  messageStore.triggerUnSubMessages();
  messageStore.cleanChat();
  messageStore.resetNewMessages();

  if (!to.params.chatId) {
    messageStore.setCurrentChat(null);
    return;
  }

  messageStore.setCurrentChat(to.params.chatId);
  messageStore.loadMessages(to.params.chatId);
});

onBeforeRouteLeave(() => {
  // messageStore.resetReplied();
  messageStore.triggerUnSubMessages();
  messageStore.cleanChat();
  messageStore.resetNewMessages();
  messageStore.setCurrentChat(null);
});
</script>

<style scoped>
.messagesHeight {
  height: calc(100dvh - 80px);
}

.messagesHeight.mobile {
  height: calc(100dvh - 49px);
}

.left-for-scrollbar {
  margin-right: v-bind(scrollbarWidth);
}

:deep(#messagesFlow) {
  padding-top: 53px;
}

.v-enter-active,
.v-leave-active {
  transition: scale 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.v-enter-from,
.v-leave-to {
  scale: 0;
}
</style>
