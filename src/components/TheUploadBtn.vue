<template>
  <label
    class="button"
    :class="{ primary: color === 'primary', reverse }"
    for="inputFile"
  >
    <input
      type="file"
      id="inputFile"
      hidden
      @change="$emit('inputChanged', $event)"
    />
    <slot></slot>
  </label>
</template>

<script setup>
defineProps({
  color: {
    type: String,
    default: "primary",
  },
  reverse: Boolean,
});

defineEmits(["inputChanged"]);
</script>

<style scoped>
.button {
  border-radius: 8px;
  padding: 10px 32px;
  border: none;
  color: white;
  font-size: 16px;
  display: inline-block;
  cursor: pointer;
}

.button.primary {
  background: #1da0ff;
}

.button.reverse {
  background: none;
  border: 1px solid #e8e8e8;
  color: initial;
}
</style>
