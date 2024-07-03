<template>
  <div class="flex flex-col inputHeight">
    <div class="grow shrink overflow-auto">
      <ImagePreview
        v-if="messageStore.imagePreview"
        :imagePreview="messageStore.imagePreview"
        @cancel="cancelSendImage"
      />
      <ReplyPreview v-if="messageStore.isThereReplied" />
    </div>

    <div class="shrink-0 border-t flex items-center *:grow" ref="textArea">
      <div
        class="min-h-11 mx-3 my-1.5 p-1 rounded-xl bg-gray-200 flex items-stretch"
      >
        <!-- image input -->
        <div class="shrink flex justify-start items-center">
          <label
            class="flex items-center justify-center h-9 aspect-square rounded-full cursor-pointer hover:bg-blue-300/50 transition-colors"
          >
            <FontAwesomeIcon
              :icon="faImage"
              class="text-blue-500 fa-lg scale-90"
            />
            <input
              id="messageImageInput"
              type="file"
              accept="image/*"
              class="hidden"
              @change="handleImagePreview"
              ref="fileInput"
            />
          </label>
        </div>

        <!-- text input -->
        <div class="grow w-0 min-h-fit flex flex-col justify-center">
          <label class="px-3">
            <div class="relative">
              <div v-if="!messageContent" class="editorPlaceHolder py-1">
                <span>Start a new message</span>
              </div>
              <div
                class="textArea resize-none border-none shadow-none py-1 px-0 bg-transparent overflow-auto"
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

        <!-- send btn -->
        <div class="shrink flex justify-start items-center">
          <div
            class="flex items-center justify-center h-9 aspect-square rounded-full cursor-pointer hover:bg-blue-300/50 transition-colors"
            @click="sendMessage"
            :class="{ 'pointer-events-none': !isInputValid }"
          >
            <FontAwesomeIcon
              :icon="faPaperPlane"
              class="fa-lg scale-90"
              :class="isInputValid ? 'text-blue-500' : 'text-blue-300'"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faImage } from "@fortawesome/free-solid-svg-icons";
import { faPaperPlane } from "@fortawesome/free-regular-svg-icons";

import ImagePreview from "./ImagePreview.vue";
import ReplyPreview from "./ReplyPreview.vue";

import { ref, computed, onMounted, onBeforeUnmount } from "vue";

import { useRoute } from "vue-router";
const route = useRoute();

import { useMediaQueryStore } from "../../stores/mediaQuery";
const mediaQueryStore = useMediaQueryStore();
const isMobile = computed(() => mediaQueryStore.isMobile);

const navbarHeight = computed(() => (isMobile.value ? "49px" : "80px"));

import { useAlertStore } from "../../stores/alert";
const alertStore = useAlertStore();

const textArea = ref(null);
let lastTextAreaHeight;
const heightObserver = new ResizeObserver((entries) => {
  const entry = entries[0];
  const { height } = entry.contentRect;

  if (lastTextAreaHeight === height) return;
  alertStore.setVariableHeight({ type: "messageInput", val: height });
  lastTextAreaHeight = height;
});

import { useMessageStore } from "../../stores/message";
const messageStore = useMessageStore();

const messageContent = ref("");
const trimmedContent = computed(() => messageContent.value.trim());

const isInputValid = computed(
  () => trimmedContent.value !== "" || messageStore.imageToBeSent
);

const handleInput = (e) => {
  messageContent.value = e.target.textContent;
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

const contentEditor = ref(null);

const fileInput = ref(null);

const handleImagePreview = (event) => {
  const imageFile = event.target.files[0];
  if (imageFile) {
    messageStore.setImagePreview(imageFile);
    messageStore.setImageToBeSent(imageFile);
  }

  // Reset the inputed files or @change won't be triggered
  // if the same files are selected again
  fileInput.value.value = null;
};

const cancelSendImage = () => {
  messageStore.removeImagePreview();
  messageStore.removeImageToBeSent();
};

const sendMessage = async () => {
  const content = trimmedContent.value;
  const image = messageStore.imageToBeSent;
  if (content === "" && !image) return;

  messageStore.resetNewMessages();

  if (image) {
    messageStore.removeImageToBeSent();
  }

  messageContent.value = "";
  contentEditor.value.innerText = "";
  contentEditor.value.focus();
  messageStore.appendLocalList(content);

  const messageRef = await messageStore.sendMessage(content, image);
  const messageId = messageRef.id;
  await messageStore.updateLastMessage({ content, id: messageId });
};

const handleEnter = (e) => {
  if (e.shiftKey || e.metaKey || e.ctrlKey) return;

  e.stopPropagation();
  e.preventDefault();

  if (!isInputValid.value) return;

  sendMessage();
};

onMounted(() => {
  messageStore.setInput(contentEditor.value);

  if (route.name === "messages") {
    heightObserver.observe(textArea.value);
  }
});

onBeforeUnmount(() => {
  if (route.name === "messages") {
    heightObserver.disconnect();
  }
});
</script>

<style scoped>
.textArea {
  display: block;
  width: 100%;
  min-height: 20px;
  max-height: 128px;
  line-height: 20px;
  outline: none;

  user-select: text;
  white-space: pre-wrap;
  overflow-wrap: break-word;

  font-size: 15px;
  cursor: text;
}

.editorPlaceHolder {
  position: absolute;
  pointer-events: none;
  white-space: pre-wrap;
  color: gray;
  font-size: 15px;
  line-height: 20px;
}

.inputHeight {
  max-height: calc(100dvh - v-bind(navbarHeight));
}
</style>
