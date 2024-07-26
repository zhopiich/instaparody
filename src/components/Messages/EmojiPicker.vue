<template>
  <div class="picker flex" ref="picker">
    <div
      v-if="!index"
      class="w-[353px] h-[420px] border rounded-lg bg-white"
    ></div>

    <Picker
      v-else
      class="!rounded-lg"
      :data="index"
      set="twitter"
      title=""
      emoji="thumbsup"
      @select="sendEmoji"
    />
  </div>
</template>

<script setup>
import "emoji-mart-vue-fast/css/emoji-mart.css";

import { Picker } from "emoji-mart-vue-fast/src";

import { ref, computed, onMounted, onBeforeUnmount } from "vue";

import { useMessageStore } from "../../stores/message";
const messageStore = useMessageStore();

const index = computed(() => messageStore.emojiIndex);

if (!index.value) {
  messageStore.importEmojiData();
}

const props = defineProps(["emojiButton"]);
const emits = defineEmits(["select", "close"]);

const sendEmoji = (emoji) => {
  emits("select", emoji.native);
};

const picker = ref(null);

const onClick = (event) => {
  if (!picker.value) return;

  const el = picker.value;
  if (!el.contains(event.target) && !props.emojiButton.contains(event.target)) {
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
.picker {
  transform: translateY(6px);

  & > * {
    box-shadow: rgba(101, 119, 134, 0.2) 0px 0px 15px,
      rgba(101, 119, 134, 0.15) 0px 0px 3px 1px;
  }
}
</style>
