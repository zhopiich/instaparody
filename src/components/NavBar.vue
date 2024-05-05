<template>
  <NavBarMobile
    v-if="isMobile"
    :avatar="user?.photoURL"
    :profilePageURL="profilePageURL"
  />

  <NavBarSliding v-else @turn="changeDirection" @scroll="changePosition">
    <nav class="navbar z-10">
      <router-link class="logo" to="/"
        ><img src="../assets/logo.svg"
      /></router-link>

      <Search :direction="direction" :navbarPosition="navbarPosition" />

      <div class="navItems">
        <button
          v-if="$route.name === 'home' || $route.name === 'profile'"
          @click="publishPost"
        >
          <TheIcon icon="publish" />
        </button>

        <div class="profileDropDown">
          <TheAvatar
            :src="user?.photoURL"
            :width="42"
            style="cursor: pointer"
            @click="isShowDropdown = !isShowDropdown"
          />
          <div
            class="dropdownMenu"
            v-show="isShowDropdown"
            @click="isShowDropdown = false"
          >
            <ul class="profileMenu">
              <li><router-link :to="profilePageURL">My Page</router-link></li>
              <li @click="logout">Log Out</li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  </NavBarSliding>
</template>

<script setup>
import { logOut } from "../firebase/auth";

import NavBarMobile from "./NavBarMobile.vue";
import TheAvatar from "./TheAvatar.vue";
import TheIcon from "./TheIcon.vue";
import TheButton from "./TheButton.vue";
import NavBarSliding from "./NavBarSliding.vue";
import Search from "./Search.vue";

// import { userListener, getUser, updateUser } from "../firebase/firestore.js";

const props = defineProps(["isMobile"]);

import { ref, computed, onMounted } from "vue";

const isShowDropdown = ref(false);

import { useRouter } from "vue-router";
const router = useRouter();

import { usePostStore } from "../stores/post";
const postStore = usePostStore();

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
  @apply h-16 md:h-20 max-sm:px-2 px-4 lg:px-[10dvw];
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

.profileMenu {
  position: absolute;
  width: max-content;
  padding: 24px 26px;
  list-style: none;
  background: white;
  box-shadow: 0px 0px 24px rgba(0, 0, 0, 0.08);
  border-radius: 4px;
  right: 0;
  display: grid;
  row-gap: 18px;
  transform: translateY(18px);
}

.profileMenu::before {
  content: "";
  display: block;
  position: absolute;
  width: 0;
  height: 0;
  top: -12px;
  right: 10px;
  border-bottom: 12px solid white;
  border-left: 12px solid transparent;
  border-right: 12px solid transparent;
}

.profileMenu a,
.profileMenu li {
  text-decoration: none;
  cursor: pointer;
}

.profileMenu a:visited {
  color: initial;
}
</style>
