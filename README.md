<div align="center" style="text-align: center;">

<img src="https://github.com/rocket-connect/gqlpt/raw/main/apps/docs/static/img/logo.svg" width="20%" alt="GQLPT">

<h1>GQLPT</h1>

<p>Leverage AI to generate GraphQL queries from plain text.</p>

Read more about GQLPT on our blog [rconnect.tech/blog/gqlpt](https://www.rconnect.tech/blog/gqlpt)

[![npm version](https://badge.fury.io/js/gqlpt.svg)](https://badge.fury.io/js/gqlpt) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

[![](https://github.com/rocket-connect/gqlpt/raw/main/docs/screenshot.png)](https://www.gqlpt.dev/)

Image showing the online playground for [gqlpt.dev](https://www.gqlpt.dev/). GQLPT is a npm package that allows you to generate GraphQL queries from plain text using AI.

</div>

## Quick View

- [EcoSystem](#ecosystem)
- [Installation](#installation)
- [Usage](#usage)
- [From Introspection](#from-introspection)
- [Generate and Send](#generate-and-send)
- [Type Generation](#type-generation)
- [FAQs](#faqs)
- [License](#license)

## EcoSystem

### gqlpt

[![npm version](https://badge.fury.io/js/gqlpt.svg)](https://www.npmjs.com/package/gqlpt)

- Core library for generating GraphQL queries from plain text. [GitHub](https://github.com/rocket-connect/gqlpt)

### @gqlpt/cli

[![npm version](https://badge.fury.io/js/%40gqlpt%2Fcli.svg)](https://www.npmjs.com/package/@gqlpt/cli)

- TypeScript type generation for GQLPT. [GitHub](https://github.com/rocket-connect/gqlpt/tree/main/packages/cli)

### @gqlpt/adapter-anthropic

[![npm version](https://badge.fury.io/js/%40gqlpt%2Fadapter-anthropic.svg)](https://www.npmjs.com/package/@gqlpt/adapter-anthropic)

- Adapter for Anthropic AI. [GitHub](https://github.com/rocket-connect/gqlpt/tree/main/packages/adapter-anthropic)

### @gqlpt/adapter-openai

[![npm version](https://badge.fury.io/js/%40gqlpt%2Fadapter-openai.svg)](https://www.npmjs.com/package/@gqlpt/adapter-openai)

- Adapter for OpenAI GPT-3. [GitHub](https://github.com/rocket-connect/gqlpt/tree/main/packages/adapter-openai)

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

## From Introspection

You can specify a URL and headers in the options to perform introspection on the `.connect` command. This allows you to fetch the GraphQL schema directly from your endpoint.

> **Note:** When specifying a URL for initial introspection, you **must** call the `connect` method.

```ts
const client = new GQLPTClient({
  url: "http://localhost:4000/graphql", // Your GraphQL endpoint
  headers: {
    Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
  },
  adapter: new AdapterOpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  }),
});

await client.connect(); // Performs introspection using the URL
```

## Generate and Send

The `GQLPTClient` class includes a `generateAndSend` method that simplifies generating a GraphQL query from plain text and sending it directly to a specified endpoint. This method leverages the `generateQueryAndVariables` function and then posts the generated query to the endpoint.

### Example

```ts
import { AdapterOpenAI } from "@gqlpt/adapter-openai";

import { GQLPTClient } from "gqlpt";

const client = new GQLPTClient({
  url: "http://localhost:4000/graphql",
  adapter: new AdapterOpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  }),
});

async function main() {
  await client.connect();

  const response = await client.generateAndSend("Find users by id 1");

  console.log(response); // Logs the server's response to the query

  /*
    Example response structure:
    {
      "data": {
        "user": {
          "id": "1",
          "name": "John Doe"
        }
      },
      "errors": []
    }
  */
}

main();
```

### Advanced Usage

You can override the URL or headers when calling `generateAndSend`:

```ts
const response = await client.generateAndSend("Find users by id 1", {
  urlOverride: "http://another-server.com/graphql",
  headersOverride: {
    Authorization: "Bearer custom-token",
  },
});
```

## Type Generation

GQLPT offers seamless type generation without requiring changes to your existing code. The CLI tool automatically analyzes your codebase, generates appropriate types based on your usage patterns, and updates the type definitions in your `node_modules`.

### Installation

```bash
npm install -g @gqlpt/cli
```

### Usage

Run the following command in your project root:

```bash
npx @gqlpt/cli generate ./src
```

This command will:

1. Scan your `./src` directory for GQLPT usage
2. Generate TypeScript types based on your plain text queries
3. Update the types in `node_modules/gqlpt/build/types.d.ts`

You don't need to manually import or reference these types in your code. GQLPT will automatically use them to provide type safety.

### Example: Querying GitHub API with Automatic Type Safety

Here's an example of how to use GQLPT with the GitHub GraphQL API, leveraging automatically generated types:

```typescript
import { AdapterOpenAI } from "@gqlpt/adapter-openai";

import { GQLPTClient } from "gqlpt";

const client = new GQLPTClient({
  url: "https://api.github.com/graphql",
  headers: {
    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
  },
  adapter: new AdapterOpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  }),
});

async function searchGitHubRepos() {
  await client.connect();

  const query = "Find repositories with the name gqlpt";

  const response = await client.generateAndSend(query);
  // response will be typed based on the generated types
}
```

In this example:

1. We create a `GQLPTClient` instance, specifying the GitHub GraphQL API endpoint and including an authorization header with a GitHub token.

2. We don't need to explicitly import or specify any type information. The types are automatically applied based on the generated definitions.

3. After connecting to the client (which performs introspection on the GitHub API), we use a natural language query to search for repositories with "gqlpt" in the name.

4. The `generateAndSend` method generates the appropriate GraphQL query, sends it to the GitHub API, and returns the result with full type information.

5. TypeScript provides full type safety and autocompletion when working with the response, based on the automatically generated types.

This seamless integration of type generation allows you to leverage the power of TypeScript's type system without any additional overhead in your development process. Just run the CLI tool whenever you update your GraphQL schema or change your GQLPT usage patterns, and enjoy automatic type safety in your code.

## FAQs

1. I'm seeing the error "429 - Rate limit reached for requests" on making requests.

This error is related to sending too many requests to OpenAI, and them trying to rate-limit you. Try limiting the requests to gqlpt, or upgrading to a [paid OpenAI API plan](https://help.openai.com/en/articles/6891829-error-code-429-rate-limit-reached-for-requests). In case of persistent errors, create an issue with us, or reach out to [OpenAI support](https://help.openai.com/en/) for OpenAI related errors.

## License

MIT - Rocket Connect - https://github.com/rocket-connect
