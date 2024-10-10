---
title: "Query Caching for GQLPT: Optimizing Performance and Consistency"
description: "Learn how GQLPT automatically generates and caches GraphQL queries for your projects. This guide covers the benefits of query caching, how it works by default, and advanced configuration options."
keywords:
  [
    GQLPT,
    GraphQL,
    query caching,
    performance optimization,
    CLI,
    developer experience,
  ]
sidebar_label: "Query Caching"
sidebar_position: 11
---

# Query Caching

This guide explains how GQLPT automatically generates and caches GraphQL queries for your projects, ensuring consistency and improving performance.

## Why Cache Queries?

GQLPT's query caching feature offers several benefits:

1. **Performance**: Reduce the time needed to generate queries on subsequent runs.
2. **Consistency**: Ensure the same query is used across different runs and environments.
3. **Version Control**: Track changes to your queries over time.
4. **Offline Development**: Work with predefined queries without needing to regenerate them.

## How Query Caching Works

By default, GQLPT automatically caches generated queries in your project's `node_modules/gqlpt/build/generated.json` file. This means you don't need to specify any additional options to benefit from query caching.

### Step 1: Prepare Your Project

Ensure your project is set up with GQLPT and that you're using GQLPT queries in your TypeScript files.

### Step 2: Run the GQLPT CLI

Use one of the following commands, depending on your GraphQL schema source:

#### For a Remote GraphQL API:

```bash
npx @gqlpt/cli generate ./src -u https://api.example.com/graphql -h '{"Authorization": "Bearer YOUR_API_TOKEN"}'
```

Replace `https://api.example.com/graphql` with your actual GraphQL API URL and add any necessary headers.

#### For a Local Schema File:

```bash
npx @gqlpt/cli generate ./src -t ./path/to/schema.graphql
```

Replace `./path/to/schema.graphql` with the path to your local schema file.

### Step 3: Verify Query Generation and Caching

After running the command, GQLPT will generate and cache the GraphQL queries in `node_modules/gqlpt/build/generated.json`. You can inspect this file to see the cached queries.

## Using Cached Queries

Once you've run the CLI command, GQLPT will automatically use the cached queries in subsequent runs, improving performance. Here's an example of how GQLPT uses the cached queries:

```typescript
import { AdapterOpenAI } from "@gqlpt/adapter-openai";

import { GQLPTClient } from "gqlpt";

const client = new GQLPTClient({
  url: "https://api.example.com/graphql",
  adapter: new AdapterOpenAI({
    apiKey: process.env.OPENAI_API_KEY as string,
  }),
  // No need to specify generatedPath - it uses the default location
});

async function main() {
  await client.connect();

  // This will use the cached query if available
  const result = await client.generateAndSend(
    "Get user with id 1 and their recent posts",
  );

  console.log(result.data.user.name);
  console.log(result.data.user.posts);
}

main().catch(console.error);
```

## Advanced Configuration

If you want to store the cached queries in a different location, you can use the `--generated` option:

```bash
npx @gqlpt/cli generate ./src -u https://api.example.com/graphql --generated ./queries/generated.json
```

Then, in your GQLPT client configuration:

```typescript
const client = new GQLPTClient({
  // ... other options ...
  generatedPath: "./queries/generated.json",
});
```

## Best Practices

1. **Version Control**: Consider adding the `generated.json` file to your version control system to ensure consistency across your development team.

2. **Regular Updates**: Re-run the CLI command periodically, especially after schema changes, to keep your cached queries up-to-date.

3. **CI/CD Integration**: Incorporate the CLI command into your CI/CD pipeline to ensure queries are always current.

4. **Schema Changes**: Be aware that changes to your GraphQL schema may require updates to your GQLPT queries and regeneration of the cache.

5. **Environment-Specific Caches**: For advanced setups, consider maintaining separate query caches for different environments if they have different schemas.

## Troubleshooting

If you encounter issues with query caching:

- **Cache Misses**: Ensure you've run the CLI command at least once to generate the cache.
- **Outdated Queries**: If you notice unexpected query behavior, try re-running the CLI command. Your schema may have changed.
- **Performance Issues**: For large projects with many queries, generation might take longer. Be patient on the first run.

## Conclusion

GQLPT's automatic query caching is a powerful feature that optimizes performance and ensures consistency across your application. By following this guide, you'll be able to leverage query caching in your GQLPT projects with minimal configuration, improving response times and maintaining a stable query structure.

Remember, GQLPT handles query caching automatically, so in most cases, you don't need to do anything special to benefit from this feature!
