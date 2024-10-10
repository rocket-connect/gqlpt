---
title: "GQLPT CLI API Reference: Commands, Options, and Environment Variables"
description: "Comprehensive API reference for the GQLPT Command Line Interface (CLI). Learn about available commands, options, arguments, and environment variables for efficient type generation in your GraphQL projects."
keywords:
  [
    GQLPT,
    CLI,
    API Reference,
    Command Line Interface,
    GraphQL,
    TypeScript,
    type generation,
    options,
    arguments,
    environment variables,
    OpenAI,
    Anthropic,
  ]
sidebar_label: "API Reference"
sidebar_position: 3
---

# API Reference

This page provides a detailed reference for all available options and commands in the GQLPT CLI.

## Command Structure

The basic structure of a GQLPT CLI command is:

```bash
npx @gqlpt/cli generate <source> [options]
```

## Arguments

| Argument   | Description                              |
| ---------- | ---------------------------------------- |
| `<source>` | Source directory to scan for GQLPT usage |

## Options

| Option        | Alias | Description                                                        | Default                                   |
| ------------- | ----- | ------------------------------------------------------------------ | ----------------------------------------- |
| `--adapter`   | `-a`  | The type of adapter to use ('openai' or 'anthropic')               | 'openai'                                  |
| `--key`       | `-k`  | API key for the chosen adapter                                     | -                                         |
| `--output`    | `-o`  | Custom output path for generated types                             | `node_modules/gqlpt/build/types.d.ts`     |
| `--typeDefs`  | `-t`  | Path to GraphQL schema definition file                             | -                                         |
| `--url`       | `-u`  | GraphQL server URL for schema introspection                        | -                                         |
| `--headers`   | `-h`  | Headers to send to the GraphQL server (as JSON string)             | -                                         |
| `--raw`       | `-r`  | Output raw type definitions to stdout instead of writing to a file | false                                     |
| `--help`      | -     | Display help for command                                           | -                                         |
| `--generated` | `-g`  | Output path for generated queries                                  | `node_modules/gqlpt/build/generated.json` |
| `--rawgen`    | `-rg` | Output raw generated queries to stdout                             | false                                     |

## Environment Variables

The following environment variables can be used to set default values for the CLI options:

| Environment Variable   | Corresponding Option | Description                                 |
| ---------------------- | -------------------- | ------------------------------------------- |
| `GQLPT_ADAPTER`        | `--adapter`          | The type of adapter to use                  |
| `OPENAI_API_KEY`       | `--key`              | API key for OpenAI adapter                  |
| `ANTHROPIC_API_KEY`    | `--key`              | API key for Anthropic adapter               |
| `GQLPT_OUTPUT_PATH`    | `--output`           | Custom output path for generated types      |
| `GQLPT_TYPE_DEFS`      | `--typeDefs`         | Path to GraphQL schema definition file      |
| `GQLPT_URL`            | `--url`              | GraphQL server URL for schema introspection |
| `GQLPT_HEADERS`        | `--headers`          | Headers to send to the GraphQL server       |
| `GQLPT_RAW`            | `--raw`              | Enable raw output mode                      |
| `GQLPT_GENERATED_PATH` | `--generated`        | Output path for generated queries           |
| `GQLPT_RAW_GENERATED`  | `--rawgen`           | Enable raw generated queries output mode    |

## Option Details

### `--adapter <adapter>`

Specifies the AI adapter to use for generating type definitions. Available options are 'openai' and 'anthropic'.

### `--key <key>`

The API key for the chosen adapter. This should be your OpenAI API key or Anthropic API key, depending on the selected adapter.

### `--output <path>`

Specifies a custom output path for the generated TypeScript type definitions. If not provided, the default is `no

### `--generated <path>`

Specifies a custom output path for the generated GraphQL queries. If not provided, the default is `node_modules/gqlpt/build/generated.json`.

### `--rawgen`

When set, outputs the raw generated GraphQL queries to stdout instead of writing to a file. This is useful for debugging or integrating with other tools.
