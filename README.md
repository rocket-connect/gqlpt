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
npm install gqlpt @gqlpt/adapter-openai
```

## Usage

```ts
import { AdapterOpenAI } from "@gqlpt/adapter-openai";

import { GQLPTClient } from "gqlpt";

const typeDefs = /* GraphQL */ `
  type User {
    id: ID!
    name: String!
  }

  type Query {
    user(id: ID!): User
  }
`;

const client = new GQLPTClient({
  typeDefs,
  adapter: new AdapterOpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  }),
});

async function main() {
  await client.connect();

  const query = "Find users by id 1";

  const response = await client.generateQueryAndVariables(query);

  console.log(response);
  /*
    {
        query: 'query ($id: ID!) {\n  user(id: $id) {\n    id\n    name\n  }\n}',
        variables: { id: '1' }
    }
  */
}

main();
```

## FAQs

1. I'm seeing the error "429 - Rate limit reached for requests" on making requests.

This error is related to sending too many requests to OpenAI, and them trying to rate-limit you. Try limiting the requests to gqlpt, or upgrading to a [paid OpenAI API plan](https://help.openai.com/en/articles/6891829-error-code-429-rate-limit-reached-for-requests). In case of persistent errors, create an issue with us, or reach out to [OpenAI support](https://help.openai.com/en/) for OpenAI related errors.

## License

MIT - Rocket Connect - https://github.com/rocket-connect
