import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import fs from "node:fs";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    https: {
      key: fs.readFileSync(".cert/localhost-key.pem"),
      cert: fs.readFileSync(".cert/localhost.pem"),
    },
    port: 5174,
    proxy: {
      // Only needed if this app also calls Blocks services directly
      // (Data, Localization, etc.) — not required for the login flow itself,
      // since login redirects the full browser rather than going through
      // this dev server.
      "/api": {
        target: "https://api.seliseblocks.com",
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
