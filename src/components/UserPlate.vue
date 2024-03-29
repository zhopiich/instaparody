<template>
  <div
    ref="target"
    class="flex gap-3 relative"
    @mouseenter="mouseenter"
    @mouseleave="mouseleave"
  >
    <div class="avatar">
      <div class="rounded-full" :class="`w-${widthAvatar}`">
        <router-link :to="profilePageURL(user.username)">
          <img :src="user.avatar" class="cursor-pointer" />
        </router-link>
      </div>
    </div>
    <div class="grow flex flex-col justify-center items-start *:cursor-pointer">
      <router-link :to="profilePageURL(user.username)">
        <p class="font-bold">{{ user.displayName }}</p>
        <p v-if="isUsernameShown" class="text-slate-500">
          @{{ user.username }}
        </p>
      </router-link>
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
import UserCard from "./UserCard.vue";

defineProps({
  isCardFixed: { type: Boolean, default: false },
  user: { type: Object },
  isUsernameShown: { type: Boolean, default: true },
  widthAvatar: {
    type: Number,
    default: 14,
  },
});

const profilePageURL = (username) => {
  return "/" + username;
};

//
import { ref, computed, onMounted, watch } from "vue";

const target = ref(null);

const bottom = ref(0);
const right = ref(0);
const dimensions = ref({});

const heightTooltip = ref(0);
const widthTooltip = ref(0);

const isShowTooltip = ref(false);

const getPosition = () => {
  const viewportHeight = window.innerHeight;
  const viewportWidth = window.innerWidth;

  const targetHeight = target.value.offsetHeight;
  const targetFromTop = target.value.getBoundingClientRect().top;

  const targetFromLeft = target.value.getBoundingClientRect().left;

  bottom.value = viewportHeight - targetFromTop - targetHeight;
  right.value = viewportWidth - targetFromLeft;
  dimensions.value = {
    viewportHeight,
    viewportWidth,
    targetHeight,
    targetFromTop,
    targetFromLeft,
  };
};

let delay;

const mouseenter = () => {
  delay = setTimeout(function () {
    delay = null;
    getPosition();
    isShowTooltip.value = true;
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
