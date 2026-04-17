import { defineConfig } from "vite-plus";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/api": "http://localhost:3000",
    },
  },
  resolve: {
    alias: {
      "@": "/src/ui",
    },
  },
  fmt: {
    ignorePatterns: ["**/ui/**/*", ".claude/**/*"],
  },
  lint: {
    plugins: ["react", "promise"],
    options: { typeAware: true, typeCheck: true },
  },
  run: {
    tasks: {
      check: {
        command: "vp check --fix",
      },
    },
  },
});
