import { print, parse } from "graphql";

export const typeDefs = print(
  parse(`
    type User {
        name: String
        email: String
        posts(where: PostWhere): [Post]
    }

    type Post {
        id: ID
        name: String
    }

    input PostWhere {
        title_contains: String
    }

    type Query {
        users: [User]
    }
`)
);

export const query = `find users including posts`;
