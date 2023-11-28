import { describe, expect, test } from "@jest/globals";
import dotenv from "dotenv";
import { parse, print } from "graphql";

import { GQLPTClient } from "../src";

dotenv.config();

const TEST_API_KEY = process.env.TEST_API_KEY as string;

function parsePrint(query: string) {
  const parsed = parse(query, { noLocation: true });

  // delete the name of the query, makes it easier to test as the name is random
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  parsed.definitions[0].name = undefined;

  return print(parsed);
}

describe("GQLPTClient", () => {
  test("should throw cannot parse typeDefs", async () => {
    expect(() => {
      new GQLPTClient({
        apiKey: TEST_API_KEY,
        typeDefs: "INVALID",
      });
    }).toThrow("Cannot parse typeDefs");
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

    const gqlpt = new GQLPTClient({ apiKey: TEST_API_KEY, typeDefs });

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

    const gqlpt = new GQLPTClient({ apiKey: TEST_API_KEY, typeDefs });

    await gqlpt.connect();
    const { query, variables } = await gqlpt.generate(
      "find users and there posts where name is dan",
    );

    expect(parsePrint(query)).toEqual(
      parsePrint(`
          query ($name: String) {
            users(where: {name: $name}) {
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

    expect(variables).toMatchObject({
      name: "dan",
    });
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

    const gqlpt = new GQLPTClient({ apiKey: TEST_API_KEY, typeDefs });

    await gqlpt.connect();
    const { query, variables } = await gqlpt.generate(
      "create user with name dan and his friends bob and alice",
    );

    expect(parsePrint(query)).toEqual(
      parsePrint(
        `
          mutation ($input: CreateUserInput) {
            createUser(input: $input) {
              id
              name
              email
            }
          }
        `,
      ),
    );

    expect(variables).toMatchObject({
      input: {
        name: "dan",
        friends: [
          {
            name: "bob",
          },
          {
            name: "alice",
          },
        ],
      },
    });
  });
});
