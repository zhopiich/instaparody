<template>
  <div class="searchInput relative" :class="{ hiddenSearch: !isShowSearch }">
    <input type="text" v-model="searchTerm" placeholder="Search" />
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
        class="fa-xl cursor-pointer hover:text-[#435f8e]"
        @click="cleanSearchTerm"
      />
    </div>
    <!-- <TheButton
      v-else
      class="cancelSearchBtn"
      color="immerse"
      @click="$emit('toggle', false)"
    >
      Cancel
    </TheButton> -->
    <SearchResults
      v-if="searchTerm.trim().length > 0 && !direction"
      @resultClicked="cleanSearchTerm"
    />
  </div>
  <button
    class="searchBtn"
    :class="{ hiddenSearch: isShowSearch }"
    @click="$emit('toggle', true)"
  >
    <TheIcon icon="search" />
  </button>
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

import { ref, computed, onMounted, watch } from "vue";

import { useUserStore } from "../stores/user";
const userStore = useUserStore();

defineProps(["isShowSearch", "direction"]);
defineEmits(["toggle"]);

const searchTerm = ref("");
const cleanSearchTerm = () => {
  searchTerm.value = "";
};

let delay;
let lastTrimmedTerm;
const handleSearch = () => {
  if (delay) {
    clearTimeout(delay);
    delay = null;
  }

  if (!searchTerm.value) {
    lastTrimmedTerm = null;
    userStore.cleanResults();
    return;
  }

  const newTrimmedTerm = searchTerm.value.trim();
  if (lastTrimmedTerm === newTrimmedTerm) return;
  if (!newTrimmedTerm) return;

  delay = setTimeout(() => {
    userStore.search(newTrimmedTerm);

    lastTrimmedTerm = newTrimmedTerm;
  }, 500);
};

watch(searchTerm, handleSearch);
</script>

<style scoped>
@screen max-md {
  .searchBtn.hiddenSearch {
    @apply hidden;
  }
}

@screen max-sm {
  /* .navbar.showSearch {
    grid-template-columns: 1fr auto;
  } */

  .hiddenSearch {
    @apply hidden;
  }
}

.searchInput {
  position: relative;
  justify-self: center;
  margin: 0;
  @apply max-lg:max-w-[351px] lg:w-[360px];
}

.searchInput input {
  height: 40px;
  padding: 0 12px 0 40px;
  background: #f1f1f1;
  border-radius: 12px;
}

.cancelSearchBtn {
  position: absolute;
  background: none;
  border: none;
  right: 6px;
  top: 0;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.cancelSearchBtn {
  @apply sm:hidden;
}

.searchBtn {
  justify-self: end;
  margin-right: 18px;
  @apply h-10 w-10 rounded-xl border border-solid border-neutral-500 sm:hidden;
}
</style>
