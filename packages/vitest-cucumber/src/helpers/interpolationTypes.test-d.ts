import { describe, expectTypeOf, it } from "vitest";
import type { InferVariables } from "./interpolationTypes";

describe("interpolationTypes", () => {
  it("should return empty array if no variables found", () => {
    expectTypeOf(
      {} as InferVariables<"Given a step without variable">,
    ).toEqualTypeOf<Record<string, never>>();
  });

  it("should return variables", () => {
    expectTypeOf(
      {} as InferVariables<"Given a step with {{variable1}}">,
    ).toEqualTypeOf<{ variable1: string }>();
    expectTypeOf(
      {} as InferVariables<"Given a step with {{variable1}}, {{variable2}}">,
    ).toEqualTypeOf<{ variable1: string; variable2: string }>();
  });

  it("should return trimmed variables", () => {
    expectTypeOf(
      {} as InferVariables<"Given a step with {{ variable1 }}">,
    ).toEqualTypeOf<{ variable1: string }>();
    expectTypeOf(
      {} as InferVariables<"Given a step with {{ variable1 }}, {{ variable2 }}">,
    ).toEqualTypeOf<{ variable1: string; variable2: string }>();
  });
});
