import type { Merge } from "./types";

type Config = {
  variablePrefix: "{{";
  variableSuffix: "}}";
};

export type InferVariables<
  TInput extends string,
  TVariables extends Record<string, string> = Record<string, never>,
> = TInput extends `${infer _Start}${Config["variablePrefix"]}${infer TVariable}${Config["variableSuffix"]}${infer TRest}`
  ? InferVariables<TRest, Merge<TVariables, { [K in Trim<TVariable>]: string }>>
  : TVariables;

type Trim<TInput extends string> = TInput extends ` ${infer TRest}`
  ? Trim<TRest>
  : TInput extends `${infer TRest} `
    ? Trim<TRest>
    : TInput;
