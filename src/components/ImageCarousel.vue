<template>
  <div class="size-full overflow-hidden" ref="imageViewport">
    <div class="imagesList">
      <Transition>
        <div :class="[movement % 2 === 0 ? 'movementEven' : 'movementOdd']">
          <TransitionGroup name="slide" tag="ul">
            <div
              v-for="(image, index) in images"
              class="imageItem relative inline-block bg-black"
              :key="image?.id || image"
            >
              <img
                :src="image?.url || image"
                alt=""
                class="h-full w-full object-contain"
                :class="{ 'drag-none': !isDraggable }"
              /></div
          ></TransitionGroup>
        </div>
      </Transition>
    </div>

    <div
      v-if="images.length > 1"
      class="absolute top-0 w-full h-full pointer-events-none"
    >
      <div
        v-if="movement > 0"
        class="left-0 absolute h-full w-fit flex items-center ml-4"
        :class="{ 'pointer-events-auto': !isDraggingOver }"
      >
        <button
          @click="prev"
          class="btn btn-circle btn-sm cursor-pointer drop-shadow-md"
        >
          <FontAwesomeIcon :icon="faAngleLeft" class="" />
        </button>
      </div>
      <div
        v-if="movement < images.length - 1"
        class="right-0 absolute h-full w-fit flex items-center mr-4"
        :class="{ 'pointer-events-auto': !isDraggingOver }"
      >
        <button
          @click="next"
          class="btn btn-circle btn-sm cursor-pointer drop-shadow-md"
        >
          <FontAwesomeIcon :icon="faAngleRight" class="" />
        </button>
      </div>

      <div
        v-if="isShowIndicators"
        class="flex absolute bottom-4 w-full justify-center pointer-events-none"
      >
        <template v-for="n in images.length" :key="n">
          <div
            class="w-[6px] aspect-square rounded-full mr-1 last:mr-0 bg-white transition-opacity duration-500"
            :class="n - 1 === movement ? 'opacity-100' : 'opacity-40'"
          ></div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faAngleRight, faAngleLeft } from "@fortawesome/free-solid-svg-icons";

import { ref, toRef, computed, onMounted, onUnmounted, watch } from "vue";

const imageViewport = ref(null);

const props = defineProps({
  imagesUrl: { type: Array },
  isDraggingOver: { type: Boolean },
  isDraggable: { type: Boolean, default: true },
  isFocusRequired: { type: Boolean, default: false },
  isShowIndicators: { type: Boolean, default: true },
});
const images = toRef(props.imagesUrl);

const lengthimages = computed(() => images.value.length);

const widthImage = ref(0);
const heightImage = ref(0);

const resizeObserver = new ResizeObserver((entries) => {
  const entry = entries[0];
  const { width, height } = entry.contentRect;
  widthImage.value = width;
  heightImage.value = height;
});

const movement = ref(0);

const next = () => {
  movement.value++;
};
const prev = () => {
  movement.value--;
};

watch(
  () => images.value.length,
  (newVal, oldVal) => {
    if (newVal > 0 && oldVal === 0) {
      movement.value = 0;
    }

    if (newVal !== 0 && newVal === movement.value) {
      movement.value--;
    }

    if (oldVal !== 0 && newVal > oldVal) {
      movement.value = oldVal;
    }
  }
);

const emit = defineEmits(["switchFocus"]);

if (props.isFocusRequired) {
  watch(movement, (newVal) => {
    emit("switchFocus", newVal);
  });
}

onMounted(() => {
  resizeObserver.observe(imageViewport.value);
});

onUnmounted(() => {
  resizeObserver.disconnect();
});
</script>

<style scoped>
.imagesList {
  width: v-bind(widthImage * lengthimages + "px");
}

.imageItem {
  width: v-bind(widthImage + "px");
  height: v-bind(heightImage + "px");
}

.movementOdd,
.movementEven {
  transform: translateX(v-bind(-widthImage * movement + "px"));
}

.slide-move {
  transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
}

.slide-leave-active {
  position: absolute;
}

img.drag-none {
  -webkit-user-drag: none;
}
</style>
