import { parse } from "@typescript-eslint/typescript-estree";
import fs from "fs/promises";

export async function parseFiles(files: string[]): Promise<string[]> {
  const queries: string[] = [];

  for (const file of files) {
    const content = await fs.readFile(file, "utf-8");
    const ast = parse(content, {
      jsx: true,
      range: true,
    });

    traverseAST(ast, (node) => {
      if (
        node.type === "CallExpression" &&
        node.callee.type === "MemberExpression" &&
        node.callee.property.type === "Identifier" &&
        node.callee.property.name === "generateAndSend" &&
        node.arguments[0]?.type === "Literal"
      ) {
        queries.push(node.arguments[0].value as string);
      }
    });
  }

  return queries;
}

function traverseAST(node: any, callback: (node: any) => void) {
  callback(node);
  for (const key in node) {
    if (typeof node[key] === "object" && node[key] !== null) {
      traverseAST(node[key], callback);
    }
  }
}
