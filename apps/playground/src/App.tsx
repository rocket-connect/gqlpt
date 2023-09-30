import { useCallback, useEffect, useState } from "react";

import { Editor } from "./components/Editor";
import { Spinner } from "./components/Spinner";
import * as defaultValues from "./defaults";

const config = {
  API_URL: process.env.API_URL || "",
};

export function App() {
  const [apiKey, setApiKey] = useState<string>(
    localStorage.getItem("apiKey") || "",
  );
  const [typeDefs, setTypeDefs] = useState<string>(
    localStorage.getItem("typeDefs") || defaultValues.typeDefs,
  );
  const [query, setQuery] = useState<string>(
    localStorage.getItem("query") || defaultValues.query,
  );

  const [generatedQuery, setGeneratedQuery] = useState<string>();
  const [generatedVariables, setGeneratedVariables] =
    useState<Record<string, unknown>>();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

  useEffect(() => {
    localStorage.setItem("apiKey", apiKey);
  }, [apiKey]);

  useEffect(() => {
    localStorage.setItem("typeDefs", typeDefs);
  }, [typeDefs]);

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
      setGeneratedQuery(data.query);
    } catch (error) {
      const e = error as Error;
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [apiKey, typeDefs, query]);

  return (
    <div className="bg-editor-dark py-10">
      <div className="container mx-auto bg-gray-100 rounded-xl shadow border p-8">
        <h1 className="text-3xl text-gray-700 font-bold mb-5">GQLPT</h1>
        <p className="text-gray-500 text-lg mt-5">
          GQLPT leverages the power of ChatGPT to generate GraphQL queries from
          plain text.
        </p>
        <p className="text-blue-500 text-lg mt-5">
          <a href="https://github.com/rocket-connect/gqlpt">
            https://github.com/rocket-connect/gqlpt
          </a>
        </p>
        <p className="text-gray-500 italic text-lg mt-5">
          Put your non production{" "}
          <a className="text-blue-500" href="https://openai.com/">
            https://openai.com/
          </a>{" "}
          API key here:
        </p>
        <input
          className="mt-5 w-2/5 shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="apikey"
          type="password"
          placeholder="API KEY"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
        />
      </div>

      <div className="container mx-auto bg-gray-100 rounded-xl shadow border p-8 m-10">
        <p className="text-gray-500 text-lg my-5 text-center">
          Write your question here:
        </p>

        <div className="container mx-auto flex align-center justify-center mt-5">
          <input
            className="shadow appearance-none border rounded py-2 w-5/6 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="apikey"
            type="text"
            placeholder="Query"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            readOnly={loading}
          />

          <button
            onClick={generate}
            disabled={loading}
            type="submit"
            className="ml-5 text-2xl w-1/6 border border-transparent rounded bg-indigo-600 py-2 px-3 text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Generate
          </button>
        </div>
      </div>

      {(error || loading) && (
        <div className="container mx-auto flex flex-col justify-center align-center mt-10">
          {error && (
            <div className="w-2/5 mt-5 mx-auto flex align-center justify-center bg-gray-100 rounded-xl shadow border p-8">
              <p className="text-red-900">{error}</p>
            </div>
          )}

          {loading && (
            <div className="w-2/5 mt-5 mx-auto flex align-center justify-center bg-gray-100 rounded-xl shadow border p-8">
              <Spinner />
            </div>
          )}
        </div>
      )}

      <div className="container mx-auto flex align-center justify-between mt-10">
        <div className="bg-gray-100 rounded-xl shadow border p-8 m-5">
          <h2 className="text-2xl text-gray-700 font-bold bold mb-5">Schema</h2>

          <p className="text-gray-500 text-lg my-5">Put your typeDefs here:</p>

          <Editor
            value={typeDefs}
            onChange={setTypeDefs}
            width={650}
            height={900}
          />
        </div>
        <div className="bg-gray-100 rounded-xl shadow border p-8 m-5">
          <div className="flex flex-col">
            <div>
              <h2 className="text-2xl text-gray-700 font-bold bold mb-5">
                Query
              </h2>
              <p className="text-gray-500 text-lg my-5">
                This will be the generated GraphQL query:
              </p>

              <Editor
                value={generatedQuery}
                onChange={() => {}}
                width={650}
                readonly={true}
                height={400}
              />
            </div>
            <div className="mt-10">
              <h2 className="text-2xl text-gray-700 font-bold bold mb-5">
                Variables
              </h2>

              <p className="text-gray-500 text-lg my-5">
                This will be the generated variables:
              </p>

              <Editor
                value={JSON.stringify(generatedVariables, null, 2)}
                onChange={() => {}}
                readonly={true}
                width={650}
                height={400}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
