<template>
  <div class="size-full bg-white flex flex-col">
    <div class="p-4 border-b flex justify-center">
      <div class="w-full max-w-[360px] relative">
        <input
          type="text"
          class="h-11 pl-10 pr-9 rounded-xl bg-[#f1f1f1]"
          v-model="searchTerm"
          placeholder="Search"
          ref="input"
        />
        <div
          class="absolute top-0 left-0 h-full aspect-square flex justify-center items-center"
        >
          <FontAwesomeIcon :icon="faMagnifyingGlass" class="fa-lg" />
        </div>
        <div
          v-if="searchTerm !== ''"
          class="absolute top-0 right-0 h-full aspect-square flex justify-center items-center"
        >
          <FontAwesomeIcon
            :icon="faCircleXmark"
            class="fa-lg cursor-pointer hover:text-[#435f8e]"
            @click="cleanSearchTerm"
          />
        </div>
      </div>
    </div>

    <!-- result -->
    <div v-if="searchTerm.trim().length > 0" class="overflow-hidden">
      <SearchResults :maxHeight="'full'" @resultClicked="handleClick" />
    </div>
  </div>
</template>

<script setup>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  faMagnifyingGlass,
  faCircleXmark,
} from "@fortawesome/free-solid-svg-icons";

import SearchResults from "./SearchResults.vue";

const emits = defineEmits(["resultClicked"]);

import { ref, onMounted, onBeforeUnmount, watch } from "vue";

import { useUserStore } from "../stores/user";
const userStore = useUserStore();

const isFirst = ref(false);

const input = ref(null);

const searchTerm = ref(userStore.searchTerm);
const cleanSearchTerm = () => {
  searchTerm.value = "";
};

const handleClick = () => {
  cleanSearchTerm();
  emits("resultClicked");
};

let delay;
let lastTrimmedTerm = "";
const handleSearch = () => {
  if (delay) {
    clearTimeout(delay);
    delay = null;
  }

  const newTrimmedTerm = searchTerm.value.trim();
  if (lastTrimmedTerm === newTrimmedTerm) return;

  if (!newTrimmedTerm) {
    lastTrimmedTerm = "";
    userStore.cleanResults();
    return;
  }

  lastTrimmedTerm = newTrimmedTerm;

  delay = setTimeout(() => {
    userStore.search(newTrimmedTerm);
  }, 500);
};

watch(searchTerm, handleSearch);

onMounted(() => {
  const body = document.body;
  body.classList.add("freeze");

  input.value.focus();
});

onBeforeUnmount(() => {
  const body = document.body;
  body.classList.remove("freeze");

  userStore.saveSearchTerm(searchTerm.value);
});
</script>

<style>
body.freeze {
  overflow: hidden;
}
</style>

<style scoped></style>
