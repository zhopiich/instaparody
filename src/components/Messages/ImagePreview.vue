<template>
  <div class="max-h-[200px] border-t">
    <div class="h-full flex justify-end bg-slate-200 relative padding-right">
      <div class="absolute top-0 left-0 mx-4 my-2">
        <div
          class="flex items-center justify-center h-9 aspect-square rounded-full cursor-pointer hover:bg-red-300/50 transition-colors"
          @click="emit('cancel')"
        >
          <FontAwesomeIcon :icon="faTrashCan" class="fa-lg text-red-500" />
        </div>
      </div>

      <div class="h-full preview-bubble overflow-hidden">
        <img
          :src="imagePreview"
          class="max-h-full aspect-square object-cover"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";

import { ref, shallowRef, computed, watch, onMounted } from "vue";

import { useMessageStore } from "../../stores/message";
const messageStore = useMessageStore();
const scrollbarWidth = computed(() => messageStore.scrollbarWidth + "px");

const props = defineProps(["imagePreview"]);
const emit = defineEmits(["cancel"]);
</script>

<style scoped>
.padding-right {
  padding-right: calc(v-bind(scrollbarWidth) + 16px);
}

.preview-bubble {
  border-top-left-radius: 1.5rem;
  border-top-right-radius: 1.5rem;
  border-bottom-left-radius: 1.5rem;
  border-bottom-right-radius: 0.25rem;
}
</style>
