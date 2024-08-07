<template>
  <div class="spareBlock">
    <slot></slot>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from "vue";

const props = defineProps(["isPersistent"]);

// Select the element after mounted
let navbar = null;

let lastYPosition = 0;

const navbarPosition = ref(0);

const navbarHeight = ref(0);

const heightObserver = new ResizeObserver((entries) => {
  for (let entry of entries) {
    const { target } = entry;
    navbarHeight.value = target.offsetHeight;
    // navbarHeight.value = target.clientHeight;
  }
});

const isSubmerged = computed(() => navbarPosition.value === navbarHeight.value);

watch(isSubmerged, () => {
  isSubmerged.value
    ? navbar.classList.add("noShadow")
    : navbar.classList.remove("noShadow");
});

function onScroll() {
  const currentYPosition = window.scrollY || document.documentElement.scrollTop;

  // Due to momentum scrolling on mobiles
  if (currentYPosition < 0) {
    return;
  }

  const displacement = currentYPosition - lastYPosition;

  // Set the current scroll position as the last scroll position
  // for next scrolling
  lastYPosition = currentYPosition;

  if (displacement > 0 && props.isPersistent) return;
  if (displacement > 0 && navbarPosition.value === navbarHeight.value) return;
  if (displacement < 0 && navbarPosition.value === 0) return;

  if (navbarPosition.value + displacement >= navbarHeight.value) {
    navbarPosition.value = navbarHeight.value;
  } else if (navbarPosition.value + displacement <= 0) {
    navbarPosition.value = 0;
  } else {
    navbarPosition.value = navbarPosition.value + displacement;
  }
}

onMounted(() => {
  // The class name is valid only after mounted
  navbar = document.querySelector(".navbar");

  heightObserver.observe(navbar);
  window.addEventListener("scroll", onScroll);
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", onScroll);
  heightObserver.unobserve(navbar);
});
</script>

<style scoped>
.spareBlock {
  width: 100%;
  display: block;
  height: v-bind(navbarHeight + "px");
}

.spareBlock :slotted(.navbar) {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  transform: translateY(v-bind(-navbarPosition + "px"));
}
.spareBlock :slotted(.navbar.noShadow) {
  box-shadow: none;
}
</style>
