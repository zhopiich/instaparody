<template>
  <div class="flex">
    <img
      v-if="src"
      :src="src"
      class="avatarRounded"
      :class="[{ 'fixed-size': width }, { 'responsive-size': responsiveWidth }]"
      alt="avatar"
    />
    <FontAwesomeIcon
      v-else
      :icon="faCircleUser"
      class="text-neutral-300 bg-white rounded-full"
      :class="[
        { 'fixed-defaultAvatar': width },
        { 'responsive-defaultAvatar': responsiveWidth },
      ]"
    />
  </div>
</template>

<script setup>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faCircleUser } from "@fortawesome/free-solid-svg-icons";

const props = defineProps({
  src: String,
  width: {
    type: Number,
    default: NaN,
  },
  responsiveWidth: {
    type: Array,
    default: null,
  },
});

import { computed } from "vue";

const smallWidth = computed(() => {
  if (!props.responsiveWidth) return;
  return props.responsiveWidth[0];
});

const largeWidth = computed(() => {
  if (!props.responsiveWidth) return;
  return props.responsiveWidth[1];
});
</script>

<style scoped>
.avatarRounded {
  aspect-ratio: 1 / 1;
  border-radius: 50%;
  background: #eee;
  object-fit: cover;
  /* object-position: top center; */
}

.fixed-size {
  width: v-bind(width + "px");
}

.fixed-defaultAvatar {
  font-size: v-bind(width + "px");
}

.responsive-size {
  width: v-bind(smallWidth + "px");
}

.responsive-defaultAvatar {
  font-size: v-bind(smallWidth + "px");
}

@media (min-width: 768px) {
  .responsive-size {
    width: v-bind(largeWidth + "px");
  }

  .responsive-defaultAvatar {
    font-size: v-bind(largeWidth + "px");
  }
}
</style>
