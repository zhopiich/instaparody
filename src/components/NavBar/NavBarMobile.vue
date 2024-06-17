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
          <div
            v-for="item in menuList"
            class="h-full aspect-square flex justify-center items-center *:select-none"
          >
            <div
              class="h-9 aspect-square rounded-full overflow-hidden"
              @click="item.name !== 'Search' && closeSearch()"
            >
              <router-link v-if="item.to" :to="item.to">
                <div
                  class="size-full flex justify-center items-center hover:bg-neutral-200 active:scale-90 transition-all cursor-pointer"
                >
                  <FontAwesomeIcon
                    :icon="item.icon"
                    class="text-lg"
                    :class="item.isActive ? 'text-black' : 'text-neutral-400'"
                  /></div
              ></router-link>

              <div
                v-else
                class="size-full flex justify-center items-center hover:bg-neutral-200 active:scale-90 transition-all cursor-pointer"
                @click="item.clickHandler"
              >
                <FontAwesomeIcon
                  :icon="item.icon"
                  class="text-lg"
                  :class="item.isActive ? 'text-black' : 'text-neutral-400'"
                />
              </div>
            </div>
          </div>

          <div
            class="h-full aspect-square flex justify-center items-center *:select-none"
          >
            <div class="flex rounded-full overflow-hidden" @click="closeSearch">
              <router-link :to="isLoggedIn ? profilePageURL : '/login'">
                <div
                  class="rounded-full border-2 active:scale-90 transition-all flex"
                  :class="
                    route.params.username === profilePageURL.substring(1)
                      ? 'border-black'
                      : 'border-transparent hover:border-neutral-300'
                  "
                >
                  <div class="w-8 aspect-square rounded-full">
                    <TheAvatar
                      :src="avatar"
                      :width="32"
                      style="cursor: pointer"
                    />
                  </div></div
              ></router-link>
            </div>
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

import TheAvatar from "../TheAvatar.vue";
import SearchMobile from "../SearchMobile.vue";

import { logOut } from "../../firebase/auth";

import { useRoute } from "vue-router";

const route = useRoute();

import { usePostStore } from "../../stores/post";
const postStore = usePostStore();

const props = defineProps(["avatar", "profilePageURL", "isLoggedIn"]);

import { ref, computed } from "vue";

const navbarHeight = ref(48);

const isShowSearch = ref(false);

const closeSearch = () => {
  if (!isShowSearch.value) return;
  isShowSearch.value = false;
};

const toggleSearch = () => {
  isShowSearch.value = !isShowSearch.value;
};

const togglePost = () => {
  postStore.toggleShowPostUpload(!postStore.isShowPostUpload);
};

const menuList = computed(() =>
  [
    {
      icon: faHouse,
      to: "/",
      name: "Home",
      isActive: route.name === "home",
    },
    {
      icon: faMagnifyingGlass,
      clickHandler: toggleSearch,
      name: "Search",
      isActive: isShowSearch.value,
    },
    {
      icon: faSquarePlus,
      clickHandler: togglePost,
      name: "Post",
      isActive: postStore.isShowPostUpload,
    },
    {
      icon: faPaperPlane,
      to: "/messages",
      name: "Messages",
      isActive: route.name === "messages",
    },
  ].filter((item) => item.name !== "Post" || props.isLoggedIn)
);
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
