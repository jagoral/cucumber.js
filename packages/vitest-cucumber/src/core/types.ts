export type ScenarioContext = {
	scenarioName: string;
	chainIdentifier?: "skip" | "only";
};

export type MergeState<TState, TEnhancedState> = TEnhancedState extends never
	? TState
	: TState & TEnhancedState;

export type StepReturn<TReturnState> = TReturnState extends never
	? never
	: TReturnState | Promise<TReturnState>;

export type StepConstruct<TState, TCallbackReturn> = {
	name: string;
	callback: (state: TState) => StepReturn<TCallbackReturn>;
	context: ScenarioContext;
};
