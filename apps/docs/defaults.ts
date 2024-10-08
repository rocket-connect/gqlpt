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
