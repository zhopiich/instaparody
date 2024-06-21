<template>
  <!-- <button class="button" :class="{ primary: color === 'primary', reverse }"> -->
  <button
    class="button"
    :class="[
      isFaded && isDisable ? 'disable fade' : color,
      { 'pointer-events-none': isDisable },
      { 'custom-width': width && typeof width === 'number' },
      { 'w-full': width === 'full' },
    ]"
  >
    <div class="size-full flex justify-center items-center">
      <span v-if="isLoading" class="loading"></span>
      <span v-else class="buttonText select-none"><slot></slot></span>
    </div>
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
  px: { type: Number, default: 16 },
  py: { type: Number, default: 0 },
  height: { type: Number, default: 32 },
  width: { default: NaN },
  isDisable: { type: Boolean, default: false },
  isFaded: { type: Boolean, default: true },
  isLoading: { type: Boolean, default: false },
});

// const customTextColor = (defaultColor) => {
//   return props.textColor ? props.textColor : defaultColor;
// };
</script>

<style scoped>
.button {
  border-radius: 8px;
  padding: v-bind(py + "px" +" " + px + "px");
  height: v-bind(height + "px");
  border: none;

  color: white;
}

.custom-width {
  width: v-bind(width + "px");
}

.buttonText {
  font-size: 14px;
  line-height: 18px;
  font-weight: 600;
}

.button.primary {
  background: #1da0ff;

  &:hover {
    background: #188de0;
  }

  &:active {
    background: #42aefb;
  }
}

.button.disable.fade {
  background: #63beff;
}

.button.reverse {
  background: none;
  border: 1px solid #e8e8e8;
  color: initial;

  &:hover {
    background-color: rgb(239 239 239);
  }
  &:active {
    background-color: rgb(229 229 229);
  }
}

.button.immerse {
  background: rgba(0, 0, 0, 0);
  color: #1da0ff;
}
</style>
