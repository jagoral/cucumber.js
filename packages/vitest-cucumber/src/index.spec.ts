import { expect } from "vitest";
import { feature, scenario } from ".";

feature("Example test", () => {
	scenario("Breaker joins a game")
		.given('the Maker has started a game with the word "silky"', () => {
			return { word: "silky" };
		})
		.when("the Breaker joins the Maker's game", () => {
			return { role: "Breaker" };
		})
		.then("the Breaker is assigned the role of Breaker", (state) => {
			expect(state).toMatchInlineSnapshot(`
				{
				  "role": "Breaker",
				  "word": "silky",
				}
			`);
		});
});
