import { defineConfig } from "vite-plus";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": "/src/ui",
    },
  },
  fmt: {
    ignorePatterns: ["**/ui/**/*", "worker-configuration.d.ts"],
  },
  lint: {
    plugins: ["react", "promise", "import"],
    options: { typeAware: true, typeCheck: true },
    ignorePatterns: ["worker-configuration.d.ts"],
  },
  run: {
    tasks: {
      check: {
        cache: true,
        command: "vp check --fix",
      },
      _build: {
        cache: true,
        dependsOn: ["check"],
        command: "vp build",
      },
      deploy: {
        dependsOn: ["_build"],
        command: "vpx wrangler deploy",
      },
    },
  },
});
