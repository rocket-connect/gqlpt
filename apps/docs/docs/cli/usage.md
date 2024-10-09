---
title: "GQLPT CLI Usage Guide: Generating Types for GraphQL Queries"
description: "Learn how to effectively use the GQLPT CLI to generate TypeScript types for your GraphQL queries. This guide covers common use cases, environment variables, best practices, and troubleshooting tips."
keywords:
  [
    GQLPT,
    CLI,
    Command Line Interface,
    GraphQL,
    TypeScript,
    type generation,
    OpenAI,
    Anthropic,
    schema introspection,
    CI/CD integration,
  ]
sidebar_label: "CLI Usage"
sidebar_position: 1
---

# CLI Usage

This guide provides detailed information on how to use the GQLPT CLI effectively.

## Basic Command Structure

The basic structure of a GQLPT CLI command is:

```bash
npx @gqlpt/cli generate <source> [options]
```

Where `<source>` is the directory to scan for GQLPT usage.

## Common Use Cases

### 1. Generate Types Using Default Settings

To generate types for a project using the default OpenAI adapter:

```bash
npx @gqlpt/cli generate ./src -k YOUR_OPENAI_API_KEY
```

### 2. Use a Remote GraphQL Schema

To generate types using a remote GraphQL schema:

```bash
npx @gqlpt/cli generate ./src -u https://api.example.com/graphql -h '{"Authorization": "Bearer YOUR_API_TOKEN"}'
```

### 3. Use a Local GraphQL Schema File

If you have a local GraphQL schema file:

```bash
npx @gqlpt/cli generate ./src -t ./path/to/schema.graphql
```

### 4. Specify a Custom Output File

To output the generated types to a specific file:

```bash
npx @gqlpt/cli generate ./src -o ./types/gqlpt-types.d.ts
```

### 5. Use the Anthropic Adapter

To use the Anthropic adapter instead of OpenAI:

```bash
npx @gqlpt/cli generate ./src -a anthropic -k YOUR_ANTHROPIC_API_KEY
```

### 6. Output Raw Type Definitions

To output the raw type definitions to stdout:

```bash
npx @gqlpt/cli generate ./src -r > types.ts
```

## Using Environment Variables

You can use environment variables to set commonly used options:

```bash
export GQLPT_ADAPTER=openai
export OPENAI_API_KEY=your_openai_api_key
export GQLPT_OUTPUT_PATH=./types/gqlpt-types.d.ts

npx @gqlpt/cli generate ./src
```

## Tips for Effective Usage

1. **Project Structure**: Organize your GQLPT queries in a consistent manner within your project for easier scanning.

2. **Schema Management**: Keep your GraphQL schema up-to-date, whether you're using a local file or a remote endpoint.

3. **Version Control**: Consider adding the generated type definitions file to your version control system.

4. **CI/CD Integration**: Incorporate the CLI into your CI/CD pipeline to automatically generate types on each build or deployment.

5. **Error Handling**: Always check the CLI output for any warnings or errors, especially when working with remote schemas.

## Troubleshooting

If you encounter issues:

1. Ensure you have the correct API key set.
2. Check that your source directory contains GQLPT queries.
3. Verify that your GraphQL schema (local or remote) is accessible and valid.
4. Check write permissions if you're outputting to a file.

For more detailed information on available options and their usage, refer to the [CLI API](/docs/cli/api) documentation.
