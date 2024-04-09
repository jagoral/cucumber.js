import { createTest } from "./createTest";
import type { MergeState, StepConstruct, StepReturn } from "./types";

export abstract class AbstractStep<
	TState extends object = any,
	TCallbackReturn extends object | void = void,
> {
	public readonly name: string;
	public readonly callback: (
		state: TState,
	) => Promise<MergeState<TState, TCallbackReturn>>;
	public currentSteps: AbstractStep<any, any>[];

	constructor(
		previousSteps: AbstractStep<any, any>[],
		protected stepConstruct: StepConstruct<TState, TCallbackReturn>,
	) {
		this.currentSteps = [...previousSteps, this];
		this.name = stepConstruct.name;
		this.callback = async (state: TState) => {
			return { ...state, ...(await stepConstruct.callback(state)) } as any;
		};
	}

	abstract toString(): string;
}

export class Given<
	TState extends object = any,
	TCallbackReturn extends object | void = void,
	TCurrentReturn extends object = MergeState<TState, TCallbackReturn>,
> extends AbstractStep<TState, TCallbackReturn> {
	and<TAndReturn extends object | never>(
		name: string,
		callback: (state: TCurrentReturn) => StepReturn<TAndReturn>,
	) {
		return new Given<TCurrentReturn, TAndReturn>(this.currentSteps, {
			name,
			callback,
			context: this.stepConstruct.context,
		});
	}

	when<TWhenReturn extends object | void>(
		name: string,
		callback: (state: TCurrentReturn) => StepReturn<TWhenReturn>,
	) {
		return new When<TCurrentReturn, TWhenReturn>(this.currentSteps, {
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
	TState extends object = any,
	TCallbackReturn extends object | void = void,
	TCurrentReturn extends object = MergeState<TState, TCallbackReturn>,
> extends AbstractStep<TState, TCallbackReturn> {
	and<TAndReturn extends object | void>(
		name: string,
		callback: (state: TCurrentReturn) => StepReturn<TAndReturn>,
	) {
		return new When<TCurrentReturn, TAndReturn>(this.currentSteps, {
			name,
			callback,
			context: this.stepConstruct.context,
		});
	}

	// biome-ignore lint/suspicious/noThenProperty: <explanation>
	then(name: string, callback: (state: TCurrentReturn) => StepReturn<void>) {
		return new Then<TCurrentReturn>(this.currentSteps, {
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

class Then<TState extends object = any> extends AbstractStep<TState, void> {
	and(name: string, callback: (state: TState) => StepReturn<void>) {
		return new Then<TState>(this.currentSteps, {
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
		createTest(this.currentSteps, this.stepConstruct.context);
	}
}
