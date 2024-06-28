<template>
  <div class="padding-right bg-slate-200">
    <div class="px-4 flex items-center">
      <div class="mr-1">
        <div
          class="flex items-center justify-center h-9 aspect-square rounded-full cursor-pointer hover:bg-red-300/50 transition-colors"
          @click="emit('cancel')"
        >
          <FontAwesomeIcon :icon="faTrashCan" class="fa-lg text-red-500" />
        </div>
      </div>

      <div class="grow">
        <div
          class="preview-bubble overflow-hidden w-full aspect-square cursor-pointer relative"
          @click="messageStore.openImageViewer(imagePreview)"
        >
          <img
            :src="imagePreview"
            class="size-full object-cover"
            alt="image to be sent"
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
      </div>
    </div>
  </div>
</template>

<script setup>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  faTrashCan,
  faMagnifyingGlassPlus,
} from "@fortawesome/free-solid-svg-icons";

import { ref, shallowRef, computed, watch, onMounted } from "vue";

import { useMessageStore } from "../../stores/message";
const messageStore = useMessageStore();
const scrollbarWidth = computed(() => messageStore.scrollbarWidth + "px");

const props = defineProps(["imagePreview"]);
const emit = defineEmits(["cancel"]);
</script>

<style scoped>
.padding-right {
  padding-right: calc(v-bind(scrollbarWidth));
}

.preview-bubble {
  border-top-left-radius: 1.5rem;
  border-top-right-radius: 1.5rem;
  border-bottom-left-radius: 1.5rem;
  border-bottom-right-radius: 0.25rem;
}

.magnifyingGlass {
  transform: translateY(calc(100% + 12px));
}

.preview-bubble:hover .magnifyingGlass {
  transform: translateY(0);
}
</style>
