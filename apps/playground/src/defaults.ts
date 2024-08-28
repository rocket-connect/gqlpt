import { parse, print } from "graphql";

export const typeDefs = print(
  parse(`
      type Login {
        id: ID!
        createdAt: String!
        user: User!
      }
      
      type User {
        name: String!
        logins: [Login!]!
      }
      
      input UserWhere {
        name: String!
      }
      
      input DateWhere {
        gt: String
        lt: String
      }
      
      input LoginWhere {
        date: DateWhere
        user: UserWhere
      }
      
      type Query {
        logins(where: LoginWhere): [Login!]!
        users(where: UserWhere): [User!]!
      }
  `),
);

export const query = `find all login's by dan`;

export const response = `query logins($where: LoginWhere!) {
  logins(where: $where) {
    id
    createdAt
    user {
      name
    }
  }
}`;

export const args = JSON.stringify({
  loginWhere: {
    user: {
      name: "dan",
    },
  },
});

export const gettingStarted = `import { AdapterOpenAI } from "@gqlpt/adapter-openai";
import { GQLPTClient } from "gqlpt";

const typeDefs = /* GraphQL */ \`
  type User {
    id: ID!
    name: String!
  }

  type Query {
    user(id: ID!): User
  }
\`;

const client = new GQLPTClient({
  typeDefs,
  adapter: new AdapterOpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  }),
});

const response = await client.generate(
  "Find users by id 1"
);
// query ($id: ID!) {user(id: $id) { id name } }
`;
