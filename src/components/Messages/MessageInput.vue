<template>
  <ImagePreview
    v-if="messageStore.imagePreview"
    :imagePreview="messageStore.imagePreview"
    @cancel="cancelSendImage"
  />
  <div class="flex">
    <label class="w-12 flex justify-center items-center">
      <FontAwesomeIcon :icon="faImage" class="fa-xl cursor-pointer" />
      <input
        type="file"
        accept="image/*"
        class="hidden"
        @change="handleImagePreview"
      />
    </label>
    <input
      v-model="messageContent"
      type="text"
      placeholder="Write Message"
      class="input input-bordered w-full max-w-xs"
    />
    <button
      class="btn btn-success"
      @click="sendMessage(messageContent, imageToBeSent)"
    >
      Send
    </button>
  </div>
</template>

<script setup>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faImage } from "@fortawesome/free-solid-svg-icons";

import ImagePreview from "./ImagePreview.vue";

import { ref, shallowRef, computed, onMounted, watch } from "vue";

import { useMessageStore } from "../../stores/message";
const messageStore = useMessageStore();

// import { useUserStore } from "../../stores/user.js";
// const userStore = useUserStore();

const messageContent = ref(null);

const imageToBeSent = ref(null);

const handleImagePreview = (event) => {
  const imageFile = event.target.files[0];
  if (imageFile) {
    messageStore.setImagePreview(imageFile);
    imageToBeSent.value = imageFile;
  }
};

const cancelSendImage = () => {
  messageStore.removeImagePreview();
  imageToBeSent.value = null;
};

const sendMessage = async (content, image = null) => {
  if (image) {
    imageToBeSent.value = null;
  }

  messageContent.value = null;
  messageStore.appendLocalList(content);

  const messageRef = await messageStore.sendMessage(content, image);
  const messageId = messageRef.id;
  await messageStore.updateLastMessage({ content, id: messageId });
};
</script>

<style scoped></style>
