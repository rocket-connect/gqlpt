import { GQLPTClient } from "gqlpt";

export async function generateTypesAndQueries({
  queries,
  client,
  schemaHash,
}: {
  queries: string[];
  client: GQLPTClient;
  schemaHash: string;
}): Promise<{
  typesContent: string;
  queriesContent: string;
}> {
  const map: Record<
    string,
    {
      query: string;
      typeDefinition: string;
      variables: any;
    }
  > = {};

  await Promise.all(
    queries.map(async (plainText) => {
      const {
        typeDefinition,
        query: generatedQuery,
        variables,
      } = await client.generateQueryAndTypeForBuild(plainText);

      map[plainText] = {
        query: generatedQuery,
        typeDefinition,
        variables,
      };
    }),
  );

  const sortedEntries = Object.entries(map).sort(([a], [b]) =>
    a.localeCompare(b),
  );

  const typesContent = `
// This file is auto-generated. Do not edit manually.
// This will be populated by the CLI if used
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface GeneratedTypeMap {
${sortedEntries.map(([plainText, { typeDefinition }]) => `  "${plainText}": ${typeDefinition};`).join("\n")}
}

// Default type map for when CLI is not used or for fallback
export type DefaultTypeMap = Record<string, any>;
//# sourceMappingURL=types.d.ts.map
`;

  const queriesJson: Record<string, any> = {
    [schemaHash]: {},
  };

  sortedEntries.forEach(([plainText, entry]) => {
    const { query, variables } = entry;
    queriesJson[schemaHash][plainText] = {
      query,
      variables,
    };
  });

  return { typesContent, queriesContent: JSON.stringify(queriesJson, null, 2) };
}
