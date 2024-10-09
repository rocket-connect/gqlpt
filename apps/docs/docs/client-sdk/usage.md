---
title: "GQLPT Client SDK Usage Guide"
description: "Learn how to use the GQLPT Client SDK effectively. This guide covers client initialization, query generation, execution, working with remote schemas, and error handling."
keywords:
  [
    GQLPT,
    Client SDK,
    usage guide,
    GraphQL,
    query generation,
    remote schemas,
    error handling,
    AI-powered queries,
  ]
sidebar_label: "Usage"
sidebar_position: 1
---

# Usage

The GQLPT Client SDK is designed to be easy to use while providing powerful functionality. Here's a guide on how to use the main features of the SDK.

## Initializing the Client

First, import the necessary modules and create a new `GQLPTClient` instance:

```typescript
import { AdapterOpenAI } from "@gqlpt/adapter-openai";

import { GQLPTClient } from "gqlpt";

const client = new GQLPTClient({
  typeDefs: `your GraphQL schema here`,
  adapter: new AdapterOpenAI({ apiKey: "your-api-key" }),
});

await client.connect();
```

## Generating Queries and Variables

To generate a GraphQL query and variables from a plain text description:

```typescript
const { query, variables } = await client.generateQueryAndVariables(
  "Find users named John and their posts",
);

console.log(query);
console.log(variables);
```

## Executing Queries

To generate and execute a query in one step:

```typescript
const result = await client.generateAndSend("Find users named John");
console.log(result);
```

## Working with Remote Schemas

You can initialize the client with a remote GraphQL endpoint:

```typescript
const client = new GQLPTClient({
  adapter: new AdapterOpenAI({ apiKey: "your-api-key" }),
  url: "http://your-graphql-endpoint.com/graphql",
});

await client.connect(); // This will fetch and parse the remote schema
```

## Error Handling

Always wrap your GQLPT operations in try-catch blocks to handle potential errors:

```typescript
try {
  const result = await client.generateAndSend("Find users named John");
  console.log(result);
} catch (error) {
  console.error("An error occurred:", error);
}
```

For more detailed information on the available methods and options, refer to the [API documentation](./api.md).
