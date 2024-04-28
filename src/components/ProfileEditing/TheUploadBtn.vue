<template>
  <div
    class="rounded-lg overflow-hidden button"
    :class="[
      { primary: color === 'primary' },
      { reverse },
      !isLabelDisable ? 'pointer-events-none' : 'cursor-pointer',
    ]"
    @click.self="$emit('clicked')"
  >
    <label
      class="padding-label border-0 inline-block"
      :class="
        isLabelDisable
          ? 'pointer-events-none'
          : 'pointer-events-auto cursor-pointer'
      "
      :for="inputId"
    >
      <input
        type="file"
        :id="inputId"
        hidden
        @change="$emit('inputChanged', $event)"
      />

      <div class="size-full flex items-center">
        <p class="buttonText select-none"><slot></slot></p>
      </div>
    </label>
  </div>
</template>

<script setup>
const props = defineProps({
  color: {
    type: String,
    default: "primary",
  },
  px: { type: Number, default: 16 },
  py: { type: Number, default: 0 },
  height: { type: Number, default: 32 },
  reverse: Boolean,
  inputId: { type: String, default: "inputAvatar" },
  isLabelDisable: { type: Boolean, default: false },
});

const emits = defineEmits(["inputChanged", "clicked"]);
</script>

<style scoped>
.padding-label {
  padding: v-bind(py + "px" +" " + px + "px");
  height: v-bind(height + "px");
}

.buttonText {
  color: white;
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

.button.reverse {
  background: none;
  border: 1px solid #e8e8e8;
  color: initial;
}
</style>
