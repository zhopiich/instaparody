import { ref, reactive, computed, watch } from "vue";
import { defineStore } from "pinia";

export const useAlertStore = defineStore("alert", () => {
  const isAlertShown = ref(false);

  const variableHeight = reactive({
    messageInput: 0,
  });

  const setVariableHeight = ({ type, val }) => {
    variableHeight[type] = val;
  };

  const alertList = reactive([]);

  const addAlert = ({ content, link = null } = {}) => {
    alertList.push({ content, link });
  };

  const alertContent = ref("");
  const alertLink = ref(null);

  let durationId;
  let holdId;

  const raiseAlert = () => {
    alertContent.value = alertList[0].content;
    alertLink.value = alertList[0].link;

    isAlertShown.value = true;

    durationId = setTimeout(() => {
      isAlertShown.value = false;

      alertList.shift();
    }, 5000);
  };

  const holdInterval = (interval) =>
    new Promise((resolve) => {
      holdId = setTimeout(() => {
        resolve();
      }, interval);
    });

  watch(
    () => alertList.length,
    async (newLength, oldLength) => {
      if (newLength === 0) return;
      if (newLength > oldLength && oldLength > 0) return;

      if (oldLength > 0) {
        await holdInterval(300);
      }

      raiseAlert();
    }
  );

  const closeAlert = () => {
    clearTimeout(durationId);

    isAlertShown.value = false;
    alertList.shift();
  };

  const reset = () => {
    if (alertList.length === 0) return;

    clearTimeout(durationId);
    clearTimeout(holdId);

    isAlertShown.value = false;
    alertList.length = 0;
  };

  return {
    isAlertShown,
    variableHeight,
    setVariableHeight,
    addAlert,
    alertContent,
    alertLink,
    closeAlert,
    reset,
  };
});
