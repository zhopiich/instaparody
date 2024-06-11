<template>
  <TheModal @close="handleClose">
    <div class="max-h-dvh overflow-y-auto">
      <div class="bg-white rounded-lg overflow-hidden">
        <div
          class="min-w-[336px] w-[calc(100dvw_-_8px)] max-w-[450px] sm:max-w-[600px]"
        >
          <div class="size-full flex flex-col relative">
            <div
              class="w-full aspect-square"
              :class="{
                // 'bg-white': imagesPosted.length === 0,
              }"
            >
              <DragAndDropInput @edit-imagesFile="handleImagesPosted" />
            </div>

            <div
              class="postContent box-border transition-[height] duration-300"
              :class="imagesPosted.length > 0 ? 'h-[125px] border-t' : 'h-0'"
            >
              <div v-if="imagesPosted.length > 0" class="size-full flex">
                <textarea
                  placeholder="Write something..."
                  class="postContentInput"
                  v-model="descriptionPost"
                ></textarea>
                <TheButton
                  class="self-end"
                  color="immerse"
                  :isDisable="imagesPosted.length === 0"
                  @click="publishPost"
                  >Post</TheButton
                >
              </div>
            </div>

            <div v-if="isUploading" class="size-full absolute bg-white/70">
              <div class="size-full flex justify-center items-center">
                <span class="loading loading-spinner text-blue-500 w-24"></span>
              </div>
            </div>

            <div v-if="isUploadFailed" class="size-full absolute bg-white">
              <div
                class="size-full p-6 flex flex-col justify-center items-center"
              >
                <div class="h-24 aspect-square">
                  <FontAwesomeIcon
                    :icon="faCircleExclamation"
                    class="size-full"
                  />
                </div>

                <div class="overflow-y-visible mt-4">
                  <span class="text-pretty text-xl"
                    >Your post could not be shared. Please try again.</span
                  >
                </div>

                <div class="mt-6 flex flex-row-reverse">
                  <TheButton :width="94" @click="publishPost"
                    >Try again</TheButton
                  >
                  <TheButton
                    class="mr-2"
                    color="reverse"
                    :width="94"
                    @click="isUploadFailed = false"
                    >Cancel</TheButton
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </TheModal>

  <ConfirmDiscardPost v-if="isShowConfirm" @close="isShowConfirm = false" />
</template>

<script setup>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";

import TheModal from "../TheModal.vue";
import TheIcon from "../TheIcon.vue";
import TheButton from "../TheButton.vue";
import DragAndDropInput from "./DragAndDropInput.vue";
import ConfirmDiscardPost from "./ConfirmDiscardPost.vue";

import { usePostStore } from "../../stores/post";
const postStore = usePostStore();

import { ref } from "vue";

const isUploading = ref(false);
const isUploadFailed = ref(false);

const imagesPosted = ref([]);
const descriptionPost = ref("");

async function handleImagesPosted(ImagesFile) {
  imagesPosted.value = ImagesFile;
}

const publishPost = async () => {
  if (isUploadFailed.value) {
    isUploadFailed.value = false;
  }
  isUploading.value = true;

  const docRef = await postStore.uploadPost({
    images: imagesPosted.value,
    description: descriptionPost.value,
  });

  if (docRef) {
    postStore.toggleShowPostUpload(false);
  } else {
    isUploading.value = false;
    isUploadFailed.value = true;
  }
};

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
  color: #929292;
}
</style>
