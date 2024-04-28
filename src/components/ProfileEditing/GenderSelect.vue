<template>
  <div class="relative">
    <div
      id="gender-select"
      class="border hover:bg-neutral-100 active:bg-neutral-200 cursor-pointer"
      :class="{
        '!border-red-500': !isGenderValid,
      }"
      ref="target"
      @click="toggleMenu"
    >
      <div class="min-h-5 *:select-none flex justify-between items-stretch">
        <div v-if="gender" class="grow overflow-hidden">
          <span v-if="gender.custom !== undefined">{{ gender.custom }}</span>
          <span v-else>{{ genders[gender] }}</span>
        </div>

        <div class="ml-4 flex items-center">
          <FontAwesomeIcon :icon="faChevronDown" class="text-neutral-300" />
        </div>
      </div>
    </div>

    <DropdownMenu
      v-if="isShowTooltip"
      :bottom="bottom"
      :target="target"
      @close="isShowTooltip = false"
    >
      <ul class="flex flex-col">
        <li
          v-for="(value, key) in menuOptions"
          class="menuOption cursor-pointer"
          @click="handleGenderSelected(value)"
        >
          <div class="px-6 py-4 flex items-center">
            <div class="grow flex justify-start">
              <span>{{ key }}</span>
            </div>
            <div class="">
              <div class="ml-3">
                <div class="w-6 aspect-square flex *:pointer-events-none">
                  <FontAwesomeIcon
                    v-if="
                      gender === value ||
                      (gender.custom !== undefined && key === 'Custom')
                    "
                    :icon="faCircleCheck"
                    class="text-[24px]"
                  />
                  <div
                    v-else
                    class="size-full border border-gray-300 rounded-full"
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div v-if="key === 'Custom'" class="px-6 pb-3">
            <input
              type="text"
              v-model="customGender"
              id="customGenderInput"
              class="border px-5 py-3 leading-[30px] rounded-xl focus:border-black"
              :class="{
                '!border-red-500': !isGenderValid,
              }"
              @click.stop="onInputClicked(value)"
            />
          </div>
        </li>
      </ul>
    </DropdownMenu>
  </div>
</template>

<script setup>
import { getPosition } from "../../modules/position.js";

import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  faCircleCheck,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";

import DropdownMenu from "./DropdownMenu.vue";

const props = defineProps(["gender"]);
const emits = defineEmits(["setGender", "setValidGender"]);

import { ref, computed, watch, onMounted } from "vue";

const target = ref(null);
const bottom = ref(0);
const isShowTooltip = ref(false);
const toggleMenu = () => {
  if (!isShowTooltip.value) {
    const position = getPosition(target.value);
    bottom.value = position.bottom;
  }

  isShowTooltip.value = !isShowTooltip.value;
};

const customGender = ref(null);

const menuOptions = computed(() => ({
  Male: "M",
  Female: "F",
  Custom: { custom: customGender.value },
  "Prefer not to say": "N",
}));

const genders = {
  M: "Male",
  F: "Female",
  N: "Prefer not to say",
};

const handleGenderSelected = (newGender) => {
  emits("setGender", newGender);

  if (typeof newGender === "object" && newGender.custom === "") {
    // The input element is present only if isShowTooltip is true
    // Trying to get the input on mounted will get null
    const customGenderInput = document.getElementById("customGenderInput");

    customGenderInput.focus();
    return;
  }

  isShowTooltip.value = false;
};

const onInputClicked = (customGender) => {
  if (props.gender.custom === undefined) {
    emits("setGender", customGender);
  }
};

const isGenderValid = computed(() => {
  if (!props.gender) return true;

  return (
    props.gender.custom === undefined ||
    (props.gender.custom.length > 0 && props.gender.custom.length <= 50)
  );
});

watch(isGenderValid, (newVal) => {
  emits("setValidGender", newVal);
});

onMounted(() => {
  const setWatch = () => {
    watch(customGender, (newVal) => {
      if (props.gender.custom === undefined) return;
      emits("setGender", { custom: newVal });
    });
  };

  if (!props.gender) {
    watch(
      () => props.gender,
      (newVal) => {
        customGender.value = newVal.custom || "";

        setWatch();
      },
      { once: true }
    );
  } else {
    customGender.value = props.gender.custom || "";

    setWatch();
  }
});
</script>

<style scoped>
.menuOption {
  &:hover {
    background-color: rgb(239 239 239);
  }
  &:active {
    background-color: rgb(229 229 229);
  }

  input {
    background-color: rgb(250 250 250);
  }
}
</style>
