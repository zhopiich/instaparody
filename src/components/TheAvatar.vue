<template>
  <img :src="src || defaultAvatar" class="avatarRounded" />
</template>

<script setup>
import defaultAvatar from "../assets/avatarDefault.png";

defineProps({
  src: String,
  width: {
    type: Number,
    default: 34,
  },
  height: {
    type: Number,
    default: 34,
  },
});
</script>

<style scoped>
.avatarRounded {
  width: v-bind(width + "px");
  height: v-bind(height + "px");
  border-radius: 50%;
  background: #eee;
  object-fit: cover;
  object-position: top center;
}
</style>
