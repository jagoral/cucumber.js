import { describe, test } from "vitest";
import { injectVariables } from "../helpers";
import type { AbstractStep } from "./abstractStep";
import type { ScenarioContext } from "./types";

export function createScenarioTest(
	steps: AbstractStep[],
	context: ScenarioContext,
) {
	const { chainIdentifier } = context;
	const stepsToString = steps.map((step) => step.toString()).join(", ");
	const testFn = chainIdentifier ? test[chainIdentifier] : test;

	describe(`Scenario: ${context.scenarioName}`, () => {
		testFn(stepsToString, async () => {
			let currentState = {};
			for (const step of steps) {
				currentState = await step.getMetadata().callback(currentState);
			}
		});
	});
}

export function createScenarioOutlineTests(
	steps: AbstractStep[],
	context: ScenarioContext,
	examples: [any, ...any[]] | undefined,
) {
	const { chainIdentifier } = context;
	const testFn = chainIdentifier ? test[chainIdentifier] : test;

	describe(`Scenario Outline: ${context.scenarioName}`, () => {
		if (!examples) {
			const stepsToString = steps.map((step) => step.toString()).join(", ");
			test(stepsToString, async () => {
				throw new Error("No examples provided for scenario outline");
			});

			return;
		}

		for (const example of examples) {
			const stepsToString = steps
				.map((step) => injectVariables(step.toString(), example))
				.join(", ");

			testFn(stepsToString, async () => {
				let currentState = { variables: example };
				for (const step of steps) {
					currentState = await step.getMetadata().callback(currentState);
				}
			});
		}
	});
}
