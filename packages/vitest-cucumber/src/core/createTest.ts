import { describe, test } from "vitest";
import type { AbstractStep } from "./steps";
import type { ScenarioContext } from "./types";

export function createTest(steps: AbstractStep[], context: ScenarioContext) {
	const { chainIdentifier } = context;
	const stepsToString = steps.map((step) => step.toString()).join(", ");
	const testFn = chainIdentifier ? test[chainIdentifier] : test;

	describe(`Scenario: ${context.scenarioName}`, () => {
		testFn(stepsToString, async () => {
			let currentState = {};
			for (const step of steps) {
				currentState = await step.callback(currentState);
			}
		});
	});
}
