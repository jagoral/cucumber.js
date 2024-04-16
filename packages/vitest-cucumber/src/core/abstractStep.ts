import type {
  Callback,
  CallbackReturningFullState,
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
