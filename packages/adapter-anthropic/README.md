# @gqlpt/adapter-anthropic

<div align="center" style="text-align: center;">
<img src="https://github.com/rocket-connect/gqlpt/raw/main/docs/gqlpt.svg" width="20%" alt="GQLPT">
</div>

## Installation

```bash
npm install gqlpt @gqlpt/adapter-anthropic
```

## Usage

```ts
import { AdapterAnthropic } from "@gqlpt/adapter-anthropic";

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
  adapter: new AdapterAnthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
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

[gqlpt.dev/docs/adapters/anthropic](https://www.gqlpt.dev/docs/adapters/anthropic)

## License

MIT - Rocket Connect - https://github.com/rocket-connect
