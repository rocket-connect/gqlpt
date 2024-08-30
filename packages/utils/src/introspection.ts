import { getIntrospectionQuery } from "graphql";

export async function introspection({
  url,
  headers,
}: {
  url: string;
  headers?: Record<string, string>;
}) {
  const introspectionQuery = getIntrospectionQuery();

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(headers || {}),
    },
    body: JSON.stringify({
      query: introspectionQuery,
    }),
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  const json = (await response.json()) as any;

  if (json.errors) {
    throw new Error(JSON.stringify(json.errors, null, 2));
  }

  return json;
}
