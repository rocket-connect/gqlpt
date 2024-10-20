import { AdapterAnthropic } from "@gqlpt/adapter-anthropic";
import { AdapterOpenAI } from "@gqlpt/adapter-openai";
import { resolvers, schema, typeDefs } from "@gqlpt/utils";

import { describe, test } from "@jest/globals";
import dotenv from "dotenv";
import {
  buildSchema,
  lexicographicSortSchema,
  parse,
  print,
  printSchema,
} from "graphql";

import { AdapterOllama } from "../../adapter-ollama/src";
import { GQLPTClient } from "../src";

dotenv.config();

const TEST_OPENAI_API_KEY = process.env.TEST_OPENAI_API_KEY as string;
const TEST_ANTHROPIC_API_KEY = process.env.TEST_ANTHROPIC_API_KEY as string;

const adapters = [
  // {
  //   name: "OpenAI",
  //   adapter: new AdapterOpenAI({ apiKey: TEST_OPENAI_API_KEY }),
  // },
  // {
  //   name: "Anthropic",
  //   adapter: new AdapterAnthropic({ apiKey: TEST_ANTHROPIC_API_KEY }),
  // },
  {
    name: "Ollama",
    adapter: new AdapterOllama({
      baseUrl: process.env.OLLAMA_BASE_URL,
      model: process.env.OLLAMA_MODEL,
    }),
  },
];

adapters.forEach(({ name, adapter }) => {
  describe(`Local Schema with ${name} Adapter`, () => {
    const client = new GQLPTClient({
      adapter,
      schema,
    });

    beforeAll(async () => {
      await client.connect({
        shouldSkipPrime: true,
      });

      const generatedTypeDefs = client.getTypeDefs() as string;
      const ast = buildSchema(typeDefs);
      const sorted = lexicographicSortSchema(ast);

      expect(print(parse(generatedTypeDefs))).toEqual(printSchema(sorted));
    });

    test.skip("should throw have you called connect", async () => {
      const _client = new GQLPTClient({
        adapter,
        schema,
      });

      await expect(() =>
        _client.generateQueryAndVariables("query"),
      ).rejects.toThrow(
        "Missing typeDefs, url or schema - have you called connect?",
      );
    });

    test("should generateAndSend with inline", async () => {
      const response = await client.generateAndSend("Find user by id 1");

      expect(response).toEqual({
        errors: undefined,
        data: {
          user: resolvers.Query.user(undefined, { id: "1" }),
        },
      });
    });
  });
});
