import { AbstractStep } from "./abstractStep";
import { createScenarioOutlineTests } from "./createTest";
import type { Callback, ScenarioContext, StateAfterStep } from "./types";

export class ScenarioOutline {
	constructor(private context: ScenarioContext) {}

	given<TName extends string, TGivenReturn extends object | void>(
		step: TName,
		callback: Callback<TName, Record<string, never>, TGivenReturn>,
	) {
		return new Given<TName, Record<string, never>, TGivenReturn>([], {
			name: step,
			callback,
			context: this.context,
		});
	}
}

class Given<
	TName extends string = string,
	TState = any,
	TStepReturn extends object | void = void,
	TStateAfterStep = StateAfterStep<TName, TState, TStepReturn>,
> extends AbstractStep<TName, TState, TStepReturn> {
	and<TName extends string, TAndReturn extends object | never>(
		name: TName,
		callback: Callback<TName, TStateAfterStep, TAndReturn>,
	) {
		return new Given<TName, TStateAfterStep, TAndReturn>(this.currentSteps, {
			name,
			callback,
			context: this.stepConstruct.context,
		});
	}

	when<TName extends string, TWhenReturn extends object | void>(
		name: TName,
		callback: Callback<TName, TStateAfterStep, TWhenReturn>,
	) {
		return new When<TName, TStateAfterStep, TWhenReturn>(this.currentSteps, {
			name,
			callback,
			context: this.stepConstruct.context,
		});
	}

	toString() {
		if (this.currentSteps.at(-2) instanceof Given) {
			return `And ${this.name}`;
		}

		return `Given ${this.name}`;
	}
}

class When<
	TName extends string = string,
	TState = any,
	TStepReturn extends object | void = void,
	TStateAfterStep = StateAfterStep<TName, TState, TStepReturn>,
> extends AbstractStep<TName, TState, TStepReturn> {
	and<TName extends string, TAndReturn extends object | void>(
		name: TName,
		callback: Callback<TName, TStateAfterStep, TAndReturn>,
	) {
		return new When<TName, TStateAfterStep, TAndReturn>(this.currentSteps, {
			name,
			callback,
			context: this.stepConstruct.context,
		});
	}

	// biome-ignore lint/suspicious/noThenProperty: <explanation>
	then<TName extends string>(
		name: TName,
		callback: Callback<TName, TStateAfterStep, void>,
	) {
		return new Then<TName, TStateAfterStep>(this.currentSteps, {
			name,
			callback,
			context: this.stepConstruct.context,
		});
	}

	toString() {
		if (this.currentSteps.at(-2) instanceof When) {
			return `And ${this.name}`;
		}

		return `When ${this.name}`;
	}
}

class Then<
	TName extends string,
	TState = any,
	TVariables = TState extends { variables: infer TVariables }
		? TVariables
		: never,
> extends AbstractStep<TName, TState, void> {
	private _examples: [TVariables, ...TVariables[]] | undefined;

	and<TName extends string>(
		name: TName,
		callback: Callback<TName, TState, void>,
	) {
		return new Then<TName, TState>(this.currentSteps, {
			name,
			callback,
			context: this.stepConstruct.context,
		});
	}

	toString() {
		if (this.currentSteps.at(-2) instanceof Then) {
			return `And ${this.name}`;
		}

		return `Then ${this.name}`;
	}

	build() {
		createScenarioOutlineTests(
			this.currentSteps,
			this.stepConstruct.context,
			this._examples,
		);
	}

	examples(examplesToRegister: [TVariables, ...TVariables[]]) {
		this._examples = examplesToRegister;
		return this;
	}
}
