---
title: "GQLPT Client SDK: AI-Powered GraphQL Query Generation"
description: "Explore the GQLPT Client SDK, a powerful tool for generating GraphQL queries from natural language using AI. Learn about its key features, installation process, and get started with a quick example."
keywords:
  [
    GQLPT,
    Client SDK,
    GraphQL,
    AI,
    natural language,
    query generation,
    OpenAI,
    Anthropic,
    TypeScript,
    remote schema introspection,
  ]
sidebar_label: "Client SDK"
sidebar_position: 4
---

# Client SDK

The GQLPT Client SDK provides a powerful interface to generate GraphQL queries from natural language using AI. It supports multiple AI adapters and offers flexible configuration options.

## Key Features

- Generate GraphQL queries and variables from plain text
- Support for multiple AI adapters (OpenAI, Anthropic)
- Remote schema introspection
- TypeScript support
- Flexible query execution options

## Installation

To install the GQLPT Client SDK and an adapter, run one of the following commands:

```bash
npm install gqlpt @gqlpt/adapter-openai

# or

npm install gqlpt @gqlpt/adapter-anthropic
```

## Quick Start

Here's a basic example of how to use the GQLPT Client SDK:

```typescript
import { AdapterOpenAI } from "@gqlpt/adapter-openai";

import { GQLPTClient } from "gqlpt";

const client = new GQLPTClient({
  typeDefs: `     
    type User {
      id: ID!
      name: String!
      email: String!
    }

    type Query {
      users(name: String): [User!]!
    }
  `,
  adapter: new AdapterOpenAI({ apiKey: "your-api-key" }),
});

await client.connect();

const { query, variables } = await client.generateQueryAndVariables(
  "Find users named John",
);

console.log(query, variables);
```

For more detailed information on usage and API, check out the [Usage](./usage.md) and [API](./api.md) documentation.
