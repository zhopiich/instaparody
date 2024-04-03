<template>
  <div
    class="h-full w-full absolute top-0"
    @dragover="dragover"
    @dragenter="dragenter"
    @dragleave="dragleave"
    @drop="drop"
  >
    <input
      type="file"
      multiple
      id="imageInput"
      accept="image/*"
      class="hidden absolute pointer-events-none"
      ref="fileInput"
      @change="addImages"
    />

    <div
      v-if="imageFiles.length === 0"
      class="h-full w-full flex flex-col justify-center items-center pointer-events-none"
    >
      <div class="h-[96px] aspect-square">
        <FontAwesomeIcon
          :icon="faImage"
          class="text-[96px]"
          style="color: #38a9ff"
        />
      </div>

      <div v-if="isDraggingOver" class="absolute top-0 mt-8 text-[34px]">
        Drop
      </div>
      <div
        class="flex flex-col items-center"
        :class="isDraggingOver ? 'pointer-events-none' : 'pointer-events-auto'"
      >
        <p class="text-2xl my-2">Drag images here</p>
        <p class="text-xl">or</p>

        <label
          class="select-none text-base text-center text-white font-bold rounded-lg px-4 py-2 mt-5 bg-sky-500 hover:bg-blue-500"
          for="imageInput"
        >
          Select among files
        </label>
      </div>
    </div>

    <ImageCarousel
      v-if="imageFiles.length > 0"
      :imagesUrl="imagesObjUrl"
      :isDraggingOver="isDraggingOver"
      :isDraggable="false"
      :isFocusRequired="true"
      @switch-focus="handleIndex"
    />
    <div v-if="imageFiles.length > 0" class="absolute top-0 right-0 m-4">
      <button
        class="btn btn-circle cursor-pointer"
        :class="{ 'pointer-events-none': isDraggingOver }"
        @click="remove"
      >
        <FontAwesomeIcon :icon="faTrashCan" class="fa-xl scale-125" />
      </button>
    </div>
    <div
      v-if="isDraggingOver"
      class="absolute top-0 border-2 rounded-xl border-dashed border-sky-400 pointer-events-none m-[10px]"
      id="dropzoneMarking"
    ></div>
  </div>
</template>

<script setup>
const getUUID = () => window.crypto.randomUUID();

import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faImage } from "@fortawesome/free-regular-svg-icons";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";

import ImageCarousel from "./ImageCarousel.vue";

import { ref, computed, onMounted, watch } from "vue";
// const props = defineProps(["imagesCount"]);
const emit = defineEmits(["editImagesFile"]);

const imageFiles = ref([]);
const imagesObjUrl = ref([]);

const fileInput = ref(null);

const isDraggingOver = ref(false);

const addImages = () => {
  const newImagesFile = fileInput.value.files;

  // newImages is an Object including a property "length"
  if (newImagesFile.length > 0) {
    let imagesArray = [];
    imagesArray.push(...newImagesFile);
    if (!imagesArray.every((file) => file.type.startsWith("image/"))) return;

    imageFiles.value.push(...imagesArray);

    const newObjectURL = imagesArray.map((imageFile) => ({
      url: URL.createObjectURL(imageFile),
      id: getUUID(),
    }));
    imagesObjUrl.value.push(...newObjectURL);
  }
};

watch(
  () => imageFiles.value.length,
  (newVal, oldVal) => {
    emit("editImagesFile", imageFiles.value);
  }
);

// const dragenter = (e) => {
//   e.preventDefault();
//   isDraggingOver.value = true;
// };

const dragover = (e) => {
  e.preventDefault();
  isDraggingOver.value = true;
};

const dragleave = () => {
  isDraggingOver.value = false;
};

const drop = (e) => {
  e.preventDefault();
  fileInput.value.files = e.dataTransfer.files;
  addImages();
  isDraggingOver.value = false;
};

const indexFocus = ref(0);

const handleIndex = (newIndex) => {
  indexFocus.value = newIndex;
};

const remove = () => {
  imageFiles.value.splice(indexFocus.value, 1);
  imagesObjUrl.value.splice(indexFocus.value, 1);
};
</script>

<style scoped>
#dropzoneMarking {
  width: calc(100% - 20px);
  height: calc(100% - 20px);
}
</style>
