<template>
  <div class="h-full overflow-auto">
    <div class="flex flex-col">
      <div
        v-for="(contact, index) in contacts"
        class="p-4 cursor-pointer hover:bg-slate-100 transition-colors"
        :class="{
          'border-r-2 border-yellow-300 bg-neutral-100':
            contact.chatId === route.params.chatId,
        }"
        @click="enterChat(contact.chatId)"
      >
        <div class="w-full flex gap-2 overflow-hidden">
          <div class="shrink-0 avatar">
            <div class="rounded-full h-12" @click.stop="">
              <router-link :to="'/' + contact.username">
                <img :src="contact.avatar"
              /></router-link>
            </div>
          </div>

          <div class="flex-1 min-w-0">
            <div class="flex flex-col">
              <div class="w-full flex">
                <div class="shrink min-w-0">
                  <div class="max-w-full flex gap-1">
                    <div
                      class="grow min-w-0 overflow-hidden text-clip whitespace-nowrap"
                    >
                      <span class="font-bold">{{ contact.displayName }}</span>
                    </div>

                    <div
                      class="shrink-[9] grow-0 min-w-10 overflow-hidden text-clip whitespace-nowrap"
                    >
                      <span class="text-neutral-500">
                        @{{ contact.username }}
                      </span>
                    </div>
                  </div>
                </div>

                <div
                  v-if="lastMessagesTime[contact.chatId]"
                  class="shrink-0 flex items-center *:text-neutral-500"
                >
                  <div class="px-1"><span>·</span></div>
                  <div>
                    <time
                      class="whitespace-nowrap text-[15px] leading-5"
                      :datetime="lastMessagesTime[contact.chatId].datetime"
                    >
                      {{ lastMessagesTime[contact.chatId].ago }}
                    </time>
                  </div>
                </div>
                <div
                  v-if="areThereNews[contact.chatId]"
                  class="flex items-center mr-3"
                >
                  <div
                    class="w-[10px] aspect-square bg-blue-400 rounded-full"
                  ></div>
                </div>
              </div>

              <div class="w-full">
                <p class="truncate text-base text-neutral-500">
                  {{
                    !contact.lastMessage?.content &&
                    contact.lastMessage?.isImageSent
                      ? contact.lastMessage?.from === contact.userId
                        ? `${contact.displayName} sent a picture`
                        : "You sent a picture"
                      : contact.lastMessage?.content
                      ? contact.lastMessage?.content
                      : null
                  }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { dateToRelative } from "../../utils/date.js";

import { ref, computed, onMounted } from "vue";
import {
  useRoute,
  useRouter,
  onBeforeRouteUpdate,
  onBeforeRouteLeave,
} from "vue-router";

const route = useRoute();
const router = useRouter();

import { useMessageStore } from "../../stores/message";
const messageStore = useMessageStore();

const enterChat = (chatId) => {
  if (route.name === "messages") {
    router.push("/messages/" + chatId);
    return;
  }

  messageStore.setCurrentChat(chatId);
  messageStore.loadMessages(chatId);
  messageStore.enterChat(true);
};

const contacts = computed(() => messageStore.contactsList);
const areThereNews = computed(() => messageStore.areThereNews);
const lastMessagesAt = computed(() => messageStore.lastMessagesAt);

const lastMessagesTime = computed(() => {
  const times = {};

  for (const chatId in lastMessagesAt.value) {
    const dateStr = lastMessagesAt.value[chatId].at.seconds;
    if (dateStr) {
      times[chatId] = {
        datetime: new Date(dateStr * 1000),
        ago: dateToRelative(dateStr, "short"),
      };
    }
  }

  return times;
});

onMounted(async () => {
  // await messageStore.loadContacts();
});
</script>

<style scoped></style>
