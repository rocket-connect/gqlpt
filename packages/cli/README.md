# @gqlpt/cli

<div align="center" style="text-align: center;">
<img src="https://github.com/rocket-connect/gqlpt/raw/main/apps/playground/public/logo.svg" width="20%" alt="GQLPT">
</div>

GQLPT CLI is a powerful command-line tool for generating type definitions for GQLPT (GraphQL Plain Text) queries. It scans your project for GQLPT usage and generates corresponding TypeScript type definitions.

## Installation

```bash
npm install -g @gqlpt/cli
```

## Usage

```bash
npx @gqlpt/cli generate <source> [options]
```

### Arguments

- `<source>`: Source directory to scan for GQLPT usage

### Options

- `-a, --adapter <adapter>`: The type of adapter to use, either 'openai' or 'anthropic' (default: 'openai')
- `-k, --key <key>`: API key for the chosen adapter (overrides environment variable)
- `-o, --output <path>`: Custom output path for generated types (default: 'node_modules/gqlpt/build/types.d.ts')
- `-t, --typeDefs <typeDefs>`: Path to GraphQL schema definition file
- `-u, --url <url>`: GraphQL server URL for schema introspection
- `-h, --headers <headers>`: Headers to send to the GraphQL server (as JSON string)
- `-r, --raw`: Output raw type definitions to stdout instead of writing to a file
- `--help`: Display help for command

## Environment Variables

Depending on the chosen adapter, you can set the corresponding API key as an environment variable:

- For OpenAI: `OPENAI_API_KEY`
- For Anthropic: `ANTHROPIC_API_KEY`

These can be overridden by the `-k, --key` option.

## Examples

1. Generate types using OpenAI adapter (default):

```bash
npx @gqlpt/cli generate ./src
```

2. Generate types using Anthropic adapter with a custom API key:

```bash
npx @gqlpt/cli generate ./src -a anthropic -k your-api-key
```

3. Specify custom output path:

```bash
npx @gqlpt/cli generate ./src -o ./types/gqlpt-types.d.ts
```

4. Use a GraphQL server URL for schema introspection:

```bash
npx @gqlpt/cli generate ./src -u http://your-graphql-server.com/graphql
```

5. Specify custom headers for the GraphQL server:

```bash
npx @gqlpt/cli generate ./src -u http://your-graphql-server.com/graphql -h '{"Authorization": "Bearer token"}'
```

6. Output raw type definitions to stdout:

```bash
npx @gqlpt/cli generate ./src -r > types.ts
```

## How It Works

1. The CLI scans the specified source directory for TypeScript files.
2. It parses these files to find GQLPT query usage.
3. Using the specified adapter (OpenAI or Anthropic), it generates TypeScript type definitions for the found queries.
4. The generated types are either written to the specified output file or output to stdout if the `-r, --raw` option is used.

## Notes

- If neither `typeDefs` nor `url` is provided, the CLI will look for a `schema.gql` file in the project root.
- When using a GraphQL server URL, the CLI will perform schema introspection to generate the types.
- The default output path is `node_modules/gqlpt/build/types.d.ts`. Ensure you have write permissions for this directory.

## Troubleshooting

If you encounter any issues, make sure:

1. You have the correct API key set (either as an environment variable or using the `-k, --key` option).
2. The source directory you're specifying exists and contains TypeScript files.
3. If using `typeDefs`, the GraphQL schema file exists at the specified location.
4. If using `url`, the GraphQL server is accessible and responds to introspection queries.
5. You have write permissions for the output directory (when not using the `-r, --raw` option).

For any other issues, please open an issue on the GitHub repository.

## License

MIT - Rocket Connect - https://github.com/rocket-connect
