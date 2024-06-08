<template>
  <TheModal @close="handleClose">
    <div class="max-h-dvh overflow-y-auto">
      <div class="bg-white rounded-lg overflow-hidden">
        <div
          class="min-w-[336px] w-[calc(100dvw_-_8px)] max-w-[450px] sm:max-w-[600px]"
        >
          <div class="size-full flex flex-col">
            <div class="w-full aspect-square relative">
              <DragAndDropInput @edit-imagesFile="handleImagesPosted" />
            </div>

            <div class="postContent border-t h-[125px] flex">
              <textarea
                placeholder="Write something..."
                class="postContentInput"
                v-model="descriptionPost"
              ></textarea>
              <TheButton
                class="self-end"
                color="immerse"
                :isDisable="!descriptionPost"
                @click="publishPost"
                >Post</TheButton
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </TheModal>

  <ConfirmDiscardPost v-if="isShowConfirm" @close="isShowConfirm = false" />
</template>

<script setup>
import TheModal from "./TheModal.vue";
import TheIcon from "./TheIcon.vue";
import TheButton from "./TheButton.vue";
import DragAndDropInput from "./DragAndDropInput.vue";
import ConfirmDiscardPost from "./ConfirmDiscardPost.vue";

import { usePostStore } from "../stores/post";
const postStore = usePostStore();

import { ref } from "vue";

const imagesPosted = ref([]);

const descriptionPost = ref("");

async function handleImagesPosted(ImagesFile) {
  imagesPosted.value = ImagesFile;
}

function publishPost() {
  postStore.uploadPost({
    images: imagesPosted.value,
    description: descriptionPost.value,
  });
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
.postContentInput {
  border: none;
  resize: none;
  padding: 8px 16px;
}

.postContentInput::placeholder {
  color: #757575;
}
</style>
