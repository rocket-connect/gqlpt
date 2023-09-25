<div align="center" style="text-align: center;">

<img src="./apps/playground/public/logo.svg" width="20%" alt="GraphQL Debugger">

<h1>GQLPT</h1>

<p>Debug your GraphQL server locally.</p>

[![npm version](https://badge.fury.io/js/gqlpt.svg)](https://badge.fury.io/js/gqlpt) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

</div>

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

MIT - Rocket Connect - https://github.com/rocket-connect
