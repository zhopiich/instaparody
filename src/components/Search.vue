<template>
  <div class="w-[360px] relative">
    <input
      type="text"
      class="h-11 pl-10 pr-9 rounded-xl bg-[#f1f1f1]"
      v-model="searchTerm"
      placeholder="Search"
      ref="input"
      @keydown.esc.stop="handleEscKey"
    />
    <div
      class="absolute left-0 h-full aspect-square flex justify-center items-center"
    >
      <FontAwesomeIcon :icon="faMagnifyingGlass" class="fa-lg" />
    </div>
    <div
      v-if="searchTerm !== ''"
      class="cleanSearchBtn absolute right-0 h-full aspect-square flex justify-center items-center"
    >
      <FontAwesomeIcon
        :icon="faCircleXmark"
        class="fa-lg cursor-pointer hover:text-[#435f8e]"
        @click="cleanSearchTerm"
      />
    </div>

    <div
      v-if="
        searchTerm.trim().length > 0 &&
        (!direction || navbarPosition === 'expanded') &&
        navbarPosition !== 'folded'
      "
      class="absolute top-full w-full mt-1 rounded-xl overflow-hidden border shadow-lg max-h-[360px]"
    >
      <SearchResults :maxHeight="'inherit'" @resultClicked="cleanSearchTerm" />
    </div>
  </div>
</template>

<script setup>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  faMagnifyingGlass,
  faCircleXmark,
} from "@fortawesome/free-solid-svg-icons";

import TheIcon from "./TheIcon.vue";
import TheButton from "./TheButton.vue";
import SearchResults from "./SearchResults.vue";

import { ref, computed, onMounted, onBeforeUnmount, watch } from "vue";

import { useUserStore } from "../stores/user";
const userStore = useUserStore();

defineProps(["direction", "navbarPosition"]);

const input = ref(null);

const searchTerm = ref(userStore.searchTerm);
const cleanSearchTerm = () => {
  searchTerm.value = "";
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

const handleEscKey = () => {
  if (searchTerm.value) {
    cleanSearchTerm();
    return;
  }

  input.value.blur();
};

onBeforeUnmount(() => {
  userStore.saveSearchTerm(searchTerm.value);
});
</script>

<style scoped></style>
