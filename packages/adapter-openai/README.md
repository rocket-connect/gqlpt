# @gqlpt/adapter-openai

<div align="center" style="text-align: center;">

<img src="https://github.com/rocket-connect/gqlpt/raw/main/apps/playground/public/logo.svg" width="20%" alt="GQLPT">

</div>

## Installation

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
