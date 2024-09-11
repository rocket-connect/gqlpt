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
- `-k, --key <key>`: API key for the chosen adapter
- `-o, --output <path>`: Custom output path for generated types
- `-t, --typeDefs <typeDefs>`: Path to GraphQL schema definition file
- `-u, --url <url>`: GraphQL server URL for schema introspection
- `-h, --headers <headers>`: Headers to send to the GraphQL server (as JSON string)
- `-r, --raw`: Output raw type definitions to stdout instead of writing to a file
- `--help`: Display help for command

## Environment Variables

You can set the following environment variables as alternatives to the CLI options:

- `GQLPT_ADAPTER`: Corresponds to `-a, --adapter`
- `OPENAI_API_KEY` or `ANTHROPIC_API_KEY`: Corresponds to `-k, --key` (depending on the chosen adapter)
- `GQLPT_OUTPUT_PATH`: Corresponds to `-o, --output`
- `GQLPT_TYPE_DEFS`: Corresponds to `-t, --typeDefs`
- `GQLPT_URL`: Corresponds to `-u, --url`
- `GQLPT_HEADERS`: Corresponds to `-h, --headers`
- `GQLPT_RAW`: Corresponds to `-r, --raw` (set to any value to enable)

These environment variables can be overridden by their corresponding command-line options.

## Examples

1. Generate types using OpenAI adapter (default) with GitHub API:

```bash
npx @gqlpt/cli generate ./src -u https://api.github.com/graphql -h '{"Authorization": "Bearer YOUR_GITHUB_TOKEN"}'
```

2. Generate types using Anthropic adapter with GitHub API:

```bash
npx @gqlpt/cli generate ./src -a anthropic -k YOUR_ANTHROPIC_API_KEY -u https://api.github.com/graphql -h '{"Authorization": "Bearer YOUR_GITHUB_TOKEN"}'
```

3. Specify custom output path:

```bash
npx @gqlpt/cli generate ./src -o ./types/gqlpt-types.d.ts -u https://api.github.com/graphql -h '{"Authorization": "Bearer YOUR_GITHUB_TOKEN"}'
```

4. Use a specific GitHub API version:

```bash
npx @gqlpt/cli generate ./src -u https://api.github.com/graphql -h '{"Authorization": "Bearer YOUR_GITHUB_TOKEN", "X-GitHub-Api-Version": "2022-11-28"}'
```

5. Output raw type definitions to stdout:

```bash
npx @gqlpt/cli generate ./src -r -u https://api.github.com/graphql -h '{"Authorization": "Bearer YOUR_GITHUB_TOKEN"}' > github-types.ts
```

6. Combine multiple options:

```bash
npx @gqlpt/cli generate ./src -a openai -k YOUR_OPENAI_API_KEY -o ./types/github-types.d.ts -u https://api.github.com/graphql -h '{"Authorization": "Bearer YOUR_GITHUB_TOKEN", "X-GitHub-Api-Version": "2022-11-28"}' -r
```

## How It Works

1. The CLI scans the specified source directory for TypeScript files.
2. It parses these files to find GQLPT query usage.
3. Using the specified adapter (OpenAI or Anthropic), it generates TypeScript type definitions for the found queries.
4. The generated types are either written to the specified output file or output to stdout if the `-r, --raw` option or `GQLPT_RAW` environment variable is set.

## Notes

- If neither `typeDefs` nor `url` is provided, the CLI will attempt to connect to a GraphQL server using the provided or default configuration.
- When using a GraphQL server URL, the CLI will perform schema introspection to generate the types.
- The default output path is `node_modules/gqlpt/build/types.d.ts` if not specified. Ensure you have write permissions for this directory.

## Troubleshooting

If you encounter any issues, make sure:

1. You have the correct API key set (either as an environment variable or using the `-k, --key` option).
2. The source directory you're specifying exists and contains TypeScript files.
3. If using `typeDefs`, the GraphQL schema file exists at the specified location.
4. If using `url`, the GraphQL server is accessible and responds to introspection queries.
5. You have write permissions for the output directory (when not using the `-r, --raw` option or `GQLPT_RAW` environment variable).

For any other issues, please open an issue on the GitHub repository.

## License

MIT - Rocket Connect - https://github.com/rocket-connect
