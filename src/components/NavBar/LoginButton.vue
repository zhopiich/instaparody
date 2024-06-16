<template>
  <div class="border rounded-full overflow-hidden">
    <router-link to="/login">
      <div
        class="px-4 hover:bg-sky-100 active:bg-blue-100 cursor-pointer *:pointer-events-none *:select-none"
      >
        <div class="flex justify-center">
          <div class="mr-1.5 -ml-1.5 flex items-center">
            <FontAwesomeIcon
              :icon="faCircleUser"
              class="text-2xl rounded-full"
            />
          </div>
          <div class="flex items-center">
            <span class="leading-10 text-blue-600">Login</span>
          </div>
        </div>
      </div>
    </router-link>
  </div>
</template>

<script setup>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faCircleUser } from "@fortawesome/free-regular-svg-icons";
</script>
