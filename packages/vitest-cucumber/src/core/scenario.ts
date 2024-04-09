import { Given } from "./steps";
import type { ScenarioContext } from "./types";

export function scenario(
	scenarioName: string,
	context?: Omit<ScenarioContext, "scenarioName">,
) {
	return new Scenario({ scenarioName, ...context });
}

const scenarioWithChainIdentifierFactory =
	(chainIdentifier: ScenarioContext["chainIdentifier"]) =>
	(scenarioName: string) =>
		scenario(scenarioName, { chainIdentifier });

scenario.only = scenarioWithChainIdentifierFactory("only");
scenario.skip = scenarioWithChainIdentifierFactory("skip");

class Scenario {
	constructor(private context: ScenarioContext) {}

	given<TCallback extends () => any>(step: string, callback: TCallback) {
		return new Given<Record<string, never>, Awaited<ReturnType<TCallback>>>(
			[],
			{ name: step, callback, context: this.context },
		);
	}
}
