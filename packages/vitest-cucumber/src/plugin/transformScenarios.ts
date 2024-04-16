import * as recast from "recast";

const { identifier, memberExpression, callExpression } = recast.types.builders;
const { MemberExpression, ExpressionStatement, Identifier, CallExpression } =
  recast.types.namedTypes;

const scenarioNames = ["scenario", "scenarioOutline"];

export function transformScenarios(code: string): string {
  const ast = recast.parse(code);
  recast.visit(ast, {
    visitCallExpression(path) {
      const { node } = path;

      if (
        Identifier.check(node.callee) &&
        scenarioNames.includes(node.callee.name)
      ) {
        const rootCallExpressionPath = findRootCallExpressionPath(path);

        const rootCallExpressionNode = rootCallExpressionPath?.node;

        if (
          rootCallExpressionPath &&
          CallExpression.check(rootCallExpressionNode) &&
          !isBuildAlreadyAdded(rootCallExpressionNode)
        ) {
          rootCallExpressionPath.replace(
            callExpression(
              memberExpression(rootCallExpressionNode, identifier("build")),
              [],
            ),
          );
        }
      }

      this.traverse(path);
    },
    visitMemberExpression(path) {
      const { node } = path;

      // Check if the member expression is a scenario object
      // Case: scenario.only, scenario.skip
      if (
        Identifier.check(node.object) &&
        scenarioNames.includes(node.object.name)
      ) {
        const rootCallExpressionPath = findRootCallExpressionPath(path);

        const rootCallExpressionNode = rootCallExpressionPath?.node;

        if (
          rootCallExpressionPath &&
          CallExpression.check(rootCallExpressionNode) &&
          !isBuildAlreadyAdded(rootCallExpressionNode)
        ) {
          rootCallExpressionPath.replace(
            callExpression(
              memberExpression(rootCallExpressionNode, identifier("build")),
              [],
            ),
          );
        }
      }

      this.traverse(path);
    },
  });

  return recast.prettyPrint(ast).code.toString();
}

function findRootCallExpressionPath(path: any) {
  if (!path.parentPath) {
    return null;
  }

  const { parentPath } = path;
  const parentPathNode = parentPath.node;

  if (parentPathNode && ExpressionStatement.check(parentPathNode)) {
    return path;
  }

  return findRootCallExpressionPath(parentPath);
}

function isBuildAlreadyAdded(
  rootChainNode: recast.types.namedTypes.CallExpression,
): boolean {
  return (
    MemberExpression.check(rootChainNode.callee) &&
    Identifier.check(rootChainNode.callee.property) &&
    rootChainNode.callee.property.name === "build"
  );
}
