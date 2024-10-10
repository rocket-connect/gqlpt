<div align="center" style="text-align: center;">

<img src="https://github.com/rocket-connect/gqlpt/raw/main/apps/docs/static/img/logo.svg" width="20%" alt="GQLPT">

<h1>GQLPT</h1>

<p>Leverage AI to generate GraphQL queries from plain text.</p>

[gqlpt.dev/docs](https://www.gqlpt.dev/docs)

[![npm version](https://badge.fury.io/js/gqlpt.svg)](https://badge.fury.io/js/gqlpt) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

[![](https://github.com/rocket-connect/gqlpt/raw/main/docs/screenshot.png)](https://www.gqlpt.dev/)

Image showing the online playground for [gqlpt.dev](https://www.gqlpt.dev/). GQLPT is a npm package that allows you to generate GraphQL queries from plain text using AI.

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

## License

MIT - Rocket Connect - https://github.com/rocket-connect
