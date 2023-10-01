import * as prettier from "prettier/standalone";
import { useCallback, useEffect, useState } from "react";

import * as defaultValues from "../../defaults";
import { CodeBlock } from "../utils/CodeBlock";
import { Container } from "../utils/Container";
import { Spinner } from "../utils/Spinner";
import { Intro } from "../views/Intro";

const config = {
  API_URL: process.env.API_URL || "",
};

export function Home() {
  const [apiKey, setApiKey] = useState<string>(
    localStorage.getItem("apiKey") || "",
  );
  const [typeDefs] = useState<string>(defaultValues.typeDefs);
  const [query, setQuery] = useState<string>(
    localStorage.getItem("query") || defaultValues.query,
  );

  const [generatedQuery, setGeneratedQuery] = useState<string>(
    defaultValues.response,
  );
  const [generatedVariables, setGeneratedVariables] = useState<
    Record<string, unknown>
  >(JSON.parse(defaultValues.args));

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

  useEffect(() => {
    localStorage.setItem("apiKey", apiKey);
  }, [apiKey]);

  useEffect(() => {
    localStorage.setItem("query", query);
  }, [query]);

  const generate = useCallback(async () => {
    try {
      setLoading(true);
      setError(undefined);

      const res = await fetch(`${config.API_URL}/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          typeDefs,
          query,
          apiKey,
        }),
      });

      if (!res.ok) {
        throw new Error(await res.text());
      }

      const data = await res.json();

      setGeneratedVariables(data.variables);

      const formattedQuery = await prettier.format(data.query, {
        parser: "graphql",
        plugins: [require("prettier/parser-graphql")],
        printWidth: 20,
      });

      setGeneratedQuery(formattedQuery);
    } catch (error) {
      const e = error as Error;
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [apiKey, typeDefs, query]);

  return (
    <div>
      <Intro />
      <div className="bg-graphiql-medium py-10">
        <Container>
          <div className="w-4/6 mx-auto flex flex-col gap-10">
            <div className="flex w-full gap-10">
              <div className="w-1/3">
                <p className="text-lg">OpenAPI Key:</p>
                <input
                  className="rounded w-full bg-graphiql-light p-3 text-graphiql-dark font-bold"
                  id="apikey"
                  type="password"
                  placeholder="API KEY"
                  disabled={loading}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
              </div>

              <div className="flex-1">
                <p className="text-lg">Your Question:</p>
                <div className="flex gap-10">
                  <input
                    className="rounded w-full bg-graphiql-light p-3 text-graphiql-dark font-bold"
                    id="apikey"
                    type="text"
                    disabled={loading}
                    placeholder="Query"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    readOnly={loading}
                  />

                  <button
                    onClick={generate}
                    disabled={loading}
                    type="submit"
                    className="rounded bg-graphiql-dark hover:bg-graphiql-light hover:text-graphiql-dark px-3"
                  >
                    {!loading && "Generate"}
                    {loading && (
                      <div className="px-3">
                        <Spinner />
                      </div>
                    )}
                  </button>
                </div>
              </div>
            </div>
            {error && (
              <div className="flex flex-col justify-center align-center">
                {error && (
                  <div className="flex flex-col gap-5 bg-graphiql-dark rounded-xl p-10">
                    <p className="text-2xl">Something went wrong :/</p>
                    <p>{error}</p>
                  </div>
                )}
              </div>
            )}
            <div className="flex gap-10 w-full">
              <div className="bg-graphiql-dark rounded-xl w-5/6">
                <CodeBlock
                  title="schema.graphql"
                  code={typeDefs}
                  language="graphql"
                />
              </div>
              <div className="bg-graphiql-dark rounded-xl w-5/6">
                <div className="flex flex-col">
                  <CodeBlock
                    title="query.graphql"
                    code={generatedQuery}
                    language="graphql"
                  />
                  <CodeBlock
                    title="variables.json"
                    code={JSON.stringify(generatedVariables, null, 2)}
                    language="json"
                  />
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
}
