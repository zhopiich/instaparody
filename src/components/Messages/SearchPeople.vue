<template>
  <TheModal @close="$emit('close')">
    <div class="bg-white rounded-lg overflow-hidden">
      <div class="w-[400px] aspect-square flex flex-col">
        <div class="h-14 px-8 flex justify-start items-center">
          <h1 class="text-2xl font-bold">New message</h1>
        </div>

        <div class="grow flex flex-col">
          <div class="flex items-center h-12 border-b">
            <label
              for="searchPeople"
              class="h-full w-full flex items-stretch *:h-full"
            >
              <div class="pl-4 flex items-center">
                <FontAwesomeIcon
                  :icon="faMagnifyingGlass"
                  class="fa-lg pointer-events-none"
                />
              </div>
              <input
                type="text"
                class="p-4 outline-none border-0"
                placeholder="Search people"
                v-model="searchTerm"
                ref="input"
                @keydown.esc.stop="handleEscKey"
              />
            </label>
          </div>

          <div
            v-if="searchTerm.trim().length > 0"
            class="grow h-0 overflow-auto"
          >
            <div
              v-if="!results"
              class="flex flex-col justify-center items-center"
            >
              <UserSkeletonLoader :count="3" />
            </div>
            <div
              v-else-if="results.length === 0"
              class="h-full flex justify-center items-center"
            >
              <p class="text-neutral-500">No results found.</p>
            </div>
            <div v-else v-for="user in results" :key="user.userId">
              <div
                class="flex px-4 py-3 hover:bg-neutral-200/60 transition-colors"
              >
                <div class="grow">
                  <UserPlate
                    :isShowCard="false"
                    :user="{
                      username: user.username,
                      avatar: user.avatar,
                      displayName: user.displayName,
                      userId: user.userId,
                    }"
                    :widthAvatar="14"
                    :isLink="true"
                    @linkClicked="$emit('close')"
                  />
                </div>
                <div
                  v-if="user.userId !== userStore.user.uid"
                  class="flex items-center"
                >
                  <div
                    class="h-9 w-24 rounded-md cursor-pointer bg-blue-400 hover:bg-blue-500 transition-colors flex justify-center *:flex *:items-center *:select-none *:text-white"
                    @click.stop="contact(user.username)"
                  >
                    <div v-if="addingSpin"><span class="loading"></span></div>
                    <div v-else class="gap-2">
                      <FontAwesomeIcon
                        :icon="faPaperPlane"
                        class="fa-lg pointer-events-none"
                        @click=""
                      />
                      <p class="font-bold leading-9">Chat</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </TheModal>
</template>

<script setup>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  faMagnifyingGlass,
  faPaperPlane,
} from "@fortawesome/free-solid-svg-icons";

import TheModal from "../TheModal.vue";
import UserPlate from "../UserPlate.vue";
import UserSkeletonLoader from "../UserSkeletonLoader.vue";

import { ref, computed, onMounted, onBeforeUnmount, watch } from "vue";

const emits = defineEmits(["close"]);

import { useUserStore } from "../../stores/user";
const userStore = useUserStore();

import { useMessageStore } from "../../stores/message";
const messageStore = useMessageStore();

const results = computed(() => userStore.results);

const searchTerm = ref("");
const cleanSearchTerm = () => {
  searchTerm.value = "";
};

const handleEscKey = () => {
  if (searchTerm.value) {
    cleanSearchTerm();
    return;
  }

  emits("close");
};

const input = ref(null);

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

const addingSpin = ref(false);

const contact = async (username) => {
  addingSpin.value = true;
  const chatId = await messageStore.addContact({ username });

  emits("close");

  messageStore.loadMessages(chatId);
  messageStore.setCurrentChat(chatId);

  messageStore.toggle(true);
  messageStore.enterChat(true);
};

// Can't get the element from slots inside <TheModal /> on mounted
// watch it instead
watch(
  input,
  (newVal) => {
    newVal.focus();
  },
  { once: true }
);

const handleKeyDown = (e) => {
  if (e.key === "Escape") {
    emits("close");
  }
};

onMounted(() => {
  // input.value.focus();

  window.addEventListener("keydown", handleKeyDown);
});

onBeforeUnmount(() => {
  userStore.cleanResults();

  window.removeEventListener("keydown", handleKeyDown);
});
</script>

<style scoped>
.grid {
  grid-template-rows: min-content 1fr;
}
</style>
