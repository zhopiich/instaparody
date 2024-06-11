<template>
  <TheModal :isShowCloseBtn="false" @close="$emit('close')">
    <div class="bg-white rounded-xl overflow-hidden">
      <div class="menuFrame">
        <div class="flex flex-col">
          <div class="mx-8 mt-8 mb-4 flex flex-col">
            <span class="h-[15px] text-xl leading-[25px] text-center"
              >Discard post?</span
            >
            <span
              class="pt-4 text-sm leading-[18px] text-center text-neutral-500"
              >If you leave, your edits won't be saved.</span
            >
          </div>

          <div
            class="menuList mt-4 flex flex-col hover:*:bg-neutral-100 active:*:bg-neutral-200"
          >
            <div
              class="h-12 border-t flex justify-center items-center cursor-pointer"
              @click="postStore.toggleShowPostUpload(false)"
            >
              <span class="text-sm font-bold text-red-600">Discard</span>
            </div>

            <div
              class="h-12 border-t flex justify-center items-center cursor-pointer"
              @click="$emit('close')"
            >
              <span class="text-sm">Cancel</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </TheModal>
</template>

<script setup>
import TheModal from "../TheModal.vue";

import { usePostStore } from "../../stores/post";
const postStore = usePostStore();

const emit = defineEmits(["close"]);
</script>

<style scoped>
.menuFrame {
  width: min(400px, 80dvw);
}

.menuList span {
  user-select: none;
}
</style>
