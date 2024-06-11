<template>
  <div class="w-full overflow-hidden">
    <div
      class="w-full transition-transform duration-300"
      :class="isAlertShown ? 'translate-y-0' : 'translate-y-full'"
    >
      <Transition name="slide">
        <AlertBanner v-if="isAlertShown" :message="alertMessage" />
      </Transition>
    </div>
  </div>
</template>

<script setup>
import AlertBanner from "./AlertBanner.vue";

const props = defineProps(["alertList"]);
const emits = defineEmits(["shiftList"]);

import { ref, watch, onBeforeUnmount } from "vue";

const isAlertShown = ref(false);

const alertMessage = ref("");

let durationId;

const raiseAlert = () => {
  alertMessage.value = props.alertList[0];
  isAlertShown.value = true;

  durationId = setTimeout(() => {
    isAlertShown.value = false;

    emits("shiftList");
  }, 5000);
};

let holdId;
const holdInterval = (interval) =>
  new Promise((resolve) => {
    holdId = setTimeout(() => {
      resolve();
    }, interval);
  });

watch(
  () => props.alertList.length,
  async (newVal, oldVal) => {
    if (newVal === 0) return;
    if (newVal > oldVal && oldVal > 0) return;

    if (oldVal > 0) {
      await holdInterval(300);
    }

    raiseAlert();
  }
);

onBeforeUnmount(() => {
  clearTimeout(durationId);
  clearTimeout(holdId);
});
</script>

<style scoped>
.slide-leave-active {
  transition: opacity 0s ease 0.3s;
}
</style>
