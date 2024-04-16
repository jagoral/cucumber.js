import { format } from "prettier";
import { describe, expect, it } from "vitest";
import { transformScenarios } from "./transformScenarios";

describe("transformScenarios", () => {
  async function getTransformedScenario(code: string) {
    return format(transformScenarios(code), {
      parser: "typescript",
    });
  }

  it("should add .build() at the end of the chain", async () => {
    const code = `
      scenario("test")
        .when("a", () => {})
        .then("b", () => {})
        .and("c", () => {});
    `;

    expect(await getTransformedScenario(code)).toMatchSnapshot();
  });

  it("should add .build() at the end of the scenarioOutline chain", async () => {
    const code = `
      scenarioOutline("test")
        .when("a", () => {})
        .then("b", () => {})
        .and("c", () => {});
    `;

    expect(await getTransformedScenario(code)).toMatchSnapshot();
  });

  it("should skip adding .build() when its already added", async () => {
    const code = `
    scenario("test")
      .when("a", () => {})
      .then("b", () => {})
      .and("c", () => {})
      .build();
  `;

    expect(await getTransformedScenario(code)).toMatchSnapshot();
  });

  it("should add .build() to all scenarios", async () => {
    const code = `
    scenario("test1")
      .when("a", () => {})
      .then("b", () => {})
      .and("c", () => {});

    scenario("test2")
      .given("something", {})
      .when("a", () => {})
      .then("b", () => {});
  `;

    expect(await getTransformedScenario(code)).toMatchSnapshot();
  });

  it("should add .build() when chain identifier", async () => {
    const code = `
    scenario.only("test")
      .when("a", () => {})
      .then("b", () => {})
      .and("c", () => {});
  `;

    expect(await getTransformedScenario(code)).toMatchSnapshot();
  });
});
