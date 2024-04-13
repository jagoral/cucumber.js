import { Given } from "./steps";
import type { Callback, ScenarioContext } from "./types";

export function scenario(
	scenarioName: string,
	context?: Omit<ScenarioContext, "scenarioName">,
) {
	return new Scenario({ scenarioName, type: "scenario", ...context });
}

export function scenarioOutline(
	scenarioName: string,
	context?: Omit<ScenarioContext, "scenarioName">,
) {
	return new Scenario({ scenarioName, type: "scenarioOutline", ...context });
}

const scenarioWithContextFactory =
	(context: Omit<ScenarioContext, "scenarioName">) => (scenarioName: string) =>
		scenario(scenarioName, context);

scenario.only = scenarioWithContextFactory({
	chainIdentifier: "only",
	type: "scenario",
});
scenario.skip = scenarioWithContextFactory({
	chainIdentifier: "only",
	type: "scenario",
});

scenarioOutline.only = scenarioWithContextFactory({
	chainIdentifier: "only",
	type: "scenarioOutline",
});

scenarioOutline.skip = scenarioWithContextFactory({
	chainIdentifier: "skip",
	type: "scenarioOutline",
});

class Scenario {
	constructor(private context: ScenarioContext) {}

	given<TName extends string, TGivenReturn extends object | void>(
		step: TName,
		callback: Callback<TName, Record<string, never>, TGivenReturn>,
	) {
		return new Given<TName, Record<string, never>, TGivenReturn>([], {
			name: step,
			callback,
			context: this.context,
		});
	}
}
