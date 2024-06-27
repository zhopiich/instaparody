<template>
  <TheTooltip
    :right="distance.right"
    :bottom="distance.bottom"
    :isFixed="false"
    :isOverlay="true"
    :zIndex="10"
  >
    <div
      class="rounded-xl bg-white shadow-x overflow-hidden flex flex-col pointer-events-auto cursor-pointer *:select-none"
      ref="menu"
      id="menu"
    >
      <div class="px-4 py-3 hover:bg-slate-100" @click="$emit('copy')">
        <p class="leading-5 font-bold text-nowrap">Copy message</p>
      </div>
      <div
        v-if="isFromMe"
        class="px-4 py-3 hover:bg-slate-100"
        @click="$emit('delete')"
      >
        <p class="leading-5 font-bold text-nowrap">Delete</p>
      </div>
    </div>
  </TheTooltip>
</template>

<script setup>
import TheTooltip from "../TheTooltip.vue";

import {
  ref,
  shallowRef,
  computed,
  onMounted,
  onBeforeUnmount,
  watch,
  watchEffect,
  toRef,
} from "vue";

import { useMessageStore } from "../../stores/message";
const messageStore = useMessageStore();

const props = defineProps(["more", "isFromMe"]);
const emits = defineEmits(["close", "copy", "delete"]);

const distance = ref({ right: 0, bottom: 0 });

const getPosition = (element) => {
  const { left, top } = element.getBoundingClientRect();
  return [left, top];
};

const getDistance = () => {
  const viewport = document.getElementById("messagesViewport");

  const [viewportFromLeft, viewportFromTop] = getPosition(viewport);
  const [buttonFromLeft, buttonFromTop] = getPosition(props.more);

  const right =
    viewport.offsetWidth -
    messageStore.scrollbarWidth -
    (buttonFromLeft - viewportFromLeft);

  const bottom =
    viewport.offsetHeight -
    (buttonFromTop - viewportFromTop) -
    props.more.offsetHeight;

  return { right, bottom };
};

const menu = ref(null);

const onClick = (event) => {
  if (!menu.value) return;

  const el = menu.value;
  if (
    !el.contains(event.target) &&
    // el !== event.target &&
    !props.more.contains(event.target)
  ) {
    emits("close");
  }
};

onMounted(() => {
  distance.value = getDistance();
  window.addEventListener("click", onClick);
});

onBeforeUnmount(() => {
  window.removeEventListener("click", onClick);
});
</script>

<style scoped>
.shadow-x {
  box-shadow: rgba(101, 119, 134, 0.2) 0px 0px 15px,
    rgba(101, 119, 134, 0.15) 0px 0px 3px 1px;
}
</style>
