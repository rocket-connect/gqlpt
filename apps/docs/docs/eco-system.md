---
title: "GQLPT Ecosystem: Core Library, CLI, and AI Adapters"
description: "Explore the GQLPT ecosystem, including the core library, CLI tool, and AI adapters for OpenAI and Anthropic. Learn about each component's purpose, use cases, and how to get started."
keywords:
  [
    GQLPT,
    ecosystem,
    GraphQL,
    CLI,
    OpenAI adapter,
    Anthropic adapter,
    TypeScript,
    type generation,
    AI integration,
  ]
sidebar_label: "Ecosystem"
sidebar_position: 7
---

# Ecosystem

GQLPT has a growing ecosystem of tools and adapters to enhance your GraphQL development experience. Here's an overview of the core library and its associated packages:

## Core Library

### gqlpt

[![npm version](https://badge.fury.io/js/gqlpt.svg)](https://www.npmjs.com/package/gqlpt)

The core library for generating GraphQL queries from plain text.

- **Description**: This is the main GQLPT library that provides the core functionality for converting natural language queries into GraphQL queries.
- **Use Case**: Use this as the foundation for integrating GQLPT into your projects.
- **GitHub**: [https://github.com/rocket-connect/gqlpt/tree/main/packages/gqlpt](https://github.com/rocket-connect/gqlpt/tree/main/packages/gqlpt)

## Command Line Interface

### @gqlpt/cli

[![npm version](https://badge.fury.io/js/%40gqlpt%2Fcli.svg)](https://www.npmjs.com/package/@gqlpt/cli)

TypeScript type generation for GQLPT.

- **Description**: A command-line tool that generates TypeScript type definitions for your GQLPT queries.
- **Use Case**: Ideal for enhancing type safety in your TypeScript projects that use GQLPT.
- **GitHub**: [https://github.com/rocket-connect/gqlpt/tree/main/packages/cli](https://github.com/rocket-connect/gqlpt/tree/main/packages/cli)

## AI Adapters

### @gqlpt/adapter-anthropic

[![npm version](https://badge.fury.io/js/%40gqlpt%2Fadapter-anthropic.svg)](https://www.npmjs.com/package/@gqlpt/adapter-anthropic)

Adapter for Anthropic AI.

- **Description**: This adapter allows GQLPT to use Anthropic's AI models for query generation.
- **Use Case**: Choose this adapter if you prefer or have access to Anthropic's AI technology.
- **GitHub**: [https://github.com/rocket-connect/gqlpt/tree/main/packages/adapter-anthropic](https://github.com/rocket-connect/gqlpt/tree/main/packages/adapter-anthropic)

### @gqlpt/adapter-openai

[![npm version](https://badge.fury.io/js/%40gqlpt%2Fadapter-openai.svg)](https://www.npmjs.com/package/@gqlpt/adapter-openai)

Adapter for OpenAI GPT-3.

- **Description**: This adapter integrates OpenAI's GPT-3 model with GQLPT for query generation.
- **Use Case**: Ideal if you want to leverage OpenAI's powerful language models in your GQLPT setup.
- **GitHub**: [https://github.com/rocket-connect/gqlpt/tree/main/packages/adapter-openai](https://github.com/rocket-connect/gqlpt/tree/main/packages/adapter-openai)

## Getting Started

To get started with GQLPT and its ecosystem:

1. Install the core library: `npm install gqlpt`
2. Choose and install an adapter: `npm install @gqlpt/adapter-openai` or `npm install @gqlpt/adapter-anthropic`
3. For CLI tools, install: `npm install -g @gqlpt/cli`

Refer to the individual package documentation for detailed usage instructions and configuration options.
