---
title: "GQLPT Client SDK API Reference"
description: "Comprehensive API reference for the GQLPT Client SDK. Learn about the GQLPTClient class, its constructor options, and available methods for generating and executing GraphQL queries."
keywords:
  [
    GQLPT,
    API Reference,
    Client SDK,
    GraphQL,
    query generation,
    TypeScript,
    GQLPTClient,
    connect,
    generateQueryAndVariables,
    generateAndSend,
  ]
sidebar_label: "API Reference"
sidebar_position: 2
---

# API Reference

This page provides detailed information about the GQLPT Client SDK API.

## GQLPTClient

The main class for interacting with GQLPT.

### Constructor

```typescript
constructor(options: GQLPTClientOptions)
```

#### Options

- `typeDefs`: string (optional) - GraphQL schema as a string
- `url`: string (optional) - URL of a GraphQL endpoint
- `headers`: Record string (optional) - Headers to send with GraphQL requests
- `adapter`: Adapter - An instance of an AI adapter (e.g., AdapterOpenAI, AdapterAnthropic)

### Methods

#### connect()

```typescript
async connect(): Promise<void>
```

Connects to the GraphQL server and introspects the schema if a URL is provided.

#### generateQueryAndVariables(plainText: string)

```typescript
async generateQueryAndVariables(plainText: string): Promise<{
  query: string;
  variables?: Record<string, unknown>;
}>
```

Generates a GraphQL query and variables from a plain text description.

#### generateAndSend(plainText: string, options?)

```typescript
async generateAndSend<Q extends string>(
  plainText: Q,
  options?: {
    urlOverride?: string;
    headersOverride?: Record<string, string>;
  }
): Promise<Q extends keyof T ? T[Q] : any>
```

Generates a GraphQL query from plain text and sends it to the GraphQL server.
