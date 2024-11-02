import { AdapterAnthropic } from "@gqlpt/adapter-anthropic";
import { AdapterOpenAI } from "@gqlpt/adapter-openai";

import { describe, expect, test } from "@jest/globals";
import dotenv from "dotenv";

import { GQLPTClient } from "../src";
import { assertMatchesVariation, parsePrint } from "./utils";

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
  describe(`GQLPTClient with ${name} Adapter`, () => {
    test("should throw cannot parse typeDefs", () => {
      expect(() => {
        new GQLPTClient({ adapter, typeDefs: "INVALID" });
      }).toThrow("Cannot parse typeDefs");
    });

    test("should throw Missing typeDefs, url or schema", () => {
      expect(() => {
        new GQLPTClient({ adapter });
      }).toThrow("Missing typeDefs, url or schema");
    });

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

      const gqlpt = new GQLPTClient({ adapter, typeDefs });
      await gqlpt.connect();
    });

    test("should return complex graphql query", async () => {
      const typeDefs = `
        type User {
          id: ID!
          name: String!
          email: String!
          posts: [Post!]!
        }

        type Post {
          id: ID!
          title: String!
          body: String!
        }
        
        input UserWhereInput {
          name: String
        }

        type Query {
          users(where: UserWhereInput): [User!]!
        }
      `;

      const gqlpt = new GQLPTClient({ adapter, typeDefs });

      await gqlpt.connect();
      const result = await gqlpt.generateQueryAndVariables(
        "find users and their posts where name is dan, inject args into an object",
      );

      assertMatchesVariation(result, [
        {
          query: `
            query ($where: UserWhereInput) {
              users(where: $where) {
                id
                name
                email
                posts {
                  id
                  title
                  body
                }
              }
            }
          `,
          variables: {
            where: { name: "dan" },
          },
        },
      ]);
    });

    test("should generate mutation", async () => {
      const typeDefs = `
        type User {
          id: ID!
          name: String!
          email: String!
        }
        
        input FriendInput {
          name: String!
        }

        input CreateUserInput {
          name: String!
          friends: [FriendInput!]
        }

        type CreateUserResponse {
          success: Boolean!
          user: User
        }

        type Mutation {
          createUser(input: CreateUserInput!): [User!]!
        }
      `;

      const gqlpt = new GQLPTClient({ adapter, typeDefs });

      await gqlpt.connect();
      const result = await gqlpt.generateQueryAndVariables(
        "create user with name dan and his friends bob and alice",
      );

      assertMatchesVariation(result, [
        {
          query: `
            mutation ($input: CreateUserInput!) {
              createUser(input: $input) {
                id
                name
                email
              }
            }
          `,
          variables: {
            input: {
              name: "dan",
              friends: [{ name: "bob" }, { name: "alice" }],
            },
          },
        },
      ]);
    });

    test("should return fields in alphabetical order", async () => {
      const typeDefs = `
        type User {
          zebra: String!
          apple: String!
          monkey: String!
          banana: String!
          cat: String!
        }
        
        type Query {
          user: User!
        }
      `;

      const gqlpt = new GQLPTClient({ adapter, typeDefs });

      await gqlpt.connect();
      const { query } = await gqlpt.generateQueryAndTypeForBuild(
        "get all user fields",
      );

      expect(parsePrint(query)).toBe(
        parsePrint(`
          query {
            user {
              apple
              banana
              cat
              monkey
              zebra
            }
          }
        `),
      );
    });
  });
});
