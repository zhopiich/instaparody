<template>
  <div
    class="profileMenu absolute right-0 w-48 bg-white pt-2 rounded-lg flex flex-col hover:*:bg-slate-100 *:transition-colors select-none"
    ref="menu"
  >
    <router-link
      v-for="link in linksList"
      :to="link.to"
      @click="emits('close')"
      >{{ link.name }}</router-link
    >

    <div class="divider h-0 m-0 border-t border-neutral-200/75"></div>

    <div class="m-2 text-center rounded-lg" @click="emits('logout')">
      <span class="text-red-600 font-semibold">Log Out</span>
    </div>
  </div>
</template>

<script setup>
const props = defineProps(["profilePageURL", "avatar"]);
const emits = defineEmits(["logout", "close"]);

import { ref, onMounted, onBeforeUnmount } from "vue";

const menu = ref(null);

const linksList = [
  { name: "My Page", to: props.profilePageURL },
  { name: "Messages", to: "/messages" },
  { name: "Edit profile", to: "/profile/edit" },
  { name: "Change password", to: "/change_password" },
];

const onClick = (event) => {
  if (!menu.value) return;

  const el = menu.value;
  if (!el.contains(event.target) && !props.avatar.contains(event.target)) {
    emits("close");
  }
};

onMounted(() => {
  window.addEventListener("click", onClick);
});

onBeforeUnmount(() => {
  window.removeEventListener("click", onClick);
});
</script>

<style scoped>
.profileMenu {
  box-shadow: rgba(101, 119, 134, 0.2) 0px 0px 15px,
    rgba(101, 119, 134, 0.15) 0px 0px 3px 1px;

  transform: translateY(14px);
}

.profileMenu::before {
  content: "";
  display: block;
  position: absolute;
  width: 0;
  height: 0;
  top: -6px;
  right: 11px;
  border-bottom: 6px solid white;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;

  filter: drop-shadow(rgb(207, 217, 222) 1px -1px 1px);
}

.profileMenu > :not(div.divider) {
  text-decoration: none;
  cursor: pointer;
  padding: 10px 16px;
}

.divider::before,
.divider::after {
  display: none;
}
</style>
