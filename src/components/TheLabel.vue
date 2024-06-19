<template>
  <label
    class="w-full border rounded-lg overflow-hidden flex"
    :class="{
      focus: isFocus,
      error: isError,
    }"
    @mousedown.self="labelClicked"
  >
    <div class="w-full relative bg-white">
      <div class="size-full absolute flex pointer-events-none">
        <div
          class="px-2 transition-placeholder"
          :class="{
            shrink: isFocus || isOccupied,
            focus: isFocus,
            error: isError,
          }"
        >
          <span>{{ placeholder }}</span>
        </div>
      </div>
      <div class="mt-4 pt-3 pb-2 px-2">
        <div class="h-5 text-[17px] leading-6 uponInput">
          <slot></slot>
        </div>
      </div>
    </div>
  </label>
</template>

<script setup>
const props = defineProps(["placeholder", "isFocus", "isOccupied", "isError"]);

const labelClicked = (e) => {
  if (!props.isFocus) return;

  e.preventDefault();
};
</script>

<style scoped>
* {
  --focus-color: rgb(29, 155, 240);
  --error-color: rgb(244, 33, 46);
}

.transition-placeholder {
  transition: transform 150ms cubic-bezier(0.4, 0, 0.2, 1) 0s,
    color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0s,
    font-size 150ms cubic-bezier(0.4, 0, 0.2, 1) 0s,
    padding-top 150ms cubic-bezier(0.4, 0, 0.2, 1) 0s;

  text-overflow: unset;
  padding-top: 16px;
  color: rgb(83, 100, 113);
}

.transition-placeholder.shrink {
  font-size: small;
  padding-top: 8px;
}

.transition-placeholder.focus {
  color: var(--focus-color);
}

.transition-placeholder.error {
  color: var(--error-color);
}

label.focus {
  border-color: var(--focus-color);
  box-shadow: var(--focus-color) 0 0 0 1px;
}

label.error {
  border-color: var(--error-color);
  box-shadow: none;
}
</style>
