<template>
  <NavBarMobile
    v-if="isMobile"
    :avatar="user?.photoURL"
    :profilePageURL="profilePageURL"
    :isLoggedIn="userStore.isLoggedIn"
  />

  <NavBarSliding v-else @turn="changeDirection" @scroll="changePosition">
    <nav
      class="navbar px-4 lg:px-[10dvw] z-10"
      :class="{ '!shadow-none border-b': $route.name !== 'home' }"
    >
      <div class="flex">
        <router-link to="/"><Logo /></router-link>
      </div>

      <Search :direction="direction" :navbarPosition="navbarPosition" />

      <div v-if="userStore.isLoggedIn" class="navItems">
        <div
          v-if="$route.name === 'home' || $route.name === 'profile'"
          class="cursor-pointer rounded-lg overflow-hidden h-12 aspect-square bg-white hover:bg-neutral-100 active:bg-neutral-200 active:scale-95 transition-[background-color,_transform]"
          @click="publishPost"
        >
          <div
            class="pointer-events-none size-full flex justify-center items-center"
          >
            <FontAwesomeIcon :icon="faSquarePlus" class="scale-[.80]" />
          </div>
        </div>

        <div class="profileDropDown" ref="avatarIcon">
          <TheAvatar
            :src="user?.photoURL"
            :width="42"
            style="cursor: pointer"
            @click="isShowDropdown = !isShowDropdown"
          />
          <Transition name="menu">
            <ProfileIconMenu
              v-if="
                isShowDropdown &&
                (!direction || navbarPosition === 'expanded') &&
                navbarPosition !== 'folded'
              "
              :profilePageURL="profilePageURL"
              :avatar="avatarIcon"
              @close="isShowDropdown = false"
              @logout="logout"
            />
          </Transition>
        </div>
      </div>
      <div v-else class="justify-self-end flex">
        <LoginButton />
      </div>
    </nav>
  </NavBarSliding>

  <PostUpload v-if="userStore.isLoggedIn && isShowPostUpload" />
</template>

<script setup>
import { logOut } from "../firebase/auth";

import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faSquarePlus } from "@fortawesome/free-regular-svg-icons";

import Logo from "./Logo.vue";
import NavBarMobile from "./NavBar/NavBarMobile.vue";
import TheAvatar from "./TheAvatar.vue";
import NavBarSliding from "./NavBar/NavBarSliding.vue";
import Search from "./Search.vue";
import PostUpload from "./PostUpload/PostUpload.vue";
import ProfileIconMenu from "./NavBar/ProfileIconMenu.vue";
import LoginButton from "./NavBar/LoginButton.vue";

// import { userListener, getUser, updateUser } from "../firebase/firestore.js";

const props = defineProps(["isMobile"]);

import { ref, computed, onMounted } from "vue";

const isShowDropdown = ref(false);

const avatarIcon = ref(null);

const navbarHeight = ref(80);

import { useRouter } from "vue-router";
const router = useRouter();

import { usePostStore } from "../stores/post";
const postStore = usePostStore();

const isShowPostUpload = computed(() => postStore.isShowPostUpload);

function publishPost() {
  postStore.toggleShowPostUpload(true);
}

import { useUserStore } from "../stores/user";
const userStore = useUserStore();
// const userPnia = computed(() => userStore.user);

// real-time listenser only accessible in template
// const user = userListener(userPnia.value.uid);
const user = computed(() => userStore.user);

// const userDoc = computed(() => userStore.userDoc);

const profilePageURL = computed(() => {
  if (userStore.userDoc) {
    return "/" + userStore.userDoc.username;
  }

  return "/";
});

import { useMessageStore } from "../stores/message";
const messageStore = useMessageStore();

import { useAlertStore } from "../stores/alert";
const alertStore = useAlertStore();

// onMounted(async () => {
//   // if (userPnia.value) {
//   // await userStore.getUserDoc(userPnia.value.uid);
//   // }
// });

async function logout() {
  postStore.resetIsActedByMe();
  // postStore.cleanPostsAll();

  //
  messageStore.reset();

  alertStore.reset();

  await logOut();
  router.push("/login");
}

const direction = ref(null);

const changeDirection = (bool) => {
  direction.value = bool;
};

const navbarPosition = ref(0);

const changePosition = (position) => {
  navbarPosition.value = position;
};
</script>

<style scoped>
.navbar {
  width: 100dvw;
  background: white;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 375px 1fr;
  align-items: center;
  box-shadow: 0px 4px 24px rgba(0, 0, 0, 0.08);
  height: v-bind(navbarHeight + "px");
}

@screen max-md {
  .navbar {
    grid-template-columns: auto 1fr auto;
  }
}

.navbar svg {
  width: 38px;
  height: 38px;
}

:deep(.button.immerse) {
  color: rgb(214, 50, 50);
  padding: 6px;
  font-size: 14px;
}

.navItems {
  justify-self: end;
  display: flex;
  align-items: center;
  @apply gap-4 md:gap-6;
}

.navItems > button {
  border: none;
  background: none;
}

.profileDropDown {
  position: relative;
}

.menu-enter-active,
.menu-leave-active {
  transition: opacity 0.15s ease;
}

.menu-enter-from,
.menu-leave-to {
  opacity: 0;
}
</style>
