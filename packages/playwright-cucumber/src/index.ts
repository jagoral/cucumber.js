import type { TestType } from "@playwright/test";
import type {
  GherkinTestExtend,
  GherkinTestOptions,
  GherkinTestReturn,
  KeyValue,
  StepKeyword,
  StepNameFormatter,
  UseFn,
} from "./types";

export type {
  GherkinTestOptions,
  GherkinTestReturn,
  StepKeyword,
  StepNameFormatter,
};

const defaultStepNameFormatter: StepNameFormatter = ({ title, step }) =>
  `${step} ${title}`;

/**
 * Create a Gherkin-style test helpers.
 *
 * @param test Test object to extend. Usually `test` from `@playwright/test`.
 * @param options Options for the Gherkin test.
 *
 * @example
 * ```ts
 * import { test } from "@playwright/test";
 *
 * const { Scenario, Feature } = gherkinTest(test);
 *
 * Feature("New Todo", () => {
 *  Scenario("Adding a todo item", async ({ page, And, When, Then }) => {
 *   await When("I create a new todo item", async () => {
 *    // create a new todo item
 *  });
 *
 *  await Then("I should see the new todo item in the list", async () => {
 *   // assert the new todo item is in the list
 *  });
 * });
 * ```
 *
 * @example With custom step name formatter
 * ```ts
 * import { test } from "@playwright/test";
 *
 * const { Scenario, Feature } = gherkinTest(test, {
 *  stepNameFormatter: ({ title, step }) => `${step} --- ${title}`
 * });
 * ```
 *
 * @example With extended test
 * ```ts
 * import { test as base } from "@playwright/test";
 *
 * const test = base.extend({
 *  //...
 * });
 *
 * const { Scenario, Feature } = gherkinTest(test);
 * ```
 */
export function gherkinTest<
  TestArgs extends KeyValue,
  WorkerArgs extends KeyValue,
  Test extends TestType<TestArgs, WorkerArgs>,
>(
  test: Test,
  options: GherkinTestOptions = {},
): GherkinTestReturn<TestArgs, WorkerArgs> {
  const { stepNameFormatter = defaultStepNameFormatter } = options;
  function formattedStep(step: StepKeyword) {
    return async <T>(title: string, body: () => Promise<T>) => {
      return test.step(stepNameFormatter({ title, step }), body);
    };
  }

  const Scenario = test.extend<GherkinTestExtend<Test>>({
    Given: async ({}, use: UseFn) => {
      await use(formattedStep("Given"));
    },
    And: async ({}, use: UseFn) => {
      await use(formattedStep("And"));
    },
    When: async ({}, use: UseFn) => {
      await use(formattedStep("When"));
    },
    Then: async ({}, use: UseFn) => {
      await use(formattedStep("Then"));
    },
  });
  const Feature = Scenario.describe;

  return { Scenario, Feature };
}
