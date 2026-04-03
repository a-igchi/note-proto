import { defineConfig } from "vite-plus";

export default defineConfig({
  fmt: {},
  lint: {
    plugins: ["import", "node", "promise"],
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
