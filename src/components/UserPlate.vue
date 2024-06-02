<template>
  <div
    ref="target"
    class="flex items-center gap-2 relative"
    :class="`gap-${gap}`"
    @mouseenter="isShowCard ? mouseenter() : null"
    @mouseleave="isShowCard ? mouseleave() : null"
  >
    <div class="avatar">
      <div class="rounded-full" :class="`w-${widthAvatar}`">
        <router-link
          v-if="isLink"
          :to="profilePageURL(user.username)"
          @click.stop="$emit('linkClicked')"
        >
          <img :src="user.avatar" class="cursor-pointer" />
        </router-link>

        <img v-else :src="user.avatar" />
      </div>
    </div>

    <div
      class="grow flex flex-col justify-center items-start *:whitespace-nowrap"
    >
      <router-link
        v-if="isLink"
        :to="profilePageURL(user.username)"
        @click.stop="$emit('linkClicked')"
      >
        <p
          class="font-bold text-pretty break-all cursor-pointer hover:text-zinc-400"
        >
          {{ user.displayName }}
        </p>
      </router-link>

      <p v-else class="font-bold text-pretty break-all">
        {{ user.displayName }}
      </p>
      <p v-if="isUsernameShown" class="text-slate-500">@{{ user.username }}</p>
    </div>

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
</template>

<script setup>
import { getPosition } from "../modules/position.js";

import UserCard from "./UserCard.vue";

defineProps({
  isShowCard: { type: Boolean, default: true },
  isCardFixed: { type: Boolean, default: false },
  user: { type: Object },
  isUsernameShown: { type: Boolean, default: true },
  widthAvatar: {
    type: Number,
    default: 14,
  },
  gap: { type: Number, default: 3 },
  isLink: { type: Boolean, default: true },
});

defineEmits(["linkClicked"]);

const profilePageURL = (username) => "/" + username;

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
