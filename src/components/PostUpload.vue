<template>
  <TheModal @close="handleClose">
    <!-- slot following -->
    <div class="postUpload bg-white rounded-lg overflow-hidden">
      <div class="w=[640px] h-[640px] relative">
        <DragAndDropInput @edit-imagesFile="handleImagesPosted" />
      </div>

      <!--  -->
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

  <ConfirmDiscardPost v-if="isShowConfirm" @close="isShowConfirm = false" />
</template>

<script setup>
import { ref } from "vue";
// import { useRoute } from "vue-router";
import TheModal from "./TheModal.vue";
import TheIcon from "./TheIcon.vue";
import TheButton from "./TheButton.vue";
import DragAndDropInput from "./DragAndDropInput.vue";
import ConfirmDiscardPost from "./ConfirmDiscardPost.vue";

import { usePostStore } from "../stores/post";
const postStore = usePostStore();

// const route = useRoute();

const imagesPosted = ref([]);

const descriptionPost = ref("");

async function handleImagesPosted(ImagesFile) {
  imagesPosted.value = ImagesFile;
}

function publishPost() {
  postStore.uploadPost(
    {
      images: imagesPosted.value,
      description: descriptionPost.value,
    }
    // route.name
  );
}

const isShowConfirm = ref(false);
const handleClose = () => {
  if (imagesPosted.value.length > 0 || descriptionPost.value.length > 0) {
    isShowConfirm.value = true;
    return;
  }

  postStore.toggleShowPostUpload(false);
};
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
