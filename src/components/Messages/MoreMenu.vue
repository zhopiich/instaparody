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
      <template v-for="action in menuList">
        <div
          v-if="action.isShow"
          class="px-4 py-3 hover:bg-slate-100 active:bg-neutral-200 flex items-center"
          @click="action.handler"
        >
          <div class="pr-3">
            <FontAwesomeIcon :icon="action.icon" class="text-neutral-800" />
          </div>
          <span class="leading-5 font-bold text-nowrap">{{ action.name }}</span>
        </div>
      </template>
    </div>
  </TheTooltip>
</template>

<script setup>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faReply, faCopy } from "@fortawesome/free-solid-svg-icons";
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";

import TheTooltip from "../TheTooltip.vue";

import { ref, computed, onMounted, onBeforeUnmount, watch } from "vue";

import { useMessageStore } from "../../stores/message";
const messageStore = useMessageStore();

const props = defineProps(["more", "isFromMe", "isSent"]);
const emits = defineEmits(["close", "reply", "copy", "delete"]);

const menuList = [
  {
    isShow: props.isSent,
    handler: () => emits("reply"),
    icon: faReply,
    name: "Reply",
  },
  {
    isShow: true,
    handler: () => emits("copy"),
    icon: faCopy,
    name: "Copy message",
  },
  {
    isShow: props.isFromMe,
    handler: () => emits("delete"),
    icon: faTrashCan,
    name: "Delete",
  },
];

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
