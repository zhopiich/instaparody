<template>
  <div
    id="tooltip"
    ref="tooltip"
    class="h-fit w-fit"
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

const props = defineProps({
  bottom: { type: Number },
  right: { type: Number },
  dimensions: { type: Object },
  isFixed: { type: Boolean, default: false },
  isOverlay: { type: Boolean, default: false },
  zIndex: { type: Number, default: 50 },
});

const tooltip = ref(null);

const heightTooltip = ref(0);
const widthTooltip = ref(0);

const topDistance = computed(() => {
  if (!props.isFixed) return;

  return props.dimensions.targetFromTop + props.dimensions.targetHeight + "px";
});

const downDistance = computed(() => {
  if (!props.isFixed) return;

  return (
    props.dimensions.viewportHeight - props.dimensions.targetFromTop + "px"
  );
});

const leftDistance = computed(() => {
  if (!props.isFixed) return;

  return props.dimensions.targetFromLeft + "px";
});

const leanOnOverlay = computed(() => (props.isOverlay ? "0" : "100%"));

onMounted(() => {
  heightTooltip.value = tooltip.value.offsetHeight;
  widthTooltip.value = tooltip.value.offsetWidth;
});
</script>

<style scoped>
#tooltip {
  z-index: v-bind("props.zIndex");
}

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
  top: v-bind(leanOnOverlay);
}

.absolute.down {
  bottom: v-bind(leanOnOverlay);
}

.absolute.left {
  left: 0;
}
</style>
