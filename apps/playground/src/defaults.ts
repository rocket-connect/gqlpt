import { parse, print } from "graphql";

export const typeDefs = print(
  parse(`
        type User {
            name: String
            email: String
            posts: [Post]
        }
        
        type Post {
            id: ID
            name: String
        }
        
        input UserWhere {
            name: String
        }
        
        type Query {
            users(where: UserWhere): [User]
        }
    `),
);

export const query = `find user dan and his posts`;
