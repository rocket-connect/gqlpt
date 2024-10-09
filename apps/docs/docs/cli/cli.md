---
title: "GQLPT CLI: TypeScript Type Generation for GraphQL Queries"
description: "Explore the GQLPT Command Line Interface (CLI) tool for generating TypeScript type definitions from GQLPT queries. Learn about its key features, installation process, and how it works to enhance your GraphQL development workflow."
keywords:
  [
    GQLPT,
    CLI,
    Command Line Interface,
    GraphQL,
    TypeScript,
    type generation,
    project scanning,
    schema acquisition,
    query extraction,
    AI-powered type generation,
  ]
sidebar_label: "CLI"
sidebar_position: 5
---

# CLI

The GQLPT Command Line Interface's primary function is to generate TypeScript type definitions for GQLPT queries used in your project.

## Key Features

- Scan your project for GQLPT usage
- Generate TypeScript type definitions for GQLPT queries
- Flexible output options for generated types

## Installation

To install the GQLPT CLI globally, run the following command:

```bash
npm install -g @gqlpt/cli
```

## Quick Start

Here's a basic example of how to use the GQLPT CLI to generate type definitions:

```bash
npx @gqlpt/cli generate ./src -u https://api.github.com/graphql -h '{"Authorization": "Bearer YOUR_GITHUB_TOKEN"}'
```

This command scans the `./src` directory for GQLPT usage, introspects the GitHub GraphQL API schema, and generates corresponding TypeScript type definitions.

## How It Works

1. **Project Scanning**: The CLI scans the specified source directory (e.g., `./src`) for TypeScript files containing GQLPT query usage.

2. **Schema Acquisition**: It either uses a provided GraphQL schema file or introspects a remote GraphQL server to obtain the schema.

3. **Query Extraction**: The tool identifies and extracts GQLPT queries from your code.

4. **Type Generation**: Using the specified AI adapter (OpenAI or Anthropic), it generates TypeScript type definitions for each extracted query based on the GraphQL schema.

5. **Output**: The generated types are either written to a specified output file or printed to stdout, depending on the options used.

This process ensures that your GQLPT queries have corresponding TypeScript types, enhancing type safety and developer experience in your project.

For more detailed information on how to use the CLI and its available options, check out the [CLI Usage](/docs/cli/usage) page. For a comprehensive list of all CLI options and their descriptions, refer to the [CLI API](/docs/cli/api) page.
