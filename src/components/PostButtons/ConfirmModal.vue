<template>
  <TheModal :isShowCloseBtn="false" @close="$emit('close')">
    <div class="bg-white rounded-xl overflow-hidden">
      <div class="menuFrame">
        <div class="flex flex-col">
          <div class="mx-8 mt-8 mb-4 flex flex-col">
            <span class="h-[15px] text-xl leading-[25px] text-center">{{
              display.header
            }}</span>
            <span
              class="pt-4 text-sm leading-[18px] text-center text-neutral-500"
              >{{ display.content }}</span
            >
          </div>

          <div
            class="menuList mt-4 flex flex-col hover:*:bg-neutral-100 active:*:bg-neutral-200"
          >
            <div
              class="h-12 border-t flex justify-center items-center cursor-pointer"
              @click="emits('confirm')"
            >
              <span class="text-sm font-bold text-red-600">{{
                display.action
              }}</span>
            </div>

            <div
              class="h-12 border-t flex justify-center items-center cursor-pointer"
              @click="emits('close')"
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

const props = defineProps(["type"]);
const emits = defineEmits(["close", "confirm"]);

import { ref, computed } from "vue";

const typeList = {
  delete: {
    header: "Delete post?",
    content: "Are you sure you want to delete this post?",
    action: "Delete",
  },
  discard: {
    header: "Discard changes?",
    content: "If you leave, your edits won't be saved.",
    action: "Discard",
  },
};

const display = computed(() => typeList[props.type]);
</script>

<style scoped>
.menuFrame {
  width: min(400px, 80dvw);
  min-width: 260px;
}

.menuList span {
  user-select: none;
}
</style>
