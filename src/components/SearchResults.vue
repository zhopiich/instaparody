<template>
  <div
    class="absolute top-full w-full mt-1 rounded-xl overflow-hidden border shadow-lg"
  >
    <div class="bg-white min-h-[88px] py-2.5 flex items-center *:w-full">
      <div v-if="!results" class="flex justify-center items-center">
        <span class="loading"></span>
      </div>
      <div
        v-else-if="results.length === 0"
        class="flex justify-center items-center"
      >
        <p class="text-neutral-500">No results found.</p>
      </div>
      <div v-else class="flex flex-col">
        <router-link
          v-for="user in results"
          :key="user.userId"
          :to="'/' + user.username"
        >
          <div
            @click="$emit('resultClicked')"
            class="hover:bg-slate-100 cursor-pointer py-1.5 px-4"
          >
            <UserPlate
              :isCardFixed="true"
              :user="{
                username: user.username,
                avatar: user.avatar,
                displayName: user.displayName,
                userId: user.userId,
              }"
              :widthAvatar="14"
              :isLink="false"
            />
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import UserPlate from "./UserPlate.vue";

import { computed } from "vue";

import { useUserStore } from "../stores/user";
const userStore = useUserStore();

defineEmits(["resultClicked"]);

const results = computed(() => userStore.results);
</script>

<style scoped></style>
