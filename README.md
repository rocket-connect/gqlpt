# gqlpt

GQLPT leverages the power of ChatGPT to generate GraphQL queries from plain text.

Live playground: https://gqlpt.dev/

## Installation

https://www.npmjs.com/package/gqlpt

```bash
npm install gqlpt
```

## Usage

```ts
import { GQLPTClient } from "gqlpt";

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
  apiKey: "chatgpt-api-key",
  typeDefs,
});

await gqlpt.connect();

const response = await gqlpt.generate("Get all users where name is dan");

/*
    query {
        users(where: { name: "dan" }) {
            id
            name
            email
        }
    }
*/
```

## License

MIT - Dan Starns - danielstarns@hotmail.com
