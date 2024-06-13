<template>
  <div
    class="fixed bottom-0 z-[2] w-full overflow-hidden flex justify-center pointer-events-none"
  >
    <div
      class="transition-transform duration-300"
      :class="isAlertShown ? 'translate-y-0' : 'translate-y-full'"
    >
      <Transition name="slide">
        <div v-if="isAlertShown" class="mb-8">
          <div
            role="alert"
            class="rounded overflow-hidden bg-blue-400 pointer-events-auto"
          >
            <div class="p-3">
              <AlertContent />
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup>
import AlertContent from "./AlertContent.vue";

import { useAlertStore } from "../../stores/alert";
const alertStore = useAlertStore();

import { useRoute } from "vue-router";
const route = useRoute();

import { ref, computed } from "vue";

const isAlertShown = computed(() => alertStore.isAlertShown);
</script>

<style scoped>
.slide-leave-active {
  transition: opacity 0s ease 0.3s;
}
</style>
