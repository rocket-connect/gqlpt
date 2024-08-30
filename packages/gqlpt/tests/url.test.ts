import { AdapterOpenAI } from "@gqlpt/adapter-openai";

import { describe, test } from "@jest/globals";
import dotenv from "dotenv";
import { parse, print } from "graphql";

import { GQLPTClient } from "../src";

dotenv.config();

const TEST_API_KEY = process.env.TEST_API_KEY as string;

const adapter = new AdapterOpenAI({
  apiKey: TEST_API_KEY,
});

function parsePrint(query: string) {
  const parsed = parse(query, { noLocation: true });

  // delete the name of the query, makes it easier to test as the name is random
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  parsed.definitions[0].name = undefined;

  return print(parsed);
}

describe("GQLPTClient", () => {
  test("should connect to the server", async () => {
    const typeDefs = `
      type User {
        id: ID!
        name: String!
        email: String!
      }
      
      type Query {
        users(name: String): [User!]!
      }
    `;

    const gqlpt = new GQLPTClient({
      adapter,
      url: "http://localhost:4000/graphql",
    });

    await gqlpt.connect();
  });
});
