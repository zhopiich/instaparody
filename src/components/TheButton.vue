<template>
  <!-- <button class="button" :class="{ primary: color === 'primary', reverse }"> -->
  <button class="button" :class="color">
    <slot></slot>
  </button>
</template>

<script setup>
import { computed } from "vue";
import TheModal from "./TheModal.vue";
import TheIcon from "./TheIcon.vue";

const props = defineProps({
  color: {
    type: String,
    default: "primary",
  },
  // reverse: Boolean,
});

// const customTextColor = (defaultColor) => {
//   return props.textColor ? props.textColor : defaultColor;
// };
</script>

<style scoped>
.button {
  border-radius: 8px;
  padding: 10px 32px;
  border: none;
  color: white;
  font-size: 16px;
}

.button.primary {
  background: #1da0ff;
}

.button.reverse {
  background: none;
  border: 1px solid #e8e8e8;
  color: initial;
}

.button.immerse {
  background: rgba(0, 0, 0, 0);
  color: #1da0ff;
  padding: 10px;
}
</style>
