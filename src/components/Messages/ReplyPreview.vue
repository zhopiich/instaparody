<template>
  <div
    class="w-full bg-slate-100 border-l-4 border-black px-3 py-2 flex justify-between gap-1"
  >
    <div class="shrink basis-auto min-w-0 flex flex-col">
      <div class="flex">
        <span class="font-semibold text-sm">{{ messageStore.replyToWho }}</span>
      </div>

      <div
        v-if="messageStore.repliedMessage.content"
        class="flex max-h-[120px] overflow-y-auto"
      >
        <div class="max-w-full max-h-full text-sm">
          <span class="whitespace-pre-wrap break-words text-sm">{{
            messageStore.repliedMessage.content
          }}</span>
        </div>
      </div>
      <div v-else class="flex gap-1 items-center">
        <FontAwesomeIcon :icon="faImage" class="text-sm" />

        <div class="flex leading-4">
          <span class="text-neutral-800 text-sm leading-4">Image</span>
        </div>
      </div>
    </div>

    <div class="shrink-0 flex gap-1">
      <div v-if="messageStore.repliedMessage.image" class="flex items-center">
        <div class="h-9 aspect-square">
          <img
            :src="messageStore.repliedMessage.image"
            class="size-full object-cover"
            alt="Replied image"
          />
        </div>
      </div>

      <div class="flex items-center">
        <div
          class="flex items-center justify-center h-9 aspect-square rounded-full cursor-pointer hover:bg-neutral-300/75 active:bg-neutral-400/60 transition-colors"
          @click="messageStore.resetReplied"
        >
          <FontAwesomeIcon :icon="faXmark" class="fa-xl text-neutral-600" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { faImage } from "@fortawesome/free-regular-svg-icons";

import { useMessageStore } from "../../stores/message";
const messageStore = useMessageStore();
</script>

<style scoped></style>
