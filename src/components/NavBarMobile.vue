<template>
  <div class="fixed bottom-0 z-10">
    <div class="w-screen bg-white border-t">
      <div class="h-12 flex justify-evenly">
        <!-- home -->
        <div class="h-full aspect-square flex justify-center items-center">
          <FontAwesomeIcon :icon="faHouse" class="text-2xl text-neutral-300" />
        </div>

        <!-- search -->
        <div class="h-full aspect-square flex justify-center items-center">
          <FontAwesomeIcon :icon="faMagnifyingGlass" class="text-2xl" />
        </div>

        <!-- upload -->
        <div
          class="h-full aspect-square flex justify-center items-center"
          @click="postStore.toggleShowPostUpload(true)"
        >
          <FontAwesomeIcon :icon="faSquarePlus" class="text-2xl" />
        </div>

        <!-- message -->
        <div class="h-full aspect-square flex justify-center items-center">
          <FontAwesomeIcon :icon="faPaperPlane" class="text-2xl" />
        </div>

        <!-- profile -->
        <div class="h-full aspect-square flex justify-center items-center">
          <router-link :to="profilePageURL">
            <div class="rounded-full border-2 border-black flex">
              <div class="w-6 aspect-square rounded-full">
                <TheAvatar :src="avatar" :width="24" style="cursor: pointer" />
              </div></div
          ></router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faHouse, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import {
  faSquarePlus,
  faPaperPlane,
} from "@fortawesome/free-regular-svg-icons";

// import AvatarLink from "./AvatarLink.vue";
import TheAvatar from "./TheAvatar.vue";

import { logOut } from "../firebase/auth";

import { useRouter } from "vue-router";
const router = useRouter();

import { usePostStore } from "../stores/post";
const postStore = usePostStore();

const props = defineProps(["avatar", "profilePageURL"]);

import { ref, computed, onMounted } from "vue";
</script>

<style scoped></style>
