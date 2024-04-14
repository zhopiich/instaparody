<template>
  <Transition>
    <div
      v-if="!isBottom"
      class="absolute w-full bottom-0 mb-2 flex justify-center pointer-events-none *:pointer-events-auto"
    >
      <div
        class="h-9 w-fit px-5 border rounded-full flex items-center shadow-x bg-white cursor-pointer hover:bg-neutral-200 transition-colors"
        @click="goToBottom"
      >
        <FontAwesomeIcon
          :icon="faArrowDown"
          class="fa-lg scale-95 text-blue-500"
        />
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faArrowDown } from "@fortawesome/free-solid-svg-icons";

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

.shadow-x {
  box-shadow: rgba(101, 119, 134, 0.15) 0px 0px 8px,
    rgba(101, 119, 134, 0.1) 0px 1px 3px 1px;
}
</style>
