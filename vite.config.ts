import { defineConfig } from "vite-plus";

export default defineConfig({
  staged: {
    "*": "vp check",
  },
  run: {
    cache: true,
    tasks: {
      checkAll: {
        command: "vp run -r check",
      },
    },
  },
});
