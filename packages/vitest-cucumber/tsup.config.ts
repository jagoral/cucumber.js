import { defineConfig } from "tsup";

export default defineConfig([
  {
    entry: {
      index: "src/index.ts",
    },
    clean: true,
    dts: true,
    format: ["esm"],
    external: ["vitest"],
  },
  {
    entry: {
      plugin: "src/plugin/index.ts",
    },
    clean: true,
    dts: true,
    format: ["cjs", "esm"],
    external: ["vite"],
  },
]);
