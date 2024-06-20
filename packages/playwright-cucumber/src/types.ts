import type { TestType } from "@playwright/test";

export type StepKeyword = "Given" | "When" | "Then" | "And";

export interface StepNameFormatterParams {
  title: string;
  step: StepKeyword;
}

export type StepNameFormatter = (params: StepNameFormatterParams) => string;

export interface GherkinTestOptions {
  /**
   * Formatter for step names.
   * @example
   * ```ts
   * {
   *   stepNameFormatter: ({ title, step }) => `${step} ${title}`
   * }
   * // adds the step keyword before the title
   * ```
   *
   */
  stepNameFormatter?: StepNameFormatter;
}

export type KeyValue = { [key: string]: any };

export type UseFn = any;

export type GherkinTestExtend<Test extends TestType<any, any>> = {
  And: Test["step"];
  Given: Test["step"];
  When: Test["step"];
  Then: Test["step"];
};

export type GherkinTestReturn<
  TestArgs extends KeyValue,
  WorkerArgs extends KeyValue,
> = {
  Scenario: TestType<
    TestArgs & GherkinTestExtend<TestType<TestArgs, WorkerArgs>>,
    WorkerArgs
  >;
  Feature: TestType<
    TestArgs & GherkinTestExtend<TestType<TestArgs, WorkerArgs>>,
    WorkerArgs
  >["describe"];
};
