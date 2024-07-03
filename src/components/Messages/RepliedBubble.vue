<template>
  <div class="flex flex-col mt-3 -mb-7">
    <div
      class="pb-2 flex items-start gap-1"
      :class="[isFromMe ? 'self-end' : 'self-start']"
    >
      <FontAwesomeIcon
        :icon="faReply"
        class="text-gray-500 text-xs"
        :flip="isFromMe ? null : 'horizontal'"
      />

      <div class="flex leading-4">
        <span class="text-neutral-600 text-xs">Replying to</span>
      </div>
    </div>

    <div
      class="max-w-full rounded-3xl overflow-hidden bg-slate-100 px-4 pt-3 pb-8 mt-0.5 leading-4"
      :class="[isFromMe ? 'self-end' : 'self-start']"
    >
      <div class="w-full flex gap-2">
        <div class="shrink min-w-0" v-if="message.replyTo.content">
          <span
            class="break-words whitespace-pre-line text-neutral-700 text-sm"
            >{{ message.replyTo.content }}</span
          >
        </div>

        <div
          v-if="message.replyTo.image"
          class="repliedImage shrink-0 aspect-square overflow-hidden cursor-pointer select-none relative"
          :class="
            message.replyTo.content
              ? 'h-12 rounded-lg'
              : 'h-32 -mt-3 -mx-4 -mb-8 rounded-3xl'
          "
          @click="messageStore.openImageViewer(message.replyTo.image)"
        >
          <img
            :src="message.replyTo.image"
            class="size-full object-cover"
            alt="Replied image"
          />

          <div
            class="absolute top-0 size-full flex justify-center items-center rounded-3xl overflow-hidden"
          >
            <div
              class="magnifyingGlass h-9 aspect-square rounded-full overflow-hidden backdrop-blur transition-opacity"
            >
              <div
                class="size-full flex justify-center items-center bg-white/45 active:bg-white/65 *:active:text-neutral-500 transition-colors"
              >
                <FontAwesomeIcon
                  :icon="faMagnifyingGlassPlus"
                  class="fa-lg text-neutral-700"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  faMagnifyingGlassPlus,
  faReply,
} from "@fortawesome/free-solid-svg-icons";

const props = defineProps(["message", "isFromMe"]);

import { useMessageStore } from "../../stores/message";
const messageStore = useMessageStore();
</script>

<style scoped>
.magnifyingGlass {
  opacity: 0;
}

.repliedImage:hover .magnifyingGlass {
  opacity: 1;
}
</style>
