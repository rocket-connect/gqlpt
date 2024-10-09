---
title: "Type Generation for GQLPT: Enhancing TypeScript Integration"
description: "Learn how to generate and use TypeScript types for your GQLPT projects. This guide covers the benefits of type generation, step-by-step instructions, best practices, and troubleshooting tips."
keywords:
  [
    GQLPT,
    TypeScript,
    type generation,
    GraphQL,
    type safety,
    CLI,
    developer experience,
  ]
sidebar_label: "Type Generation"
sidebar_position: 8
---

# Type Generation

This guide explains how to generate TypeScript types for your GQLPT projects, ensuring type safety and improving developer experience.

## Why Generate Types?

Generating TypeScript types for your GQLPT queries offers several benefits:

1. **Type Safety**: Catch errors at compile-time rather than runtime.
2. **Autocomplete**: Enjoy IDE suggestions based on your GraphQL schema.
3. **Refactoring**: Easily refactor your code with confidence.
4. **Documentation**: Use types as a form of self-documenting code.

## Prerequisites

Before generating types, ensure you have:

1. GQLPT CLI installed globally:
   ```bash
   npm install -g @gqlpt/cli
   ```
2. Access to your GraphQL API (either a URL or a local schema file)

## Generating Types

### Step 1: Prepare Your Project

Ensure your project is set up with GQLPT and that you're using GQLPT queries in your TypeScript files.

### Step 2: Run the GQLPT CLI

Use one of the following commands, depending on your GraphQL schema source:

#### For a Remote GraphQL API:

```bash
npx @gqlpt/cli generate ./src -u https://api.example.com/graphql -h '{"Authorization": "Bearer YOUR_API_TOKEN"}'
```

Replace `https://api.example.com/graphql` with your actual GraphQL API URL, and add any necessary headers.

#### For a Local Schema File:

```bash
npx @gqlpt/cli generate ./src -t ./path/to/schema.graphql
```

Replace `./path/to/schema.graphql` with the path to your local schema file.

### Step 3: Verify Type Generation

After running the command, GQLPT will automatically generate and place the type definitions in the correct location. You don't need to manually import or specify these types in your code.

## Using Generated Types

Once you've generated the types, GQLPT will automatically use them to provide type safety in your queries. Here's an example:

```typescript
import { GQLPTClient } from "gqlpt";
import { AdapterOpenAI } from "@gqlpt/adapter-openai";

const client = new GQLPTClient({
  url: "https://api.example.com/graphql",
  adapter: new AdapterOpenAI({
    apiKey: process.env.OPENAI_API_KEY as string,
  }),
});

async function main() {
  await client.connect();

  const result = await client.generateAndSend(
    "Get user with id 1 and their recent posts"
  );

  // 'result' is now fully typed based on your GraphQL schema
  console.log(result.data.user.name);
  console.log(result.data.user.posts);
}

main().catch(console.error);
```

## Best Practices

1. **Version Control**: Consider adding the generated types to your version control system to ensure consistency across your development team.

2. **Regular Updates**: Re-run the type generation command periodically, especially after schema changes, to keep your types up-to-date.

3. **CI/CD Integration**: Incorporate type generation into your CI/CD pipeline to ensure types are always current.

4. **Schema Changes**: Be aware that changes to your GraphQL schema may require updates to your GQLPT queries and regeneration of types.

## Troubleshooting

If you encounter issues while generating or using types:

- **Generation Failures**: Ensure you have the correct permissions and that introspection is enabled on your GraphQL server (for remote schemas).
- **Type Mismatches**: If you notice type mismatches, try regenerating the types. Your schema may have changed.
- **Missing Types**: Verify that you're running the CLI command from the correct directory and that your project structure is as expected.
- **Performance Issues**: For large schemas, type generation might take longer. Be patient, or consider using a subset of your schema if possible.

## Conclusion

Generating TypeScript types for your GQLPT queries is a powerful way to enhance your development experience and catch potential errors early. By following this guide, you'll be able to leverage the full power of TypeScript in your GQLPT projects, ensuring type safety and improving code quality.

Remember, GQLPT handles most of the type integration automatically, so once you've generated the types, you can focus on writing your queries and let GQLPT take care of the rest!
