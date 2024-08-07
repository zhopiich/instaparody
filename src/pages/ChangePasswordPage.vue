<template>
  <div class="mt-4 px-4 w-full max-w-[548px] flex flex-col">
    <div class="my-4 flex flex-col justify-center items-start">
      <h2 class="font-bold text-xl">Change password</h2>
      <div>
        <span class="text-slate-500 text-base"
          >@{{ userStore.userDoc?.username }}</span
        >
      </div>

      <div v-if="isDemoAccount" class="mt-1.5">
        <span class="text-red-500"
          ><FontAwesomeIcon class="mr-1.5" :icon="faCircleExclamation" />The
          demo account password cannot be changed.</span
        >
      </div>
    </div>

    <div class="my-3 w-full">
      <TheLabel
        placeholder="Current password"
        :isFocus="isCurrentPasswordFocus"
        :isOccupied="currentPassword"
        :isError="isCurrentPasswordError"
      >
        <input
          type="password"
          @focus="isCurrentPasswordFocus = true"
          @blur="isCurrentPasswordFocus = false"
          @input="correctPassword"
          v-model="currentPassword"
        />
      </TheLabel>

      <div class="px-2 pt-1 text-sm leading-4">
        <span v-if="isCurrentPasswordError" class="break-words text-red-500"
          >The password you entered was incorrect.</span
        >
      </div>
    </div>

    <div class="h-0 border-t my-1 -mx-4 md:mx-0"></div>

    <div class="my-3 w-full">
      <TheLabel
        placeholder="New password"
        :isFocus="isNewPasswordFocus"
        :isOccupied="newPassword"
        :isError="isNewPasswordError"
      >
        <input
          type="password"
          @focus="isNewPasswordFocus = true"
          @blur="isNewPasswordFocus = false"
          @input="correctPassword"
          v-model="newPassword"
        />
      </TheLabel>

      <div class="px-2 pt-1 text-sm leading-4">
        <span v-if="isNewPasswordError" class="break-words text-red-500"
          >Your password needs to be at least 8 characters. Please enter a
          longer one.</span
        >
      </div>
    </div>

    <div class="my-3 w-full">
      <TheLabel
        placeholder="Confirm password"
        :isFocus="isConfirmPasswordFocus"
        :isOccupied="confirmPassword"
        :isError="isConfirmPasswordError"
      >
        <input
          type="password"
          @focus="isConfirmPasswordFocus = true"
          @blur="isConfirmPasswordFocus = false"
          @input="correctPassword"
          v-model="confirmPassword"
        />
      </TheLabel>

      <div class="px-2 pt-1 text-sm leading-4">
        <span v-if="isConfirmPasswordError" class="break-words text-red-500"
          >Passwords do not match.</span
        >
      </div>
    </div>

    <div class="h-0 border-t my-1 -mx-4 md:mx-0"></div>

    <div class="flex justify-center md:justify-end">
      <div class="mt-4 flex flex-col md:flex-row gap-4">
        <TheButton
          :height="40"
          :width="180"
          :isDisable="isDemoAccount || !isAllOccupied || isLoading"
          :isLoading="isLoading"
          @click="handleChangePassword"
          >Change password</TheButton
        >
      </div>
    </div>
  </div>
</template>

<script setup>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";

import { changePassword } from "../firebase/auth";

import TheLabel from "../components/TheLabel.vue";
import TheButton from "../components/TheButton.vue";

import { ref, computed, onMounted, toRefs, onBeforeMount } from "vue";

import { useUserStore } from "../stores/user";
const userStore = useUserStore();

import { useAlertStore } from "../stores/alert";
const alertStore = useAlertStore();

const isLoading = ref(false);

const isCurrentPasswordFocus = ref(false);
const isNewPasswordFocus = ref(false);
const isConfirmPasswordFocus = ref(false);

const isCurrentPasswordError = ref(false);
const isNewPasswordError = ref(false);
const isConfirmPasswordError = ref(false);

const correctPassword = () => {
  if (
    !isCurrentPasswordError.value &&
    !isNewPasswordError.value &&
    !isConfirmPasswordError.value
  )
    return;

  isCurrentPasswordError.value = false;
  isNewPasswordError.value = false;
  isConfirmPasswordError.value = false;
};

const currentPassword = ref(null);
const newPassword = ref(null);
const confirmPassword = ref(null);

const isAllOccupied = computed(
  () => currentPassword.value && newPassword.value && confirmPassword.value
);

const isNewPasswordValid = () => newPassword.value.length >= 8;
const isConfirmPasswordValid = () =>
  newPassword.value === confirmPassword.value;

const handleChangePassword = async () => {
  if (
    isDemoAccount.value ||
    isCurrentPasswordError.value ||
    isNewPasswordError.value ||
    isConfirmPasswordError.value
  )
    return;

  if (!isNewPasswordValid()) {
    isNewPasswordError.value = true;
    return;
  }

  if (!isConfirmPasswordValid()) {
    isConfirmPasswordError.value = true;
    return;
  }

  isLoading.value = true;

  const result = await changePassword(
    userStore.user.email,
    currentPassword.value,
    newPassword.value
  );

  switch (result) {
    case "passwordChanged":
      currentPassword.value = null;
      newPassword.value = null;
      confirmPassword.value = null;

      alertStore.addAlert({
        content: "Your password has been successfully updated.",
      });
      break;
    case "incorrectPassword":
      isCurrentPasswordError.value = true;
      break;
    case "error":
      console.log("Error");
      break;
  }

  isLoading.value = false;
};

const demoAccounts = [
  "demo_01@email.com",
  "demo_02@email.com",
  "demo_03@email.com",
];
const isDemoAccount = computed(() =>
  demoAccounts.some((email) => email === userStore.user.email)
);
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
