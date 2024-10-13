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

import { GQLPTClient } from "../src";

dotenv.config();

const TEST_OPENAI_API_KEY = process.env.TEST_OPENAI_API_KEY as string;
const TEST_ANTHROPIC_API_KEY = process.env.TEST_ANTHROPIC_API_KEY as string;

const adapters = [
  {
    name: "OpenAI",
    adapter: new AdapterOpenAI({ apiKey: TEST_OPENAI_API_KEY }),
  },
  {
    name: "Anthropic",
    adapter: new AdapterAnthropic({ apiKey: TEST_ANTHROPIC_API_KEY }),
  },
];

adapters.forEach(({ name, adapter }) => {
  describe(`Local Schema with ${name} Adapter`, () => {
    test("should connect to the server", async () => {
      const gqlpt = new GQLPTClient({
        adapter,
        schema,
      });

      await gqlpt.connect();

      const generatedTypeDefs = gqlpt.getTypeDefs() as string;
      const ast = buildSchema(typeDefs);
      const sorted = lexicographicSortSchema(ast);

      expect(print(parse(generatedTypeDefs))).toEqual(printSchema(sorted));
    });

    test("should generateAndSend with inline", async () => {
      const gqlpt = new GQLPTClient({
        adapter,
        schema,
      });

      await gqlpt.connect();

      const response = await gqlpt.generateAndSend("Find users by id 1");

      expect(response).toEqual({
        errors: undefined,
        data: {
          user: resolvers.Query.user(undefined, { id: "1" }),
        },
      });
    });
  });
});
