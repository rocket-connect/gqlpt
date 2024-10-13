import { AdapterAnthropic } from "@gqlpt/adapter-anthropic";
import { AdapterOpenAI } from "@gqlpt/adapter-openai";

import { describe, expect, test } from "@jest/globals";
import dotenv from "dotenv";
import { parse, print } from "graphql";

import { GQLPTClient } from "../src";

dotenv.config();

const TEST_OPENAI_API_KEY = process.env.TEST_OPENAI_API_KEY as string;
const TEST_ANTHROPIC_API_KEY = process.env.TEST_ANTHROPIC_API_KEY as string;

function parsePrint(query: string) {
  const parsed = parse(query, { noLocation: true });
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  parsed.definitions[0].name = undefined;
  return print(parsed);
}

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
      const { query, variables } = await gqlpt.generateQueryAndVariables(
        "find users and their posts where name is dan, inject args into an object",
      );

      expect(parsePrint(query)).toEqual(
        parsePrint(`
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
        `),
      );

      expect(variables).toMatchObject({});
    });

    test("should generate mutation", async () => {
      const typeDefs = `
        type User {
          id: ID!
          name: String!
          email: String!
        }
        
        input CreateUserInput {
          name: String!
          friends: [CreateUserInput]
        }

        type CreateUserResponse {
          success: Boolean!
          user: User
        }

        type Mutation {
          createUser(input: CreateUserInput): [User!]!
        }
      `;

      const gqlpt = new GQLPTClient({ adapter, typeDefs });

      await gqlpt.connect();
      const { variables } = await gqlpt.generateQueryAndVariables(
        "create user with name dan and his friends bob and alice",
      );

      expect(variables).toMatchObject({
        input: {
          name: "dan",
          friends: [{ name: "bob" }, { name: "alice" }],
        },
      });
    });
  });
});
