const variableRegex = /\{{(.*?)}}/g;
const variablePrefix = "{{";
const variableSuffix = "}}";

export function getVariablesFromText(text: string): string[] {
  const matches = text.match(variableRegex);
  return matches
    ? matches.map((match) =>
        match.replace(variablePrefix, "").replace(variableSuffix, "").trim(),
      )
    : [];
}

export function injectVariables(
  text: string,
  variables: Record<string, string | number>,
): string {
  return text.replace(variableRegex, (match, variableName) => {
    return `${variables[variableName.trim()]}` || match;
  });
}
