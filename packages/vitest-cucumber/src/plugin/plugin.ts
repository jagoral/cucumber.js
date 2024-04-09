import { type PluginOption, createFilter } from "vite";
import { defaultExclude, defaultInclude } from "vitest/config";
import { transformScenarios } from "./transformScenarios";

export function vitestCucumberPlugin(): PluginOption {
	let filter: ReturnType<typeof createFilter> = () => true;

	return {
		name: "vitest-cucumber",
		configureServer(server) {
			filter = createFilter(
				server.config.test?.include || defaultInclude,
				server.config.test?.exclude || defaultExclude,
			);
		},
		transform(code, id) {
			if (!filter(id)) {
				return;
			}

			return {
				code: transformScenarios(code),
				map: null,
			};
		},
	};
}
