import { describe, expect, test } from "vitest";

type Step = Given | When | Then;

class Given {
	public steps: Step[];

	constructor(
		private previousSteps: Step[],
		public step: string,
	) {
		this.steps = [...previousSteps, this];
	}

	and(step: string) {
		return new Given(this.steps, step);
	}

	when(step: string) {
		return new When(this.steps, step);
	}

	toString() {
		if (this.previousSteps.length > 0) {
			return `And ${this.step}`;
		}

		return `Given ${this.step}`;
	}
}

class When {
	public steps: Step[];

	constructor(
		private previousSteps: Step[],
		public step: string,
	) {
		this.steps = [...previousSteps, this];
	}

	and(step: string) {
		return new When(this.steps, step);
	}

	// biome-ignore lint/suspicious/noThenProperty: I have to decide if it makes sense to have a `then` property here
	then(step: string) {
		return new Then(this.steps, step);
	}

	toString() {
		if (this.previousSteps.at(-1) instanceof When) {
			return `And ${this.step}`;
		}

		return `When ${this.step}`;
	}
}

class Then {
	public steps: Step[];

	constructor(
		private previousSteps: Step[],
		public step: string,
	) {
		this.steps = [...previousSteps, this];
	}

	and(step: string) {
		return new Then(this.steps, `${step} And${step}`);
	}

	toString() {
		if (this.previousSteps.at(-1) instanceof Then) {
			return `And ${this.step}`;
		}

		return `Then ${this.step}`;
	}
}

function scenario(scenarioName: string, scenarioTest: Then) {
	describe(`Scenario: ${scenarioName}`, () => {
		const stepsToString = scenarioTest.steps
			.map((step) => step.toString())
			.join(", ");

		test(stepsToString, () => {
			expect(true).toBe(true);
		});
	});
}

function given(step: string) {
	return new Given([], step);
}

scenario(
	"Breaker joins a game",
	given('the Maker has started a game with the word "silky"')
		.when("the Breaker joins the Maker's game")
		.then("the Breaker is assigned the role of Breaker"),
);
