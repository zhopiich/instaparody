<template>
  <div class="flex">
    <img v-if="src" :src="src" class="avatarRounded" alt="avatar" />
    <FontAwesomeIcon
      v-else
      :icon="faCircleUser"
      class="defaultAvatar text-neutral-300 bg-white rounded-full"
    />
  </div>
</template>

<script setup>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faCircleUser } from "@fortawesome/free-solid-svg-icons";

defineProps({
  src: String,
  width: {
    type: Number,
    default: 34,
  },
});
</script>

<style scoped>
.avatarRounded {
  width: v-bind(width + "px");
  aspect-ratio: 1 / 1;
  border-radius: 50%;
  background: #eee;
  object-fit: cover;
  /* object-position: top center; */
}

.defaultAvatar {
  font-size: v-bind(width + "px");
}
</style>
