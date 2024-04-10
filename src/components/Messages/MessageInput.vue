<template>
  <ImagePreview
    v-if="messageStore.imagePreview"
    :imagePreview="messageStore.imagePreview"
    @cancel="cancelSendImage"
  />

  <div class="border-t flex items-center *:grow">
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
            id="imageInput"
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
          <span
            class="textarea resize-none border-none shadow-none py-1 px-0 bg-transparent overflow-auto"
            role="textbox"
            contenteditable="plaintext-only"
            @input="onInput"
            ref="contentEditor"
          ></span>
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
</template>

<script setup>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faImage } from "@fortawesome/free-solid-svg-icons";
import { faPaperPlane } from "@fortawesome/free-regular-svg-icons";

import ImagePreview from "./ImagePreview.vue";

import { ref, shallowRef, computed, onMounted, watch } from "vue";

import { useMessageStore } from "../../stores/message";
const messageStore = useMessageStore();

const messageContent = ref("");
const trimmedContent = computed(() => messageContent.value.trim());

const isInputValid = computed(
  () => trimmedContent.value !== "" || messageStore.imageToBeSent
);

const onInput = (e) => {
  if (e.target.innerText === "") {
    messageContent.value = "";
    return;
  }
  messageContent.value = e.target.innerText;
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
</script>

<style scoped>
.textarea {
  display: block;
  width: 100%;
  min-height: 20px;
  max-height: 128px;
  line-height: 20px;
  outline: none;

  /* user-select: text; */
  white-space: pre-wrap;
  /* overflow-wrap: break-word; */

  font-size: 1.1em;
}

.textarea[contenteditable]:empty::before {
  content: "Start a new message";
  color: gray;
}
</style>
