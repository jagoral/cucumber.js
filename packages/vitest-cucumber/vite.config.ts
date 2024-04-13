/// <reference types="vitest" />

// Configure Vitest (https://vitest.dev/config/)

import { defineConfig } from "vite";
import { vitestCucumberPlugin } from "./src/plugin";

export default defineConfig({
	test: {
		typecheck: {
			enabled: true,
		},
	},
	plugins: [vitestCucumberPlugin()],
});
