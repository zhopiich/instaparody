<template>
  <TheModal :isShowCloseBtn="false" @close="$emit('close')">
    <div class="bg-white rounded-xl overflow-hidden">
      <div class="menuFrame">
        <div class="flex flex-col">
          <div class="mx-8 mt-8 mb-4 flex flex-col">
            <span class="h-[15px] text-xl leading-[25px] text-center"
              ><slot name="header"></slot
            ></span>
            <span
              class="pt-4 text-sm leading-[18px] text-center text-neutral-500"
              ><slot name="content"></slot
            ></span>
          </div>

          <div
            class="menuList mt-4 flex flex-col hover:*:bg-neutral-100 active:*:bg-neutral-200"
          >
            <div
              class="h-12 border-t flex justify-center items-center cursor-pointer"
              @click="emits('action')"
            >
              <span class="text-sm font-bold text-red-600"
                ><slot name="action"></slot
              ></span>
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
import TheModal from "./TheModal.vue";

const props = defineProps(["type"]);
const emits = defineEmits(["action", "close"]);

import { ref, computed } from "vue";
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
