<template>
  <TheModal :isShowCloseBtn="false" @close="$emit('close')">
    <div class="bg-white rounded-xl overflow-hidden">
      <div class="menuFrame">
        <div class="flex flex-col">
          <div class="mt-8 mb-1 flex justify-center">
            <span class="text-xl">Change Profile Photo</span>
          </div>

          <div
            class="menuList mt-4 flex flex-col hover:*:bg-neutral-100 active:*:bg-neutral-200"
          >
            <div class="h-12 border-t flex items-stretch">
              <label
                class="grow flex justify-center items-center cursor-pointer"
                :for="inputId"
              >
                <span class="text-sm font-bold text-blue-500"
                  >Upload Photo</span
                >
              </label>
            </div>

            <div
              class="h-12 border-t flex justify-center items-center cursor-pointer"
              @click="$emit('delete')"
            >
              <span class="text-sm font-bold text-red-600"
                >Remove Current Photo</span
              >
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

const props = defineProps(["inputId"]);
const emit = defineEmits(["close", "delete"]);
</script>

<style scoped>
.menuFrame {
  width: min(400px, 80dvw);
}

.menuList span {
  user-select: none;
}
</style>
