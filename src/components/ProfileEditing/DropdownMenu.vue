<template>
  <TheTooltip :bottom="bottom" :zIndex="1" :isLeanOnRight="true"
    ><div
      class="w-[366px] py-2.5 bg-white rounded-2xl shadow-custom"
      ref="menu"
    >
      <slot></slot></div
  ></TheTooltip>
</template>

<script setup>
import TheTooltip from "../TheTooltip.vue";

const props = defineProps(["bottom", "target"]);
const emits = defineEmits(["close"]);

import { ref, computed, onMounted, onBeforeUnmount } from "vue";

const menu = ref(null);

const onClick = (event) => {
  if (!menu.value) return;

  const el = menu.value;
  if (!el.contains(event.target) && !props.target.contains(event.target)) {
    emits("close");
  }
};

onMounted(() => {
  window.addEventListener("click", onClick);
});

onBeforeUnmount(() => {
  window.removeEventListener("click", onClick);
});
</script>

<style scoped>
.shadow-custom {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
</style>
