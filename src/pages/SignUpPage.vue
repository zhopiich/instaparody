<template>
  <div class="grow size-full flex flex-col justify-center items-center">
    <div
      class="sm:mt-8 w-screen sm:w-[420px] sm:border flex flex-col items-center"
    >
      <div class="mb-3 mt-14 sm:mt-16">
        <Logo :fontSize="40" :lineHeight="54" />
      </div>

      <div class="w-full mt-6">
        <form @submit.prevent>
          <div class="flex flex-col">
            <div class="my-2 mx-9">
              <TheLabel
                placeholder="Email"
                :isFocus="isEmailFocus"
                :isOccupied="email"
                :isError="emailErrorType"
              >
                <input
                  class=""
                  type="email"
                  name="email"
                  @focus="isEmailFocus = true"
                  @blur="isEmailFocus = false"
                  @input="emailErrorType = null"
                  @change="validateEmail"
                  v-model="email"
                />
              </TheLabel>

              <div class="px-2 pt-1 text-sm leading-4">
                <span v-if="emailErrorType" class="break-words text-red-500">{{
                  emailErrorsList[emailErrorType]
                }}</span>
              </div>
            </div>
            <div class="my-2 mx-9">
              <TheLabel
                placeholder="Username"
                :isFocus="isUsernameFocus"
                :isOccupied="username"
                :isError="usernameErrorType"
                :isLengthShown="true"
                :currentLength="username ? username.length : 0"
                :maxLength="20"
              >
                <input
                  class="usernameInput"
                  placeholder="Your username should be unique"
                  type="text"
                  name="username"
                  maxlength="20"
                  @focus="isUsernameFocus = true"
                  @blur="isUsernameFocus = false"
                  @input="validateUsername"
                  @change="validateUsernameEnd"
                  v-model="username"
                />
              </TheLabel>

              <div class="px-2 pt-1 text-sm leading-4">
                <span
                  v-if="usernameErrorType"
                  class="break-words text-red-500"
                  >{{ usernameErrorsList[usernameErrorType] }}</span
                >
              </div>
            </div>
            <div class="my-2 mx-9">
              <TheLabel
                placeholder="Password"
                :isFocus="isPasswordFocus"
                :isOccupied="password"
                :isError="passwordErrorType"
              >
                <input
                  type="password"
                  name="password"
                  @focus="isPasswordFocus = true"
                  @blur="isPasswordFocus = false"
                  @input="
                    () => {
                      passwordErrorType = null;
                      isConfirmPasswordError = false;
                    }
                  "
                  @change="validatePassword"
                  v-model="password"
                />
              </TheLabel>

              <div class="px-2 py-1 text-sm leading-4">
                <span
                  v-if="passwordErrorType"
                  class="break-words text-red-500"
                  >{{ passwordErrorsList[passwordErrorType] }}</span
                >
              </div>
              <TheLabel
                placeholder="Confirm password"
                :isFocus="isConfirmPasswordFocus"
                :isOccupied="confirmPassword"
                :isError="isConfirmPasswordError"
              >
                <input
                  type="password"
                  name="confirmPassword"
                  @focus="isConfirmPasswordFocus = true"
                  @blur="isConfirmPasswordFocus = false"
                  @input="isConfirmPasswordError = false"
                  @change="comparePasswords"
                  v-model="confirmPassword"
                />
              </TheLabel>

              <div class="px-2 pt-1 text-sm leading-4">
                <span
                  v-if="isConfirmPasswordError"
                  class="break-words text-red-500"
                  >Passwords do not match.</span
                >
              </div>
            </div>

            <div class="mt-4 mx-9 sm:mx-12">
              <p class="text-center text-sm text-neutral-500">
                By signing up, you agree to our
                <span class="text-blue-600">Terms</span>,
                <span class="text-blue-600">Privacy Policy</span> and
                <span class="text-blue-600">Cookies Policy</span>.
              </p>
            </div>

            <div class="my-4 mx-9">
              <TheButton
                :height="40"
                width="full"
                :isDisable="
                  !isAllOccupied ||
                  !isAllValid ||
                  password.length < 8 ||
                  isLoading
                "
                :isLoading="isLoading"
                @click="handleSignUp"
                >Sign up</TheButton
              >
            </div>
          </div>
        </form>
      </div>
    </div>

    <div
      class="sm:mt-4 px-9 py-[10px] w-screen sm:w-[420px] sm:border flex justify-center"
    >
      <p class="my-[15px]">
        Have an account?
        <router-link to="/login"
          ><span class="text-blue-500 font-semibold">Log in</span></router-link
        >
      </p>
    </div>
  </div>
</template>

<script setup>
import { signUp } from "../firebase/auth";
import { isEmailValid, isUsernameValid } from "../utils/validation";

import Logo from "../components/Logo.vue";
import TheLabel from "../components/TheLabel.vue";
import TheButton from "../components/TheButton.vue";

import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useMessageStore } from "../stores/message";
import { useUserStore } from "../stores/user";

const router = useRouter();

const isLoading = ref(false);

const email = ref(null);
const isEmailFocus = ref(false);

const username = ref(null);
const isUsernameFocus = ref(false);

const password = ref(null);
const isPasswordFocus = ref(false);

const confirmPassword = ref(null);
const isConfirmPasswordError = ref(false);
const isConfirmPasswordFocus = ref(false);

const isAllOccupied = computed(
  () => email.value && username.value && password.value && confirmPassword.value
);

const emailErrorType = ref(null);
const emailErrorsList = {
  invalid: "Please enter a valid email address.",
  inUse: "This email is already in use. Please try another.",
};
const validateEmail = () => {
  if (!email.value || !email.value.length) return;

  if (!isEmailValid(email.value)) {
    emailErrorType.value = "invalid";
  }
};

const usernameErrorType = ref(null);
const usernameErrorsList = {
  startInvalid: "Your username can't start with a period or space.",
  endInvalid: "Your username can't end with a period.",
  twoDotInRow: "Your username can't have more than one period in a row.",
  notAllowed:
    "Your username can only contain letters, numbers, underscores and periods.",
  tooShort:
    "Your username needs to be at least 6 characters. Please enter a longer one.",
  inUse: "This username is already in use. Please try another.",
};
const validateUsername = () => {
  if (!username.value || !username.value.length) {
    usernameErrorType.value = null;
    return;
  }

  if (!isUsernameValid.start(username.value)) {
    usernameErrorType.value = "startInvalid";
    return;
  }

  if (!isUsernameValid.oneDotInRow(username.value)) {
    usernameErrorType.value = "twoDotInRow";
    return;
  }

  if (!isUsernameValid.onlyAllowed(username.value)) {
    usernameErrorType.value = "notAllowed";
    return;
  }

  usernameErrorType.value = null;
};
const validateUsernameEnd = () => {
  if (!username.value || !username.value.length) return;
  if (usernameErrorType.value) return;

  if (!isUsernameValid.end(username.value)) {
    usernameErrorType.value = "endInvalid";
    return;
  }

  if (username.value.length < 6) {
    usernameErrorType.value = "tooShort";
  }
};

const passwordErrorType = ref(null);
const passwordErrorsList = {
  tooShort:
    "Your password needs to be at least 8 characters. Please enter a longer one.",
};
const comparePasswords = () => {
  if (!confirmPassword.value || !confirmPassword.value.length) return;
  if (passwordErrorType.value) return;

  if (password.value !== confirmPassword.value) {
    isConfirmPasswordError.value = true;
  }
};
const validatePassword = () => {
  if (!password.value || !password.value.length) return;

  if (password.value.length < 8) {
    passwordErrorType.value = "tooShort";
    return;
  }

  comparePasswords();
};

const isAllValid = computed(
  () =>
    !emailErrorType.value &&
    !usernameErrorType.value &&
    !passwordErrorType.value &&
    !isConfirmPasswordError.value
);

const handleSignUp = async () => {
  validateEmail();
  validateUsername();
  validateUsernameEnd();
  validatePassword();
  if (!isAllOccupied.value || !isAllValid.value) return;

  isLoading.value = true;

  const userStore = useUserStore();
  const userSnap = await userStore.getUserInfo({ username: username.value });

  if (userSnap !== "noSuchUser") {
    usernameErrorType.value = "inUse";
    isLoading.value = false;
    return;
  }

  const res = await signUp({
    email: email.value.trim(),
    username: username.value.trim(),
    password: password.value,
  });

  if (res) {
    if (res.includes("email") && res.includes("use")) {
      emailErrorType.value = "inUse";
    }

    isLoading.value = false;
  } else {
    const messageStore = useMessageStore();
    messageStore.loadContacts();

    await userStore.getUserDoc();

    router.replace("/");
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

input.usernameInput::placeholder {
  opacity: 0;
}

input.usernameInput:focus::placeholder {
  opacity: 1;
}
</style>
