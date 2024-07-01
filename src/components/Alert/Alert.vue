<template>
  <div
    class="fixed bottom-0 transition-transform z-[99] w-full overflow-hidden flex justify-center pointer-events-none"
    :style="{ transform: `translateY(${-positionBottom}px)` }"
  >
    <div
      class="transition-transform duration-300"
      :class="[
        isAlertShown ? 'translate-y-0' : 'translate-y-full',
        { 'w-full': isMobile },
      ]"
    >
      <Transition name="slide">
        <div
          v-if="isAlertShown"
          class="md:mb-8"
          :class="{ 'w-full': isMobile }"
        >
          <div
            role="alert"
            class="md:rounded overflow-hidden bg-blue-400 pointer-events-auto"
            :class="{ 'w-full': isMobile }"
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

import { computed } from "vue";

import { useMediaQueryStore } from "../../stores/mediaQuery";
const mediaQueryStore = useMediaQueryStore();
const isMobile = computed(() => mediaQueryStore.isMobile);

const isAlertShown = computed(() => alertStore.isAlertShown);

const positionBottom = computed(() => {
  if (!isMobile.value) return 0;

  switch (route.name) {
    case "messages":
      return (
        49 +
        (route.params.chatId ? alertStore.variableHeight.messageInput + 1 : 0)
      );
    default:
      return 49;
  }
});
</script>

<style scoped>
.slide-leave-active {
  transition: opacity 0s ease 0.3s;
}
</style>
