<template>
  <div
    class="absolute top-full w-full max-h-[360px] mt-1 rounded-xl overflow-hidden border shadow-lg flex flex-col"
  >
    <div class="grow h-full overflow-auto bg-white *:min-h-[88px] *:w-full">
      <div v-if="!results" class="flex flex-col justify-center items-center">
        <UserSkeletonLoader :count="2" />
      </div>
      <div
        v-else-if="results.length === 0"
        class="flex justify-center items-center h-[160px]"
      >
        <p class="text-neutral-500">No results found.</p>
      </div>
      <div v-else class="flex flex-col justify-center">
        <router-link
          v-for="user in results"
          :key="user.userId"
          :to="'/' + user.username"
        >
          <div
            class="hover:bg-slate-100 cursor-pointer py-3 px-4"
            @click="$emit('resultClicked')"
          >
            <UserPlate
              :isShowCard="false"
              :user="{
                username: user.username,
                avatar: user.avatar,
                displayName: user.displayName,
                userId: user.userId,
              }"
              :widthAvatar="14"
              :isLink="false"
            /></div
        ></router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import UserSkeletonLoader from "./UserSkeletonLoader.vue";

import UserPlate from "./UserPlate.vue";

import { computed } from "vue";

import { useUserStore } from "../stores/user";
const userStore = useUserStore();

defineEmits(["resultClicked"]);

const results = computed(() => userStore.results);
</script>

<style scoped></style>
