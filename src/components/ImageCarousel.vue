<template>
  <div class="w-full h-full absolute top-0 overflow-hidden">
    <div class="flex" id="images">
      <Transition>
        <div
          :class="[
            movement % 2 === 0 ? 'movementEven' : 'movementOdd',
            // `max-w-[${widthImage * images.length}px]`,
          ]"
        >
          <TransitionGroup name="fade" tag="ul" class="h-[640px]">
            <div
              v-for="(image, index) in images"
              class="aspect-square relative inline-block"
              :class="`h-[${widthImage}px]`"
              :key="image.id"
            >
              <img
                :src="image.url"
                alt=""
                class="h-full w-full object-cover"
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
        class="left-0 absolute h-full w-fit flex items-center ml-2"
        :class="{ 'pointer-events-auto': !isDraggingOver }"
      >
        <button @click="prev" class="btn btn-circle cursor-pointer">
          {{ "<" }}
        </button>
      </div>
      <div
        v-if="movement < images.length - 1"
        class="right-0 absolute h-full w-fit flex items-center mr-2"
        :class="{ 'pointer-events-auto': !isDraggingOver }"
      >
        <button @click="next" class="btn btn-circle cursor-pointer">
          {{ ">" }}
        </button>
      </div>

      <div
        v-if="isShowIndicators"
        class="flex absolute top-4 w-full justify-center pointer-events-none"
      >
        <template v-for="(n, index) in images.length" :key="index">
          <div
            v-if="index === movement"
            class="w-[6px] aspect-square rounded-full mr-1 last:mr-0 bg-sky-400"
          ></div>
          <div
            v-else
            class="w-[6px] aspect-square rounded-full mr-1 last:mr-0 bg-white"
          ></div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, toRef, computed, onMounted, watch } from "vue";

const props = defineProps({
  imagesUrl: { type: Array },
  isDraggingOver: { type: Boolean },
  isDraggable: { type: Boolean, default: true },
  isFocusRequired: { type: Boolean, default: false },
  isShowIndicators: { type: Boolean, default: true },
});
const images = toRef(props.imagesUrl);

const lengthimages = computed(() => images.value.length);

const widthImage = 640;

const movement = ref(0);
const movementOdd = computed(() => {
  if (movement.value % 2 !== 0) return movement.value;
});
const movementEven = computed(() => {
  if (movement.value % 2 === 0) return movement.value;
});
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

    // emit("inputChanged", imageFiles.value);
  }
);

const emit = defineEmits(["switchFocus"]);

if (props.isFocusRequired) {
  watch(movement, (newVal) => {
    emit("switchFocus", newVal);
  });
}
</script>

<style scoped>
#images {
  width: v-bind(widthImage * lengthimages + "px");
}

.movementOdd {
  transform: translateX(v-bind(-widthImage * movementOdd + "px"));
}

.movementEven {
  transform: translateX(v-bind(-widthImage * movementEven + "px"));
}

.fade-move {
  transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
}

.fade-enter-from,
.fade-leave-to {
  /*   opacity: 0; */
  /*   transform: scaleY(0.01) translate(30px, 0); */
}

.fade-leave-active {
  position: absolute;
}

img.drag-none {
  -webkit-user-drag: none;
}
</style>
