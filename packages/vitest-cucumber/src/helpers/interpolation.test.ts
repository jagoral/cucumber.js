import { describe, expect, it } from "vitest";
import { getVariablesFromText, injectVariables } from "./interpolation";

describe("interpolation", () => {
  describe("getVariablesFromText", () => {
    it("should return empty array if no variables found", () => {
      expect(getVariablesFromText("no variables")).toEqual([]);
    });

    it("should return variables", () => {
      expect(getVariablesFromText("{{variable1}}")).toEqual(["variable1"]);
      expect(
        getVariablesFromText("Some text {{variable1}}, {{variable2}}"),
      ).toEqual(["variable1", "variable2"]);
    });

    it("should return trimmed variables", () => {
      expect(getVariablesFromText("{{ variable1 }}")).toEqual(["variable1"]);
      expect(getVariablesFromText("{{ variable1 }} {{ variable2 }}")).toEqual([
        "variable1",
        "variable2",
      ]);
    });
  });

  describe("injectVariables", () => {
    it("should return text without variables", () => {
      expect(injectVariables("no variables", {})).toEqual("no variables");
    });

    it("should return text with variables", () => {
      expect(injectVariables("{{variable1}}", { variable1: "value1" })).toEqual(
        "value1",
      );
      expect(
        injectVariables("Some text {{variable1}},{{variable2}}", {
          variable1: "value1",
          variable2: "value2",
        }),
      ).toEqual("Some text value1,value2");
    });

    it("should return text with variables with spaces", () => {
      expect(
        injectVariables("{{ variable1 }}", { variable1: "value1" }),
      ).toEqual("value1");
      expect(
        injectVariables("{{ variable1 }} {{   variable2 }}", {
          variable1: "value1",
          variable2: "value2",
        }),
      ).toEqual("value1 value2");
    });
  });
});
