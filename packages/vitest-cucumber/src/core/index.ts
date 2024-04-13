import { describe } from "vitest";
import type { TestOptions } from "vitest";
import { Scenario } from "./scenario";
import { ScenarioOutline } from "./scenarioOutline";

export const feature = describe;

export function scenario(scenarioName: string, testOptions?: TestOptions) {
	return new Scenario({ scenarioName, testOptions });
}

export function scenarioOutline(
	scenarioName: string,
	testOptions?: TestOptions,
) {
	return new ScenarioOutline({ scenarioName, testOptions });
}
