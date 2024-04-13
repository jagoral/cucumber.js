import { expect } from "vitest";
import { feature, scenario, scenarioOutline } from ".";

feature("Example test", () => {
	scenario("Breaker joins a game")
		.given("the Maker has started a game with the word", () => {
			return { hello: "world" };
		})
		.when("the Breaker joins the Maker's game", () => {
			return { role: "Breaker" };
		})
		.then("the Breaker is assigned the role of Breaker", (state) => {
			expect(state).toMatchInlineSnapshot(`
      {
        "hello": "world",
        "role": "Breaker",
      }
			`);
		});

	scenarioOutline("Breaker joins a game")
		.given("the Maker has started a game with the {{word}}", () => {
			return { hello: "world" };
		})
		.when("the Breaker joins the Maker's game", () => {
			return { role: "Breaker" };
		})
		.then("the Breaker is assigned the role of Breaker", (state) => {
			expect(state).toMatchInlineSnapshot(`
      {
        "hello": "world",
        "role": "Breaker",
        "variables": {
          "word": "example word",
        },
      }
    `);
		})
		.examples([{ word: "example word" }]);
});
