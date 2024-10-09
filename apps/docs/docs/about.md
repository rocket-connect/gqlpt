---
title: "About GQLPT: AI-Powered GraphQL Query Generation"
description: "GQLPT simplifies GraphQL development by converting natural language to GraphQL queries using AI. Learn how it works and get started quickly."
keywords:
  [
    GQLPT,
    GraphQL,
    AI,
    OpenAI,
    Anthropic,
    query generation,
    natural language processing,
  ]
sidebar_label: "About GQLPT"
sidebar_position: 2
---

# About GQLPT

Imagine you could swap out your GraphQL calls with plain text. That's exactly what GQLPT (GraphQL Plain Text) allows you to do. It's an innovative tool that bridges the gap between natural language and GraphQL queries, leveraging AI models from providers like OpenAI and Anthropic.

Let's look at a quick example of how GQLPT can transform your code:

Before GQLPT:

```javascript
import express from "express";
import { graphql } from "graphql";

const app = express();

app.get("/users", async (req, res) => {
  const query = `
    query {
      users {
        id
        name
        email
      }
    }
  `;
  const result = await graphql({ schema, source: query });
  res.json(result.data);
});
```

After GQLPT:

```javascript
import express from "express";
import { GQLPTClient } from "gqlpt";
import { AdapterOpenAI } from "@gqlpt/adapter-openai";

const app = express();

const client = new GQLPTClient({
  typeDefs: `...your GraphQL schema...`,
  adapter: new AdapterOpenAI({ apiKey: "your-api-key" }),
});

app.get("/users", async (req, res) => {
  const result = await client.generateAndSend(
    "Get all users with their id, name, and email"
  );
  res.json(result.data);
});
```

In this example, we've replaced a traditional GraphQL query with a simple plain text description. GQLPT takes care of generating the appropriate GraphQL query behind the scenes, making your code more readable and easier to maintain.

With GQLPT, you can:

- Quickly prototype GraphQL queries without extensive knowledge of the schema
- Explore and interact with GraphQL APIs using natural language
- Generate TypeScript types for improved type safety in your projects
- Work with both local and remote GraphQL schemas

Here's a quick example of how GQLPT works:

## Quick Example

```typescript
import { GQLPTClient } from "gqlpt";
import { AdapterOpenAI } from "@gqlpt/adapter-openai";

const client = new GQLPTClient({
  typeDefs: `
    type User {
      id: ID!
      name: String!
    }

    type Query {
      user(id: ID!): User
    }
  `,
  adapter: new AdapterOpenAI({ apiKey: "your-api-key" }),
});

await client.connect();

const { query, variables } = await client.generateQueryAndVariables(
  "Find user with id 1"
);

console.log(query);
// Output:
// query ($id: ID!) {
//   user(id: $id) {
//     id
//     name
//   }
// }

console.log(variables);
// Output: { id: "1" }
```

## Installation

```bash
npm install gqlpt @gqlpt/adapter-openai
# or
npm install gqlpt @gqlpt/adapter-anthropic
```

## How It Works

GQLPT processes a plain text query and generates a GraphQL query using the provided AI model:

1. **Schema Injection**: GQLPT injects the GraphQL schema and the query into a prompt for the AI model:

   ```typescript
   async generateQueryAndVariables(plainText: string) {
     const prompt = `
       Given the following GraphQL schema:

       ${this.compressTypeDefs(this.options.typeDefs)}

       And this plain text query:
       "${plainText}"

       Please perform the following tasks:

       1. Generate a GraphQL query that answers the plain text query.
       2. Provide any necessary variables for the query.

       [... query generation rules ...]

       [... response format instructions ...]
     `;

     const response = await this.options.adapter.sendText(prompt);
     // Process the response...
   }
   ```

2. **AI Model Processing**: The AI model receives this prompt and processes it. It understands the schema, interprets the plain text query, and generates a corresponding GraphQL query and variables.

3. **Response Parsing**: GQLPT then parses the AI model's response to extract the generated GraphQL query and variables:

   ```typescript
   const result = JSON.parse(response) as {
     query: string;
     variables?: Record<string, unknown>;
   };

   const queryAst = parse(result.query, { noLocation: true });
   const printedQuery = print(queryAst);

   return {
     query: printedQuery,
     variables: result.variables,
   };
   ```

## Features

- Converts plain text to GraphQL queries
- Uses OpenAI or Anthropic models
- Generates TypeScript types
- Supports remote schema introspection
- Executes queries locally or remotely

## Contributing

GQLPT is open-source. Contributions are welcome.

## License

MIT [rconnect.tech](https://rconnect.tech)
