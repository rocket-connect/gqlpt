<div align="center" style="text-align: center;">

<img src="./apps/playground/public/logo.svg" width="20%" alt="GQLPT">

<h1>GQLPT</h1>

<p>Leverage AI to generate GraphQL queries from plain text.</p>

[![npm version](https://badge.fury.io/js/gqlpt.svg)](https://badge.fury.io/js/gqlpt) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

[![](./docs/screenshot.png)](https://www.gqlpt.dev/)

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
        users(name: "dan") {
            id
            name
            email
        }
    }
*/
```

## FAQs

1. I'm seeing the error "429 - Rate limit reached for requests" on making requests.

This error is related to sending too many requests to OpenAI, and them trying to rate-limit you. Try limiting the requests to gqlpt, or upgrading to a [paid OpenAI API plan](https://help.openai.com/en/articles/6891829-error-code-429-rate-limit-reached-for-requests). In case of persistent errors, create an issue with us, or reach out to [OpenAI support](https://help.openai.com/en/) for OpenAI related errors.

## License

MIT - Rocket Connect - https://github.com/rocket-connect
