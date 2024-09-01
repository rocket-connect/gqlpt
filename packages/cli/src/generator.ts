import { GQLPTClient } from "gqlpt";

export async function generateTypes({
  queries,
  client,
}: {
  queries: string[];
  client: GQLPTClient;
}): Promise<string> {
  const map: Record<string, string> = {};

  await Promise.all(
    queries.map(async (query) => {
      const { typeDefinition } =
        await client.generateQueryAndTypeForBuild(query);

      map[query] = typeDefinition;
    }),
  );

  const content = `
// This file is auto-generated. Do not edit manually.
// This will be populated by the CLI if used
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface GeneratedTypeMap {
${Object.entries(map)
  .map(([query, type]) => `  "${query}": ${type};`)
  .join("\n")}
}

// Default type map for when CLI is not used or for fallback
export type DefaultTypeMap = Record<string, any>;
//# sourceMappingURL=types.d.ts.map
`;

  return content;
}
