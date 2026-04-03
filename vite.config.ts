import { defineConfig } from "vite-plus";

export default defineConfig({
  staged: {
    "*": "vp run check",
  },
  run: {
    cache: true,
    tasks: {
      check: {
        command: "vp check --fix",
      },
    },
  },
});
