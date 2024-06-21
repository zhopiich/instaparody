<template>
  <div class="grow size-full flex flex-col justify-center items-center">
    <div
      v-if="true"
      class="mt-8 w-screen sm:w-[420px] sm:border flex flex-col items-center"
    >
      <div class="w-full flex items-start fixed top-0 sm:static">
        <div
          class="m-2 flex items-center justify-center h-9 aspect-square rounded-full cursor-pointer hover:bg-neutral-300/50 active:bg-neutral-300/35 active:text-neutral-500 transition-colors"
          @click="back"
        >
          <FontAwesomeIcon
            :icon="faArrowLeft"
            class="fa-xl scale-90 pointer-events-none"
          />
        </div>
      </div>
      <div class="my-3"><img src="../assets/logo.svg" alt="" /></div>

      <div class="w-full mt-6">
        <form @submit.prevent>
          <div class="flex flex-col">
            <div class="my-2 mx-9">
              <TheLabel
                placeholder="Email"
                :isFocus="isEmailFocus"
                :isOccupied="email"
                :isError="isEmailError"
              >
                <input
                  class=""
                  type="text"
                  name="email"
                  @focus="isEmailFocus = true"
                  @blur="isEmailFocus = false"
                  @input=""
                  v-model="email"
                />
              </TheLabel>
            </div>
            <div class="my-2 mx-9">
              <TheLabel
                placeholder="Password"
                :isFocus="isPasswordFocus"
                :isOccupied="password"
                :isError="isPasswordError"
              >
                <input
                  type="password"
                  name="password"
                  @focus="isPasswordFocus = true"
                  @blur="isPasswordFocus = false"
                  @input=""
                  v-model="password"
                />
              </TheLabel>
            </div>

            <div class="my-4 mx-9">
              <TheButton
                :height="40"
                width="full"
                :isDisable="!isBothOccupied || isLoading"
                :isLoading="isLoading"
                @click="login"
                >Log in</TheButton
              >
            </div>
          </div>
        </form>
      </div>
    </div>

    <div
      class="mt-4 px-9 py-[10px] w-screen sm:w-[420px] sm:border flex justify-center"
    >
      <div v-if="errorType" class="flex flex-col">
        <p class="my-[15px] text-red-500">
          <span>
            <FontAwesomeIcon :icon="faCircleExclamation" />
          </span>
          {{ errorMessagesList[errorType] }}
        </p>

        <div class="w-full flex items-center">
          <div class="grow h-0 border-t"></div>
          <div class="mx-4"><span class="text-neutral-400">OR</span></div>
          <div class="grow h-0 border-t"></div>
        </div>

        <div class="my-[15px] flex justify-center">
          <router-link to="/signup"
            ><span class="text-blue-500 font-semibold"
              >Create a new account</span
            ></router-link
          >
        </div>
      </div>

      <p v-else class="my-[15px]">
        Don't have an account?
        <router-link to="/signup"
          ><span class="text-blue-500 font-semibold">Sign Up</span></router-link
        >
      </p>
    </div>
  </div>
</template>

<script setup>
import { signIn } from "../firebase/auth";

import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  faArrowLeft,
  faCircleExclamation,
} from "@fortawesome/free-solid-svg-icons";

import TheLabel from "../components/TheLabel.vue";
import TheButton from "../components/TheButton.vue";

import { ref, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useMessageStore } from "../stores/message";
import { useUserStore } from "../stores/user";

const isLoading = ref(false);

const email = ref(null);
const isEmailError = ref(false);
const isEmailFocus = ref(false);

const password = ref(null);
const isPasswordError = ref(false);
const isPasswordFocus = ref(false);

const isBothOccupied = computed(() => email.value && password.value);

const route = useRoute();
const router = useRouter();

const errorType = ref(null);
const errorMessagesList = {
  typo: "The email and password you entered did not match our records. Please double-check and try again.",
  // tooManyRequests:
  //   "This account has been temporarily disabled due to many failed login attempts. Please try again later.",
};

const login = async () => {
  if (!email.value || !password.value) return;
  isLoading.value = true;

  const res = await signIn(email.value, password.value);

  if (res) {
    // if (
    //   res.includes("invalid") &&
    //   (res.includes("email") || res.includes("credential"))
    // ) {
    errorType.value = "typo";
    // } else if (res.includes("many") && res.includes("requests")) {
    //   errorType.value = "tooManyRequests";
    // }

    isLoading.value = false;
  } else {
    const messageStore = useMessageStore();
    messageStore.loadContacts();

    const userStore = useUserStore();
    await userStore.getUserDoc();

    router.replace("/");
  }
};

let prevPath;
watch(
  () => route.params.postId,
  () => {
    prevPath = router.options.history.state.back;
  },
  { immediate: true }
);

const back = () => {
  if (prevPath) {
    router.back();
  } else {
    router.push("/");
  }
};
</script>

<style scoped>
input {
  width: 100%;
  height: 100%;
  padding: 0px;
  resize: none;
  appearance: none;
  text-align: left;
  outline: none;
  border: none;
  border-radius: 0px;
}
</style>
