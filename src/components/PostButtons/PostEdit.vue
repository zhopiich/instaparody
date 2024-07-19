<template>
  <TheModal @close="handleClose" :isShowCloseBtn="false">
    <div class="max-h-dvh overflow-y-auto">
      <div class="bg-white rounded-lg overflow-hidden">
        <div
          class="min-w-[336px] w-[calc(100dvw_-_8px)] max-w-[450px] sm:max-w-[600px]"
        >
          <div class="w-full flex flex-col relative">
            <div class="w-full aspect-square relative">
              <div class="size-full absolute">
                <ImageCarousel
                  :imagesUrl="currentImages"
                  :isFocusRequired="true"
                  @switch-focus="handleIndex"
                />
              </div>

              <div
                v-if="currentImages.length > 1"
                class="absolute top-0 right-0 m-4"
              >
                <button
                  class="btn btn-circle cursor-pointer"
                  @click="removeImage"
                >
                  <FontAwesomeIcon :icon="faTrashCan" class="fa-xl scale-125" />
                </button>
              </div>

              <div class="absolute top-0 left-0 m-4">
                <div
                  class="px-3 py-1 rounded-full cursor-pointer bg-white/60 hover:bg-white *:active:text-neutral-400 transition-colors"
                  @click="handleClose"
                >
                  <span
                    class="font-semibold text-sm select-none pointer-events-none"
                    >Cancel</span
                  >
                </div>
              </div>
            </div>

            <div class="postContent box-border h-[125px] border-t">
              <div class="size-full flex">
                <textarea
                  placeholder="Write something..."
                  class="postContentInput"
                  v-model="currentDescription"
                ></textarea>
                <div
                  class="self-end px-4 py-1 cursor-pointer *:active:text-sky-300"
                  :class="{ '*:text-blue-300 pointer-events-none': !isEdited }"
                  @click="saveEdited()"
                >
                  <span class="font-semibold text-sky-600 text-sm">Save</span>
                </div>
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
                    >Your changes could not be saved. Please try again.</span
                  >
                </div>

                <div class="mt-6 flex flex-row-reverse">
                  <TheButton :width="94" @click="saveEdited()"
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

  <ConfirmModal
    v-if="isShowConfirm"
    type="discard"
    @confirm="emits('close')"
    @close="isShowConfirm = false"
  />
</template>

<script setup>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  faCircleExclamation,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";

import TheModal from "../TheModal.vue";
import TheIcon from "../TheIcon.vue";
import TheButton from "../TheButton.vue";
import ImageCarousel from "../ImageCarousel.vue";

import { ref, computed, defineAsyncComponent } from "vue";

const ConfirmModal = defineAsyncComponent(() =>
  import("./ConfirmDeleteOrDiscard.vue")
);

const props = defineProps(["postId", "desc", "images"]);

const emits = defineEmits(["close"]);

import { usePostStore } from "../../stores/post";
const postStore = usePostStore();

import { useAlertStore } from "../../stores/alert";
const alertStore = useAlertStore();

const isUploading = ref(false);
const isUploadFailed = ref(false);

const currentDescription = ref(props.desc);
const currentImages = ref([...props.images]);

const isDescEdited = computed(() => currentDescription.value !== props.desc);
const isImagesEdited = computed(
  () => currentImages.value.length !== props.images.length
);
const isEdited = computed(() => isDescEdited.value || isImagesEdited.value);

const indexFocus = ref(0);
const handleIndex = (newIndex) => {
  indexFocus.value = newIndex;
};

const removeImage = () => {
  if (currentImages.value.length === 1) return;

  currentImages.value.splice(indexFocus.value, 1);
};

const saveEdited = async (postId = props.postId) => {
  if (!isEdited.value) return;

  if (isUploadFailed.value) {
    isUploadFailed.value = false;
  }
  isUploading.value = true;

  const descResult = isDescEdited.value
    ? await postStore.updateDescription({
        postId,
        newDesc: currentDescription.value,
      })
    : null;

  const imagesResult =
    isImagesEdited.value && currentImages.value.length > 0
      ? await postStore.deleteImage({
          postId,
          allImages: props.images,
          leftImages: currentImages.value,
        })
      : null;

  if ([descResult, imagesResult].some((result) => result)) {
    isUploading.value = false;
    isUploadFailed.value = true;
  } else {
    alertStore.addAlert({
      content: "Your post was updated.",
    });

    emits("close");
  }
};

const isShowConfirm = ref(false);
const handleClose = () => {
  if (isEdited.value) {
    isShowConfirm.value = true;
    return;
  }

  emits("close");
};
</script>

<style scoped>
.postContentInput {
  border: none;
  resize: none;
  outline: none;
  padding: 8px 16px;
}

.postContentInput::placeholder {
  color: #929292;
}
</style>
