import { fileURLToPath, URL } from "node:url";
import tailwindcss from "@tailwindcss/vite";

import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";

export default defineConfig({
  // 配置执行早于环境注入
  plugins: [vue(), tailwindcss()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    port: 8001, // 读取环境变量
    open: false, // 项目启动时不自动打开浏览器
    allowedHosts: "all", // 允许所有域名访问
  },
});
