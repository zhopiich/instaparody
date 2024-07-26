import {
  defineConfig,
  //  splitVendorChunkPlugin
} from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    //  splitVendorChunkPlugin()
  ],
  // server: {
  //   proxy: {
  //     "/api": "http://localhost:1337",
  //     "/upload": "http://localhost:1337",
  //   },
  // },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            return id
              .toString()
              .split("node_modules/")[1]
              .split("/")[0]
              .toString();
          }
        },
      },
    },
  },
});
