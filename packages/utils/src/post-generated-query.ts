export async function postGeneratedQuery({
  query,
  variables,
  url,
  headers,
}: {
  query: string;
  variables?: Record<string, unknown>;
  url: string;
  headers?: Record<string, string>;
}): Promise<{
  errors?: any;
  data?: any;
}> {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(headers || {}),
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  const json = (await response.json()) as any;

  return {
    errors: json.errors,
    data: json.data,
  };
}
