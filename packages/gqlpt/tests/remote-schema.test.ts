import { AdapterOpenAI } from "@gqlpt/adapter-openai";
import { startServer, typeDefs } from "@gqlpt/utils";

import { describe, test } from "@jest/globals";
import dotenv from "dotenv";
import { parse, print } from "graphql";
import { Server } from "http";

import { GQLPTClient } from "../src";

dotenv.config();

const TEST_API_KEY = process.env.TEST_API_KEY as string;

const adapter = new AdapterOpenAI({
  apiKey: TEST_API_KEY,
});

describe("Remote Schema", () => {
  let server: Server;

  beforeAll(async () => {
    server = await startServer({
      port: 4000,
    });
  });

  afterAll(() => {
    server.close();
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
});
