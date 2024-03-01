<template>
  <TheModal @close="postStore.toggleShowPostUpload(false)">
    <!-- slot following -->
    <div class="postUpload">
      <label class="upload">
        <img
          v-if="imageObjUrl"
          :src="imageObjUrl"
          class="preview"
          :class="{ previewBackground: imagePost !== null }"
        />
        <TheIcon v-else icon="upload-image" />
        <input
          type="file"
          accept="image/*"
          class="fileChooser"
          @change="handleImageUpload"
        />
      </label>
      <div class="postContent">
        <textarea
          placeholder="Write something..."
          class="postContentInput"
          v-model="descriptionPost"
        ></textarea>
        <TheButton class="pubBtn" color="immerse" @click="publishPost"
          >Post</TheButton
        >
      </div>
    </div>
  </TheModal>
</template>

<script setup>
import { ref } from "vue";
import { useRoute } from "vue-router";
import TheModal from "./TheModal.vue";
import TheIcon from "./TheIcon.vue";
import TheButton from "./TheButton.vue";

import { usePostStore } from "../stores/post";
const postStore = usePostStore();

const route = useRoute();

const imageObjUrl = ref("");

const imagePost = ref(null);
const descriptionPost = ref("");

async function handleImageUpload(e) {
  const imageFile = e.target.files[0];
  if (imageFile) {
    imageObjUrl.value = URL.createObjectURL(imageFile);
    imagePost.value = imageFile;
  }
}
function publishPost() {
  postStore.uploadPost(
    {
      image: imagePost.value,
      description: descriptionPost.value,
    }
    // route.name
  );
}
</script>

<style scoped>
.postUpload {
  /* width: 50vw; */
  /* height: 70vh; */
  display: flex;
  /* grid-template-rows: 4fr 1fr; */
  flex-direction: column;
  @apply max-h-screen w-[348px] sm:w-[596px] lg:w-[640px];
}

.preview {
  width: inherit;
  /* width: 100%;
  height: 100%; */
  object-fit: contain;
  min-height: 0;
  @apply aspect-square;
}

.preview.previewBackground {
  @apply bg-slate-600;
}

.upload {
  display: grid;
  place-items: center;
  cursor: pointer;
  /* min-height: 0; */
  width: inherit;
  @apply aspect-square;
}

.upload > svg {
  width: 254px;
  height: 316px;
}

.fileChooser {
  opacity: 0;
  position: absolute;
  /* top: 0;
  left: 0; */
}

.postContent {
  display: grid;
}

.postContentInput {
  border-bottom: none;
  resize: none;
  padding: 12px 24px;
}

.postContentInput::placeholder {
  color: #757575;
}

.pubBtn {
  align-self: end;
  justify-self: end;
  position: relative;
  /* right: 24px;
  bottom: 18px; */
  @apply right-[6px] bottom-0;
}
</style>
