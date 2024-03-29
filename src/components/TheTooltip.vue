<template>
  <div
    id="tooltip"
    ref="tooltip"
    class="h-fit w-fit z-50"
    :class="[
      isFixed ? 'fixed' : 'absolute',
      bottom < heightTooltip ? 'down' : 'up',
      right < widthTooltip ? 'right-0' : 'left',
    ]"
  >
    <slot></slot>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, onBeforeMount, onBeforeUnmount } from "vue";

const props = defineProps(["bottom", "right", "dimensions", "isFixed"]);

const tooltip = ref(null);

const heightTooltip = ref(0);
const widthTooltip = ref(0);

const topDistance = computed(
  () => props.dimensions.targetFromTop + props.dimensions.targetHeight + "px"
);

const downDistance = computed(
  () => props.dimensions.viewportHeight - props.dimensions.targetFromTop + "px"
);

const leftDistance = computed(() => props.dimensions.targetFromLeft + "px");

onMounted(() => {
  heightTooltip.value = tooltip.value.offsetHeight;
  widthTooltip.value = tooltip.value.offsetWidth;
});
</script>

<style scoped>
.fixed.up {
  top: v-bind(topDistance);
}

.fixed.down {
  bottom: v-bind(downDistance);
}

.fixed.left {
  left: v-bind(leftDistance);
}

.absolute.up {
  top: 100%;
}

.absolute.down {
  bottom: 100%;
}

.absolute.left {
  left: 0;
}
</style>
