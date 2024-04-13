import { describe } from "vitest";
import { Scenario } from "./scenario";
import { ScenarioOutline } from "./scenarioOutline";
import type { ScenarioContext } from "./types";

export const feature = describe;

export function scenario(scenarioName: string) {
	return new Scenario({ scenarioName });
}

export function scenarioOutline(scenarioName: string) {
	return new ScenarioOutline({ scenarioName });
}

scenario.only = (scenarioName: string) => {
	return new Scenario({ scenarioName, chainIdentifier: "only" });
};

scenario.skip = (scenarioName: string) => {
	return new Scenario({ scenarioName, chainIdentifier: "skip" });
};

scenarioOutline.only = (scenarioName: string) => {
	return new ScenarioOutline({ scenarioName, chainIdentifier: "only" });
};

scenarioOutline.skip = (scenarioName: string) => {
	return new ScenarioOutline({ scenarioName, chainIdentifier: "skip" });
};
