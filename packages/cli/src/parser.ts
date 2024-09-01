import {
  AST_NODE_TYPES,
  TSESTree,
  parse,
} from "@typescript-eslint/typescript-estree";
import fs from "fs/promises";

interface QueryInfo {
  query: string;
  location: { line: number; column: number };
}

export async function parseFiles(files: string[]): Promise<QueryInfo[]> {
  const queries: QueryInfo[] = [];

  for (const file of files) {
    const content = await fs.readFile(file, "utf-8");
    const ast = parse(content, { jsx: true, loc: true });

    const variableMap = new Map<string, string>();

    traverseAST(ast, (node) => {
      if (
        node.type === AST_NODE_TYPES.VariableDeclarator &&
        node.id.type === AST_NODE_TYPES.Identifier &&
        node.init?.type === AST_NODE_TYPES.Literal &&
        typeof node.init.value === "string"
      ) {
        variableMap.set(node.id.name, node.init.value);
      }

      if (isGenerateAndSendCall(node)) {
        const arg = node.arguments[0];
        if (
          arg.type === AST_NODE_TYPES.Literal &&
          typeof arg.value === "string"
        ) {
          queries.push({
            query: arg.value,
            location: arg.loc!.start,
          });
        } else if (arg.type === AST_NODE_TYPES.Identifier) {
          const variableValue = variableMap.get(arg.name);
          if (variableValue) {
            queries.push({
              query: variableValue,
              location: arg.loc!.start,
            });
          }
        }
      }
    });
  }

  return queries;
}

function isGenerateAndSendCall(
  node: TSESTree.Node,
): node is TSESTree.CallExpression {
  return (
    node.type === AST_NODE_TYPES.CallExpression &&
    node.callee.type === AST_NODE_TYPES.MemberExpression &&
    node.callee.property.type === AST_NODE_TYPES.Identifier &&
    node.callee.property.name === "generateAndSend"
  );
}

function traverseAST(
  node: TSESTree.Node,
  callback: (node: TSESTree.Node) => void,
) {
  callback(node);

  if (node.type === AST_NODE_TYPES.Program) {
    node.body.forEach((child) => traverseAST(child, callback));
  } else if ("body" in node && Array.isArray(node.body)) {
    node.body.forEach((child) => traverseAST(child, callback));
  } else {
    Object.keys(node).forEach((key) => {
      const child = (node as any)[key];
      if (typeof child === "object" && child !== null) {
        if (Array.isArray(child)) {
          child.forEach((item) => {
            if (typeof item === "object" && item !== null) {
              traverseAST(item as TSESTree.Node, callback);
            }
          });
        } else {
          traverseAST(child as TSESTree.Node, callback);
        }
      }
    });
  }
}
