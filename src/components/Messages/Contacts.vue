<template>
  <div class="h-full overflow-auto">
    <div class="flex flex-col">
      <div
        v-for="(contact, index) in contacts"
        class="p-4 cursor-pointer hover:bg-slate-100 transition-colors"
        @click="enterChat(contact.chatId)"
      >
        <div class="w-full flex gap-2 items-center overflow-hidden">
          <div class="avatar">
            <div class="w-12 rounded-full">
              <img :src="contact.avatar" />
            </div>
          </div>

          <div class="grow w-0 flex flex-col">
            <div class="flex">
              <div class="grow flex justify-start">
                <div class="flex gap-1">
                  <p class="font-bold">{{ contact.displayName }}</p>
                  <p class="text-neutral-500">@{{ contact.username }}</p>
                </div>
                <div class="flex *:text-neutral-500">
                  <div class="px-1"><span>·</span></div>
                  <div>
                    <time :datetime="lastMessagesTime[contact.chatId].datetime">
                      {{ lastMessagesTime[contact.chatId].ago }}
                    </time>
                  </div>
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
</template>

<script setup>
import { dateToRelative } from "../../utils/date.js";

import { ref, computed, onMounted } from "vue";

import { useMessageStore } from "../../stores/message";
const messageStore = useMessageStore();

const enterChat = (chatId) => {
  messageStore.loadLastMessages(chatId);
  messageStore.setCurrentChat(chatId);
  messageStore.enterChat(true);
};

const contacts = computed(() => messageStore.contactsList);
const areThereNews = computed(() => messageStore.areThereNews);
const lastMessagesAt = computed(() => messageStore.lastMessagesAt);

const lastMessagesTime = computed(() => {
  const times = {};

  for (const chatId in lastMessagesAt.value) {
    const dateStr = lastMessagesAt.value[chatId].at.seconds;
    times[chatId] = {
      datetime: new Date(dateStr * 1000),
      ago: dateToRelative(dateStr, "short"),
    };
  }

  return times;
});

onMounted(async () => {
  // await messageStore.loadContacts();
});
</script>

<style scoped></style>
