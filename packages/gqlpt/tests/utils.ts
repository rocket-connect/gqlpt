import { parse, print } from "graphql";

export type QueryVariation = {
  query: string;
  variables?: Record<string, any>;
};

export type QueryResult = {
  query: string;
  variables?: Record<string, unknown>;
};

export function parsePrint(query: string) {
  const parsed = parse(query, { noLocation: true });
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  parsed.definitions[0].name = undefined;
  return print(parsed);
}

export function assertMatchesVariation(
  actual: QueryResult,
  expectedVariations: QueryVariation[],
) {
  const normalizedActual = {
    query: parsePrint(actual.query),
    variables: actual.variables || {},
  };

  const normalizedExpected = expectedVariations.map((variation) => ({
    query: parsePrint(variation.query),
    variables: variation.variables || {},
  }));

  const matches = normalizedExpected.some(
    (expected) =>
      expected.query === normalizedActual.query &&
      JSON.stringify(expected.variables) ===
        JSON.stringify(normalizedActual.variables),
  );

  if (!matches) {
    throw new Error(
      `Response does not match any expected variations.\n\nActual:\n${JSON.stringify(normalizedActual, null, 2)}\n\nExpected one of:\n${normalizedExpected.map((e) => JSON.stringify(e, null, 2)).join("\n\n")}`,
    );
  }
  return true;
}
