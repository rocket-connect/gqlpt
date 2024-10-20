# @gqlpt/adapter-ollama

<div align="center" style="text-align: center;">
<img src="https://github.com/rocket-connect/gqlpt/raw/main/apps/docs/static/img/logo.svg" width="20%" alt="GQLPT">
</div>

## Installation

```bash
npm install gqlpt @gqlpt/adapter-anthropic
```

## Usage

```ts
import { AdapterOllama } from "@gqlpt/adapter-ollama";

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
  adapter: new AdapterOllama({
    url: "https://ollama.com/graphql",
    model: "llama3.2",
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

## Docs

[gqlpt.dev/docs/adapters/ollama](https://www.gqlpt.dev/docs/adapters/ollama)

## License

MIT - Rocket Connect - https://github.com/rocket-connect
