---
title: "Getting Started with GQLPT: Generate GraphQL Queries from Natural Language"
description: "Learn how to set up and use GQLPT to generate GraphQL queries from natural language. This guide covers installation, API key setup, and basic usage with OpenAI and Anthropic adapters."
keywords:
  [
    GQLPT,
    GraphQL,
    natural language,
    AI,
    OpenAI,
    Anthropic,
    query generation,
    setup guide,
  ]
sidebar_label: "Getting Started"
sidebar_position: 1
---

# Getting Started

GQLPT is a tool that helps you generate GraphQL queries and variables from natural language queries. It is designed to help developers quickly build GraphQL queries without having to write them manually. You can connect your GQLPT(GraphQL Plain Text) client SDK to your GraphQL server and start generating queries and variables from natural language queries. To use GQLPT, you need to bring your own AI model or use one of the pre-built [adapters](/docs/adapters).

## What you'll need

- Node.js version 18.0 or above:
  - When installing Node.js, you are recommended to check all checkboxes related to dependencies.
- An API key from OpenAI or Anthropic (see below)

## Obtaining an API Key

GQLPT is an open-source project that does not provide its own AI model. Instead, it relies on external AI providers like OpenAI or Anthropic. To use GQLPT, you'll need to obtain an API key from one of these providers:

<Tabs>
  <TabItem value="openai" label="OpenAI" default>

1. Go to [OpenAI's website](https://openai.com/) and sign up for an account if you haven't already.
2. Navigate to the API section and create a new API key.
3. Copy your API key and keep it secure. You'll need to set this as an environment variable `OPENAI_API_KEY` when running your GQLPT project.

  </TabItem>
  <TabItem value="anthropic" label="Anthropic">

1. Go to [Anthropic's website](https://www.anthropic.com/) and sign up for an account if you haven't already.
2. Navigate to the API section and request access to the Claude API if you haven't done so.
3. Once approved, create a new API key.
4. Copy your API key and keep it secure. You'll need to set this as an environment variable `ANTHROPIC_API_KEY` when running your GQLPT project.

  </TabItem>
</Tabs>

Remember to keep your API key confidential and never share it publicly or commit it to version control systems.

## Install GQLPT

Generate a new GQLPT project using npm:

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="openai" label="OpenAI" default>

```bash
npm install gqlpt @gqlpt/adapter-openai
```

  </TabItem>
  <TabItem value="anthropic" label="Anthropic">

```bash
npm install gqlpt @gqlpt/adapter-anthropic
```

  </TabItem>
</Tabs>

You can type this command into Command Prompt, Powershell, Terminal, or any other integrated terminal of your code editor.

The command also installs all necessary dependencies you need to run GQLPT.

## Set up your project

Create a new file (e.g., `index.js`) and add the following code:

<Tabs>
  <TabItem value="openai" label="OpenAI" default>

```javascript
import { AdapterOpenAI } from "@gqlpt/adapter-openai";
import { GQLPTClient } from "gqlpt";

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
  adapter: new AdapterOpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  }),
});

async function main() {
  await client.connect();
  const query = "Find users by id 1";
  const response = await client.generateQueryAndVariables(query);
  console.log(response);
}

main();
```

  </TabItem>
  <TabItem value="anthropic" label="Anthropic">

```javascript
import { AdapterAnthropic } from "@gqlpt/adapter-anthropic";
import { GQLPTClient } from "gqlpt";

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
  adapter: new AdapterAnthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  }),
});

async function main() {
  await client.connect();
  const query = "Find users by id 1";
  const response = await client.generateQueryAndVariables(query);
  console.log(response);
}

main();
```

  </TabItem>
</Tabs>

## Running the project

Before running your project, make sure to set the appropriate environment variable for your chosen AI provider:

<Tabs>
  <TabItem value="openai" label="OpenAI" default>

```bash
export OPENAI_API_KEY=your_openai_api_key_here
```

  </TabItem>
  <TabItem value="anthropic" label="Anthropic">

```bash
export ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

  </TabItem>
</Tabs>

Then, run the development server:

```bash
node index.js
```

The command runs your GQLPT project and outputs the generated GraphQL query and variables.

Congratulations! You have just set up your first GQLPT project.
