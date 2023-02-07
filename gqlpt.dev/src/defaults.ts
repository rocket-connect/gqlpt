export const typeDefs = `
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

    input UserWhere {
        name: String
        name_eq: String
        email_contains: String
    }

    type Query {
        users(where: UserWhere): [User]
    }
`;

export const query = `find someone with the email danielstarns@hotmail.com including posts where title contains 'beer'`;
