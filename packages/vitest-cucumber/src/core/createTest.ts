import { describe, test } from "vitest";
import { injectVariables } from "../helpers";
import type { AbstractStep } from "./steps";
import type { ScenarioContext } from "./types";

export function createTest(
	steps: AbstractStep[],
	context: ScenarioContext,
	examples: [any, ...any[]] | undefined,
) {
	switch (context.type) {
		case "scenario": {
			return createScenarioTest(steps, context);
		}
		case "scenarioOutline": {
			if (!examples)
				throw new Error("Examples are required for scenario outlines");

			return createScenarioOutlineTests(steps, context, examples);
		}
	}
}

function createScenarioTest(steps: AbstractStep[], context: ScenarioContext) {
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

function createScenarioOutlineTests(
	steps: AbstractStep[],
	context: ScenarioContext,
	examples: [any, ...any[]],
) {
	const { chainIdentifier } = context;
	const testFn = chainIdentifier ? test[chainIdentifier] : test;

	describe(`Scenario: ${context.scenarioName}`, () => {
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
