import type { TestOptions } from "vitest";
import type { InferVariables, Merge } from "../helpers";

export type ScenarioContext = {
	scenarioName: string;
	testOptions?: TestOptions;
};

export type MergeState<TState, TEnhancedState> = Merge<TState, TEnhancedState>;

export type StepReturn<TReturnState> = TReturnState extends never
	? never
	: TReturnState | Promise<TReturnState>;

export type StepConstruct<TName extends string, TCallback> = {
	name: TName;
	callback: TCallback;
	context: ScenarioContext;
};

export type StepStateConstraint = {
	variables: Record<string, any>;
};

export type Callback<
	TStepName extends string,
	TCurrentState,
	TReturn,
	TStepVariables = InferVariables<TStepName>,
> = (
	state: TStepVariables extends Record<string, never>
		? TCurrentState
		: Merge<TCurrentState, { variables: TStepVariables }>,
) => StepReturn<TReturn>;

export type CallbackReturningFullState<
	TStepName extends string,
	TCurrentState,
	TReturn,
	TCallbackState = Parameters<Callback<TStepName, TCurrentState, TReturn>>[0],
> = (state: TCallbackState) => StepReturn<MergeState<TCallbackState, TReturn>>;

export type StateAfterStep<
	TStepName extends string,
	TCurrentState,
	TStepReturn,
> = Awaited<
	ReturnType<CallbackReturningFullState<TStepName, TCurrentState, TStepReturn>>
>;
