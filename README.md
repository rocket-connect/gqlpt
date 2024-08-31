<div align="center" style="text-align: center;">

<img src="https://github.com/rocket-connect/gqlpt/raw/main/apps/playground/public/logo.svg" width="20%" alt="GQLPT">

<h1>GQLPT</h1>

<p>Leverage AI to generate GraphQL queries from plain text.</p>

[![npm version](https://badge.fury.io/js/gqlpt.svg)](https://badge.fury.io/js/gqlpt) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

[![](https://github.com/rocket-connect/gqlpt/raw/main/docs/screenshot.png)](https://www.gqlpt.dev/)

Image showing the online playground for [gqlpt.dev](https://www.gqlpt.dev/). GQLPT is a npm package that allows you to generate GraphQL queries from plain text using AI.

</div>

## Quick View

- [Installation](#installation)
- [Adapters](#adapters)
- [Usage](#usage)
- [From Introspection](#from-introspection)
- [Generate and Send](#generate-and-send)
- [FAQs](#faqs)
- [License](#license)

## Adapters

Adapters are used to swap out the underlying AI service used to generate GraphQL queries. The following adapters are available:

- [Anthropic](https://www.npmjs.com/package/@gqlpt/adapter-anthropic)
  - `@gqlpt/adapter-anthropic`
- [OpenAI](https://www.npmjs.com/package/@gqlpt/adapter-openai)
  - `@gqlpt/adapter-openai`

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

## FAQs

1. I'm seeing the error "429 - Rate limit reached for requests" on making requests.

This error is related to sending too many requests to OpenAI, and them trying to rate-limit you. Try limiting the requests to gqlpt, or upgrading to a [paid OpenAI API plan](https://help.openai.com/en/articles/6891829-error-code-429-rate-limit-reached-for-requests). In case of persistent errors, create an issue with us, or reach out to [OpenAI support](https://help.openai.com/en/) for OpenAI related errors.

## License

MIT - Rocket Connect - https://github.com/rocket-connect
