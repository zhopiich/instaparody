<template>
  <Transition>
    <div
      v-if="!isBottom"
      class="absolute w-full bottom-0 mb-2 flex justify-center"
    >
      <button class="" @click="goToBottom">
        <FontAwesomeIcon :icon="faCircleArrowDown" class="fa-xl" />
      </button>
    </div>
  </Transition>
</template>

<script setup>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faCircleArrowDown } from "@fortawesome/free-solid-svg-icons";

import { ref, toRef } from "vue";

const props = defineProps(["isBottom", "messagesFlow"]);

const messagesFlow = toRef(() => props.messagesFlow);

const goToBottom = () => {
  messagesFlow.value.scrollIntoView({ block: "end", behavior: "smooth" });
};
</script>

<style scoped>
.v-enter-active {
  transition: opacity 0.3s ease;
}

.v-leave-active {
  transition: opacity 0.2s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

.v-enter-to,
.v-leave-from {
  opacity: 1;
}
</style>
