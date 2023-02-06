import { parse, print } from "graphql";
import { GQLPTClient } from "../src";
import * as config from "./config";

function parsePrint(query: string) {
  const parsed = parse(query, { noLocation: true });
  return print(parsed);
}

describe("GQLPTClient", () => {
  test("should throw cannot parse typeDefs", async () => {
    expect(() => {
      const gqlpt = new GQLPTClient({
        apiKey: config.TEST_API_KEY,
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

    const gqlpt = new GQLPTClient({ apiKey: config.TEST_API_KEY, typeDefs });

    await gqlpt.connect();
  });

  test("should throw not connected", async () => {
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

    const gqlpt = new GQLPTClient({ apiKey: config.TEST_API_KEY, typeDefs });

    expect(gqlpt.generate("find users where name is dan")).rejects.toThrow(
      "Not connected"
    );
  });

  test("should return graphql query", async () => {
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

    const gqlpt = new GQLPTClient({ apiKey: config.TEST_API_KEY, typeDefs });

    await gqlpt.connect();
    const { query, variables } = await gqlpt.generate(
      "find users where name is dan"
    );

    expect(parsePrint(query)).toEqual(
      parsePrint(`
        query ($name: String) {
          users(name: $name) {
            id
            name
            email
          }
        }
      `)
    );

    expect(variables).toMatchObject({
      name: "dan",
    });
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

    const gqlpt = new GQLPTClient({ apiKey: config.TEST_API_KEY, typeDefs });

    await gqlpt.connect();
    const { query, variables } = await gqlpt.generate(
      "find users and there posts where name is dan"
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
        `)
    );

    expect(variables).toMatchObject({
      where: {
        name: "dan",
      },
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

    const gqlpt = new GQLPTClient({ apiKey: config.TEST_API_KEY, typeDefs });

    await gqlpt.connect();
    const { query, variables } = await gqlpt.generate(
      "create user with name dan and his friends bob and alice"
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
        `
      )
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
