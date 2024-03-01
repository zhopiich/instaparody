<template>
  <div class="loginPage">
    <img src="#" alt="" class="phoneImage" />
    <div class="loginForm">
      <img src="../assets/logo.svg" alt="" />
      <form @submit.prevent>
        <input type="email" placeholder="Email" v-model="email" />
        <input
          v-if="!isLogin"
          type="text"
          placeholder="Username"
          v-model="username"
        />
        <input type="password" placeholder="Password" v-model="password" />
        <button
          type="submit"
          class="loginButton"
          @click="isLogin ? login() : register()"
        >
          {{ isLogin ? "Login" : "Sign Up" }}
        </button>
        <p v-if="isLogin">
          New to here? <span class="info" @click="toggleLogin">Sign Up</span>
        </p>
        <p v-else>
          Have been here? <span class="info" @click="toggleLogin">Login</span>
        </p>
        <div v-if="!isLogin" class="agreement">
          <input type="checkbox" v-model="agreementChecked" />
          <p>
            Check to indicate your agreement with
            <span class="info">Privacy Policy</span> and
            <span class="info">Terms of Use</span>.
          </p>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "../stores/user";

import { signIn, signUp } from "../firebase/auth";

const isLogin = ref(true);

const email = ref("");
const username = ref("");
const password = ref("");
const agreementChecked = ref(false);

const router = useRouter();

const userStore = useUserStore();

async function register() {
  if (!agreementChecked.value) {
    alert("Please read and agree to Privacy Policy and Terms of Use.");
    return;
  }

  const { isErr, msg } = await signUp({
    email: email.value,
    username: username.value,
    password: password.value,
  });

  if (!isErr) {
    await userStore.getUserDoc();
    // router.push("/");
    router.replace("/");
  } else {
    err.value = msg;
  }
}

async function login() {
  const { isErr, msg } = await signIn(email.value, password.value);

  if (!isErr) {
    await userStore.getUserDoc();
    // router.push("/");
    router.replace("/");
  } else {
    // err.value = msg;
    console.log("error: ", msg);
  }
}

const toggleLogin = () => {
  isLogin.value = !isLogin.value;
};
</script>

<style scoped>
.loginPage {
  display: grid;
  align-items: center;
  gap: 3vw;
  width: 100vw;
  height: 100dvh;
  min-width: 370px;
  min-height: 579px;
  max-width: 100%;
  background: #f8f9fb;
  /* padding: 0 10vw; */
  /* @apply grid-cols-1 md:grid-cols-2 h-md:grid-cols-2; */
  @apply max-lg:grid-cols-1 max-h-md:grid-cols-1 grid-cols-2;
}

.phoneImage {
  max-width: 350px;
  position: relative;
  top: 36px;
  justify-self: end;
  @apply max-lg:hidden max-h-md:hidden;
}

.loginForm {
  /* justify-self: center; */
  box-shadow: 0px 4px 48px rgba(0, 0, 0, 0.06);
  border-radius: 32px;
  background: white;
  padding: 74px 45px;

  display: grid;
  place-items: center;
  row-gap: 52px;
  width: 360px;

  /* @apply justify-self-center md:justify-self-start h-md:justify-self-start; */
  @apply max-md:w-[370px] max-lg:justify-self-center max-h-md:justify-self-center justify-self-start;
}

.loginForm > form {
  display: grid;
  row-gap: 24px;
  width: 100%;
  height: 100%;
}

input {
  background: #fafafa;
  border-radius: 4px;
  border: none;
}

input::placeholder {
  color: #9e9e9e;
}

.loginButton {
  background: linear-gradient(89.93deg, #00c2ff 0.06%, #0047ff 105.68%);
  padding: 12px 0;
  color: white;
  border: none;
}

.info {
  color: #1da0ff;
  /* text-align: center; */
  cursor: pointer;
}

.agreement {
  color: #a1a1a1;
  display: flex;
  align-items: flex-start;
  /* align-items: start; */
  gap: 6px;
}

.agreement > input {
  margin-top: 5px;
}
</style>
