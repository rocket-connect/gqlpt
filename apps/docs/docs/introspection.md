---
title: "GraphQL Introspection with GQLPT: Creating Type-Safe Clients"
description: "Learn how to use GraphQL introspection with GQLPT to create fully type-safe clients. This guide covers both client SDK and CLI approaches for seamless integration with your GraphQL API."
keywords:
  [GQLPT, GraphQL, introspection, type-safe, TypeScript, client SDK, CLI]
sidebar_label: "GraphQL Introspection"
sidebar_position: 9
---

# GraphQL Introspection

This guide demonstrates how to use GraphQL introspection with GQLPT to create a fully type-safe client. We'll cover both the client SDK and CLI approaches.

## What is GraphQL Introspection?

GraphQL introspection allows you to query a GraphQL schema for information about what queries it supports. GQLPT uses this feature to automatically generate accurate TypeScript types based on the actual schema of your GraphQL API.

## Using Introspection with GQLPT Client SDK

### Step 1: Install Dependencies

First, install the necessary packages:

```bash
npm install gqlpt @gqlpt/adapter-openai
```

### Step 2: Set Up the GQLPT Client

Create a new file, e.g., `gqlptClient.ts`, and add the following code:

```typescript
import { GQLPTClient } from "gqlpt";
import { AdapterOpenAI } from "@gqlpt/adapter-openai";

const client = new GQLPTClient({
  url: "https://api.example.com/graphql", // Replace with your GraphQL API URL
  adapter: new AdapterOpenAI({
    apiKey: process.env.OPENAI_API_KEY as string,
  }),
});

export async function initializeClient() {
  await client.connect(); // This will perform the introspection
  return client;
}
```

### Step 3: Use the Client

Now you can use the client in your application:

```typescript
import { initializeClient } from "./gqlptClient";

async function main() {
  const client = await initializeClient();

  const { query, variables } = await client.generateQueryAndVariables(
    "Get user with id 1 and their recent posts"
  );

  console.log(query);
  console.log(variables);
}

main().catch(console.error);
```

## Using Introspection with GQLPT CLI

The GQLPT CLI can generate TypeScript types based on the introspected schema, which are then automatically used by the GQLPT client for full type safety.

### Step 1: Install the CLI

Install the GQLPT CLI globally:

```bash
npm install -g @gqlpt/cli
```

### Step 2: Generate Types

Run the following command to generate types based on your GraphQL API:

```bash
npx @gqlpt/cli generate ./src -u https://api.example.com/graphql -h '{"Authorization": "Bearer YOUR_API_TOKEN"}'
```

Replace `https://api.example.com/graphql` with your actual GraphQL API URL, and add any necessary headers.

This command will generate the types and automatically place them in the correct location for GQLPT to use.

### Step 3: Use the Client with Auto-generated Types

After running the CLI command, you can use the GQLPT client as usual. The types will be automatically applied:

```typescript
import { GQLPTClient } from "gqlpt";
import { AdapterOpenAI } from "@gqlpt/adapter-openai";

const client = new GQLPTClient({
  url: "https://api.example.com/graphql",
  adapter: new AdapterOpenAI({
    apiKey: process.env.OPENAI_API_KEY as string,
  }),
});

async function main() {
  await client.connect();

  const result = await client.generateAndSend(
    "Get user with id 1 and their recent posts"
  );

  // result is now fully typed based on your GraphQL schema
  console.log(result.data.user.name);
  console.log(result.data.user.posts);
}

main().catch(console.error);
```

## Best Practices

1. **Regular Updates**: Re-run the CLI type generation command periodically or after schema changes to keep your types up-to-date.

2. **Error Handling**: Implement proper error handling for both the introspection process and query execution.

3. **Security**: Be cautious about exposing your full schema in production environments. Consider using a schema filtering tool if needed.

## Troubleshooting

- If introspection fails, ensure you have the correct permissions and that introspection is enabled on your GraphQL server.
- Check your network connection and firewall settings if you're having trouble connecting to the GraphQL server.
- Verify that the generated queries and results match your expectations. If not, there might be an issue with the introspection query or schema.
- If type information seems incorrect, try running the CLI command again to regenerate the types.

By following this guide, you'll have a fully type-safe GQLPT client that leverages your GraphQL API's schema through introspection. This approach ensures that your GQLPT queries align perfectly with your actual GraphQL schema, providing excellent developer experience and reducing runtime errors.
