<template>
  <div class="p-4 -m-4" @mouseleave="mouseleave">
    <div ref="target" :class="{ relative: !isCardFixed }">
      <div
        class="aspect-square rounded-full overflow-hidden width-avatar"
        @mouseenter="mouseenter"
      >
        <router-link :to="'/' + user.username">
          <TheAvatar :src="user?.avatar" />
        </router-link>
      </div>
      <Transition>
        <UserCard
          v-if="isShowTooltip && isShowCard"
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
import TheAvatar from "./TheAvatar.vue";

const props = defineProps({
  isShowCard: { type: Boolean, default: true },
  isCardFixed: { type: Boolean, default: false },
  user: { type: Object },
  widthAvatar: {
    type: Number,
    default: 14,
  },
});

import { ref, computed, onMounted, onBeforeUnmount } from "vue";

const widthAvatar = computed(() => props.widthAvatar * 4 + "px");

const target = ref(null);

const bottom = ref(0);
const right = ref(0);
const dimensions = ref({});

const isShowTooltip = ref(false);

let delay;

const mouseenter = () => {
  if (!props.isShowCard) return;

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
  if (!props.isShowCard) return;

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

.width-avatar {
  width: v-bind(widthAvatar);
}
</style>
