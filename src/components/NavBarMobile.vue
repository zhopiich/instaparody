<template>
  <div class="fixed bottom-0 left-0 right-0 w-screen z-10">
    <div class="bg-white">
      <div
        v-if="isShowSearch"
        class="full-platform absolute bottom-full w-full"
      >
        <SearchMobile @resultClicked="isShowSearch = false" />
      </div>

      <div class="border-t">
        <div class="h-navbar flex justify-evenly">
          <!-- home -->
          <div class="h-full aspect-square flex justify-center items-center">
            <FontAwesomeIcon
              :icon="faHouse"
              class="text-2xl text-neutral-300"
            />
          </div>

          <!-- search -->
          <div
            class="h-full aspect-square flex justify-center items-center"
            @click="isShowSearch = !isShowSearch"
          >
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
                  <TheAvatar
                    :src="avatar"
                    :width="24"
                    style="cursor: pointer"
                  />
                </div></div
            ></router-link>
          </div>
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

import TheAvatar from "./TheAvatar.vue";
import SearchMobile from "./SearchMobile.vue";

import { logOut } from "../firebase/auth";

import { useRouter } from "vue-router";
const router = useRouter();

import { usePostStore } from "../stores/post";
const postStore = usePostStore();

const props = defineProps(["avatar", "profilePageURL"]);

import { ref, computed, onMounted } from "vue";

const navbarHeight = ref(48);

const isShowSearch = ref(false);
</script>

<style scoped>
body {
  overflow: hidden;
}

.h-navbar {
  height: v-bind(navbarHeight + "px");
}

.full-platform {
  height: calc(100dvh - v-bind(navbarHeight + "px") - 1px);
}
</style>
