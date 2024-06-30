<template>
  <div class="px-4 py-2">
    <div class="flex items-center">
      <div class="grow w-0 flex flex-col justify-center">
        <label class="">
          <div class="relative">
            <div v-if="!commentContent" class="editorPlaceHolder py-2">
              <span>Add a comment...</span>
            </div>
            <div
              class="textArea resize-none border-none shadow-none py-2 px-0 bg-transparent overflow-auto"
              role="textbox"
              contenteditable="true"
              aria-multiline="true"
              @input="handleInput"
              @paste="handlePaste"
              @keypress.enter="handleEnter"
              ref="contentEditor"
            ></div>
          </div>
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

const props = defineProps(["postId", "postCreatedBy"]);

const emits = defineEmits(["setInputRef", "focus"]);

const commentContent = ref("");
const trimmedContent = computed(() => commentContent.value.trim());

const isInputValid = computed(() => trimmedContent.value !== "");

const handleInput = (e) => {
  commentContent.value = e.target.textContent;
};

const handlePaste = (e) => {
  e.stopPropagation();
  e.preventDefault();

  const paste = (e.clipboardData || window.clipboardData).getData("text");

  const selection = window.getSelection();
  if (!selection.rangeCount) return;
  selection.deleteFromDocument();
  selection.getRangeAt(0).insertNode(document.createTextNode(paste));
  selection.collapseToEnd();

  handleInput(e);
};

const postComment = async () => {
  const content = trimmedContent.value;
  if (content === "") return;

  await commentStore.uploadComment({
    content: commentContent.value,
    postId: props.postId,
    postCreatedBy: props.postCreatedBy,
  });

  commentContent.value = "";
  contentEditor.value.innerText = "";
  contentEditor.value.focus();
};

const handleEnter = (e) => {
  if (e.shiftKey || e.metaKey || e.ctrlKey) return;

  e.stopPropagation();
  e.preventDefault();

  if (!isInputValid.value) return;

  postComment();
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
.textArea {
  display: block;
  width: 100%;
  min-height: 24px;
  max-height: 80px;

  font-size: 15px;
  line-height: 20px;

  cursor: text;
  user-select: text;
  outline: none;
  white-space: pre-wrap;
  overflow-wrap: break-word;
}

.editorPlaceHolder {
  position: absolute;
  pointer-events: none;
  white-space: pre-wrap;
  color: gray;
  font-size: 15px;
  line-height: 20px;
}
</style>
