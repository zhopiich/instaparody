<template>
  <div class="max-w-[468px] rounded-lg border flex flex-col">
    <div
      class="animate-pulse shrink-0 rounded-t-[inherit] overflow-hidden w-screen aspect-square max-w-full flex"
    >
      <div class="bg-slate-200 size-full"></div>
    </div>

    <div class="grow border-t px-4 flex flex-col">
      <div class="my-3 flex items-center justify-start">
        <div class="animate-pulse flex items-center gap-3 w-full">
          <div
            class="rounded-full w-12 aspect-square bg-neutral-300 shrink-0"
          ></div>

          <div class="rounded-md h-6 bg-neutral-300 shrink basis-24"></div>
        </div>
      </div>

      <div class="mb-1 flex">
        <div class="-ml-2">
          <LikeButton :isDisabled="true" />
        </div>
        <div class="">
          <CommentButton :isDisabled="true" />
        </div>
        <div class="-mr-2.5 ml-auto">
          <SaveButton :isDisabled="true" />
        </div>
      </div>

      <div class="mb-1">
        <div class="rounded-md w-14 h-5 bg-neutral-300"></div>
      </div>

      <div class="animate-pulse my-2 min-h-6 grow flex">
        <div class="rounded-md basis-72 h-4 bg-neutral-200"></div>
      </div>

      <div class="mb-2 h-6 flex items-center">
        <div class="rounded-md basis-40 h-4 bg-gray-300"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import LikeButton from "./PostButtons/LikeButton.vue";
import CommentButton from "./PostButtons/CommentButton.vue";
import SaveButton from "./PostButtons/SaveButton.vue";
</script>

<style scoped></style>
