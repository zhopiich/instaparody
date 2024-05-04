import { ref, computed } from "vue";
import { defineStore } from "pinia";

export const useMediaQueryStore = defineStore("mediaQuery", () => {
  const mediaQueryList = window.matchMedia("(min-width: 768px)");

  const isMobile = ref(!mediaQueryList.matches);

  const handleChange = () => {
    isMobile.value = !mediaQueryList.matches;

    //
    console.log("**- matched!!");
  };

  const setListener = () => {
    mediaQueryList.addEventListener("change", handleChange);
  };
  return {
    isMobile,
    setListener,
  };
});
