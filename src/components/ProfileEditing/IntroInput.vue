<template>
  <div class="relative">
    <label for="intro"
      ><div class="py-4">
        <p class="leading-5 font-bold">Intro</p>
      </div>
    </label>
    <textarea
      rows="2"
      v-model="intro"
      id="intro"
      class="resize-none !pr-20"
      placeholder="Intro"
      :class="{ '!border-red-500': !isIntroValid }"
    ></textarea>

    <div class="absolute right-4 bottom-2.5 flex">
      <span
        class="text-xs font-normal text-gray-500"
        :class="{ '!text-red-400': !isIntroValid }"
        >{{ intro.length + " / 150" }}</span
      >
    </div>
  </div>
</template>

<script setup>
const props = defineProps(["initialIntro"]);
const emits = defineEmits(["introChanged", "setValidIntro"]);

import { ref, computed, onMounted, watch } from "vue";

const intro = ref("");

const isIntroValid = computed(() => intro.value.length <= 150);

watch(isIntroValid, (newVal) => {
  emits("setValidIntro", newVal);
});

onMounted(() => {
  const setWatch = () => {
    watch(intro, (newVal) => {
      if (newVal.length <= 150) {
        emits("introChanged", newVal);
      }
    });
  };

  if (!props.initialIntro) {
    watch(
      () => props.initialIntro,
      (newVal) => {
        intro.value = newVal || "";

        setWatch();
      },
      { once: true }
    );
  } else {
    intro.value = props.initialIntro || "";
    setWatch();
  }
});
</script>

<style scoped></style>
