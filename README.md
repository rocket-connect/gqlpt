<div align="center" style="text-align: center;">

<img src="https://github.com/rocket-connect/gqlpt/raw/main/docs/gqlpt.svg" width="20%" alt="GQLPT">

<h1>GQLPT</h1>

<p>Leverage AI to generate GraphQL queries from plain text.</p>

[gqlpt.dev/docs](https://www.gqlpt.dev/docs)

[![npm version](https://badge.fury.io/js/gqlpt.svg)](https://badge.fury.io/js/gqlpt) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

</div>

## Features

- 🚀 **TypeScript First** - Built from the ground up with full TypeScript support and type safety.

- 🧠 **AI-Powered Generation** - Convert natural language into precise GraphQL queries automatically.

- 🔄 **Multiple AI Adapters** - Choose between OpenAI and Anthropic, or make your own if needed.

- 🛡️ **Schema Validation** - All generated queries are validated against your schema before execution.

- 🔄 **Automatic Retries** - Built-in mechanism to retry and refine queries that fail validation.

- 📦 **NPM Published** - Install via npm with first-class package support.

- 🔍 **Query Introspection** - Automatically works with local or remote GraphQL schemas.

- 💾 **Query Caching** - Store and reuse previously generated queries for performance.

- 🔧 **CLI Tool** - Generate TypeScript types for your GQLPT queries from the command line.

- 🌐 **Subgraph Support** - Works with GraphQL Federation and Apollo Supergraph architecture.

- 🔢 **Variable Support** - Intelligent extraction and handling of variables for your queries.

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
