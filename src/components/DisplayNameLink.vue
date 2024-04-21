<template>
  <div class="p-2 -m-2" @mouseleave="mouseleave">
    <div ref="target" @mouseenter="mouseenter">
      <router-link :to="'/' + user.username">
        <p class="font-bold cursor-pointer select-none hover:text-zinc-400">
          {{ user.displayName }}
        </p>
      </router-link>

      <Transition>
        <UserCard
          v-if="isShowTooltip"
          :isFixed="isCardFixed"
          :bottom="bottom"
          :right="right"
          :dimensions="dimensions"
          :user="user"
        />
      </Transition>
    </div>
  </div>
</template>

<script setup>
import { getPosition } from "../modules/position.js";

import UserCard from "./UserCard.vue";

defineProps({
  isCardFixed: { type: Boolean, default: false },
  user: { type: Object },
});

import { ref, computed, onMounted, onBeforeUnmount } from "vue";

const target = ref(null);

const bottom = ref(0);
const right = ref(0);
const dimensions = ref({});

const isShowTooltip = ref(false);

let delay;

const mouseenter = () => {
  delay = setTimeout(function () {
    const position = getPosition(target.value);
    bottom.value = position.bottom;
    right.value = position.right;
    dimensions.value = position.dimensions;

    isShowTooltip.value = true;
    delay = null;
  }, 350);
};
const mouseleave = () => {
  if (delay) {
    clearTimeout(delay);
    delay = null;
  }

  if (isShowTooltip.value) {
    isShowTooltip.value = false;
  }
};

onBeforeUnmount(() => {
  if (delay) {
    clearTimeout(delay);
    delay = null;
  }
});
</script>

<style scoped>
.v-enter-active {
  transition: opacity 0.4s ease;
}
.v-leave-active {
  transition: opacity 0.2s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
