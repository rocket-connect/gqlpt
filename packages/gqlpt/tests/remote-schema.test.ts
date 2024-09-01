import { AdapterAnthropic } from "@gqlpt/adapter-anthropic";
import { AdapterOpenAI } from "@gqlpt/adapter-openai";
import { resolvers, startServer, typeDefs } from "@gqlpt/utils";

import { describe, test } from "@jest/globals";
import dotenv from "dotenv";
import { parse, print } from "graphql";
import { Server } from "http";

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
  describe(`Remote Schema with ${name} Adapter`, () => {
    let server: Server;

    beforeAll(async () => {
      server = await startServer({
        port: 4000,
      });
    });

    afterAll(() => {
      server.close();
    });

    test("should throw when calling generateQueryAndVariables without connecting", async () => {
      const gqlpt = new GQLPTClient({
        adapter,
        url: "http://localhost:4000/graphql",
      });

      // gqlpt.connect() is not called

      await expect(
        gqlpt.generateQueryAndVariables("Find users by id 1"),
      ).rejects.toThrow("Missing typeDefs");
    });

    test("should connect to the server", async () => {
      const gqlpt = new GQLPTClient({
        adapter,
        url: "http://localhost:4000/graphql",
      });

      await gqlpt.connect();

      const generatedTypeDefs = gqlpt.getTypeDefs() as string;

      expect(print(parse(generatedTypeDefs))).toEqual(print(parse(typeDefs)));
    });

    test("should generateAndSend with inline", async () => {
      const gqlpt = new GQLPTClient({
        adapter,
        url: "http://localhost:4000/graphql",
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
