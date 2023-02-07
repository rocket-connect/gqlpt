import { useCallback, useEffect, useState } from "react";
import { Spinner } from "./components/Spinner";
import { Editor } from "./components/Editor";

function App() {
  const [apiKey, setApiKey] = useState<string>(
    localStorage.getItem("apiKey") || ""
  );
  const [typeDefs, setTypeDefs] = useState<string>(
    localStorage.getItem("typeDefs") || ""
  );
  const [query, setQuery] = useState<string>(
    localStorage.getItem("query") || ""
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

      const res = await fetch("http://localhost:4000/generate", {
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
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [apiKey, typeDefs, query]);

  return (
    <div>
      <div className="container mx-auto bg-gray-100 rounded-xl shadow border p-8 m-10">
        <p className="text-3xl text-gray-700 font-bold mb-5">GQLTP</p>
        <p className="text-gray-500 text-lg">
          GQLPT leverages the power of ChatGPT to generate GraphQL queries from
          plain text.
        </p>

        <input
          className="mt-5 shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="apikey"
          type="password"
          placeholder="API KEY"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
        />
      </div>

      <div className="container mx-auto flex align-center justify-center mt-5">
        <input
          className="text-2xl shadow appearance-none border rounded py-2 w-4/6 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
          className="ml-5 text-2xl w-1/5 border border-transparent rounded bg-indigo-600 py-2 px-3 text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Generate
        </button>
      </div>

      {(error || loading) && (
        <div className="container mx-auto flex flex-col justify-center align-center">
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

      <div className="container mx-auto flex align-center justify-center mt-10">
        <div className="bg-gray-100 rounded-xl shadow border p-8 m-5">
          <h2 className="text-2xl text-gray-700 font-bold bold mb-5">Schema</h2>
          <Editor
            value={typeDefs}
            onChange={setTypeDefs}
            width={600}
            height={700}
          />
        </div>
        <div className="bg-gray-100 rounded-xl shadow border p-8 m-5">
          <div className="flex flex-col">
            <div>
              <h2 className="text-2xl text-gray-700 font-bold bold mb-5">
                Query
              </h2>
              <Editor
                value={generatedQuery}
                onChange={() => {}}
                width={600}
                readonly={true}
                height={300}
              />
            </div>
            <div className="mt-10">
              <h2 className="text-2xl text-gray-700 font-bold bold mb-5">
                Variables
              </h2>
              <Editor
                value={JSON.stringify(generatedVariables, null, 2)}
                onChange={() => {}}
                readonly={true}
                width={600}
                height={300}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
