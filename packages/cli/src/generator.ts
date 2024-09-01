import { generateAITypes } from "./ai-type-generator";

// You'll need to implement this

export async function generateTypes(queries: string[]): Promise<string> {
  const typeMap = await generateAITypes(queries);

  const content = `
// This file is auto-generated. Do not edit manually.

// This will be populated by the CLI if used
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface GeneratedTypeMap {
${Object.entries(typeMap)
  .map(([query, type]) => `  ${JSON.stringify(query)}: ${type};`)
  .join("\n")}
}

// Default type map for when CLI is not used or for fallback
export type DefaultTypeMap = Record<string, any>;
`;

  return content;
}
