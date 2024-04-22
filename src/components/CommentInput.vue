<template>
  <div class="px-4 py-2">
    <div class="flex items-center">
      <div class="grow w-0 flex flex-col justify-center">
        <label class="">
          <span
            class="textarea resize-none border-none shadow-none py-2 px-0 bg-transparent overflow-auto"
            role="textbox"
            contenteditable="plaintext-only"
            @input="onInput"
            ref="contentEditor"
          ></span>
        </label>
      </div>

      <div class="grow-0 shrink-0 h-fit">
        <div
          class="ml-2"
          :class="
            isInputValid
              ? 'text-sky-500 hover:text-blue-900'
              : 'text-sky-200  pointer-events-none'
          "
          role="button"
          @click="postComment"
          :disable="!isInputValid"
        >
          <p class="font-bold pointer-events-none select-none">Post</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, onBeforeRouteUpdate, onBeforeRouteLeave } from "vue-router";

import { useCommentStore } from "../stores/comment";
import { usePostStore } from "../stores/post";

const commentStore = useCommentStore();
const postStore = usePostStore();

const contentEditor = ref(null);

const props = defineProps(["postId"]);

const emits = defineEmits(["setInputRef", "focus"]);

const commentContent = ref("");
const trimmedContent = computed(() => commentContent.value.trim());

const isInputValid = computed(() => trimmedContent.value !== "");

const onInput = (e) => {
  if (e.target.innerText === "") {
    commentContent.value = "";
    return;
  }
  commentContent.value = e.target.innerText;
};

const postComment = async () => {
  const content = trimmedContent.value;
  if (content === "") return;

  await commentStore.uploadComment({
    content: commentContent.value,
    postId: props.postId,
  });

  commentContent.value = "";
  contentEditor.value.innerText = "";
  contentEditor.value.focus();
};

onMounted(() => {
  emits("setInputRef", contentEditor.value);

  if (commentStore.isFocusOnMounted) {
    emits("focus");

    commentStore.setIsFocus(false);
  }
});
</script>

<style scoped>
.textarea {
  display: block;
  width: 100%;
  min-height: 24px;
  max-height: 80px;
  line-height: 18px;
  outline: none;

  white-space: pre-wrap;

  font-size: 1em;
}

.textarea[contenteditable]:empty::before {
  content: "Add a comment...";
  color: gray;
  font-size: 0.95em;
}
</style>
