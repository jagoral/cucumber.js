/// <reference types="vitest" />

// Configure Vitest (https://vitest.dev/config/)

import vitestCucumberPlugin from "@jagoral/vitest-cucumber/plugin";
import { defineConfig } from "vite";

export default defineConfig({
  test: {
    typecheck: {
      enabled: true,
    },
  },
  plugins: [vitestCucumberPlugin()],
});
