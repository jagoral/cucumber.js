import { createTest } from "./createTest";
import type {
	Callback,
	CallbackReturningFullState,
	StateAfterStep,
	StepConstruct,
} from "./types";

export abstract class AbstractStep<
	TName extends string = string,
	TState = any,
	TStepReturn extends object | void = any,
> {
	protected readonly name: string;
	protected readonly callback: CallbackReturningFullState<
		TName,
		TState,
		TStepReturn
	>;
	protected currentSteps: AbstractStep<any, any, any>[];

	constructor(
		previousSteps: AbstractStep<string, any, any>[],
		protected stepConstruct: StepConstruct<
			TName,
			Callback<TName, TState, TStepReturn>
		>,
	) {
		this.currentSteps = [...previousSteps, this];
		this.name = stepConstruct.name;
		this.callback = (async (state: any) => {
			return { ...state, ...(await stepConstruct.callback(state)) };
		}) as any;
	}

	abstract toString(): string;

	getMetadata() {
		return {
			name: this.name,
			callback: this.callback,
		};
	}
}

export class Given<
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
		createTest(this.currentSteps, this.stepConstruct.context, this._examples);
	}

	examples(examplesToRegister: [TVariables, ...TVariables[]]) {
		this._examples = examplesToRegister;
		return this;
	}
}
