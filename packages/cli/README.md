# @gqlpt/cli

<div align="center" style="text-align: center;">

<img src="https://github.com/rocket-connect/gqlpt/raw/main/apps/playground/public/logo.svg" width="20%" alt="GQLPT">

</div>

GQLPT CLI is a command-line tool for generating type definitions for GQLPT (GraphQL Plain Text) queries. It scans your project for GQLPT usage and generates corresponding TypeScript type definitions.

## Installation

```bash
npm install -g @gqlpt/cli
```

## Usage

```bash
gqlpt generate <source> [options]
```

### Arguments

- `<source>`: Source directory to scan for GQLPT usage

### Options

- `-a, --adapter <adapter>`: The type of adapter to use, either 'openai' or 'anthropic' (default: 'openai')
- `-o, --output <path>`: Custom output path for generated types (default: 'node_modules/gqlpt/build/types.d.ts')
- `-t, --typeDefs <typeDefs>`: Path to GraphQL schema definition file (default: './schema.gql')
- `-h, --help`: Display help for command

## Environment Variables

Depending on the chosen adapter, you need to set the corresponding API key as an environment variable:

- For OpenAI: `OPENAI_API_KEY`
- For Anthropic: `ANTHROPIC_API_KEY`

You can set these in your shell or in a `.env` file in your project root.

## Examples

1. Generate types using OpenAI adapter (default):

```bash
gqlpt generate ./src
```

2. Generate types using Anthropic adapter:

```bash
gqlpt generate ./src -a anthropic
```

3. Specify custom output path:

```bash
gqlpt generate ./src -o ./types/gqlpt-types.d.ts
```

4. Specify custom schema file:

```bash
gqlpt generate ./src -t ./schema/my-schema.gql
```

## How It Works

1. The CLI scans the specified source directory for TypeScript files.
2. It parses these files to find GQLPT query usage.
3. Using the specified adapter (OpenAI or Anthropic), it generates TypeScript type definitions for the found queries.
4. The generated types are written to the specified output file (or the default location if not specified).

## Notes

- Make sure you have the necessary API keys set up as environment variables before running the CLI.
- The default output path is `node_modules/gqlpt/build/types.d.ts`. Ensure you have write permissions for this directory.
- The CLI assumes your GraphQL schema is in a file named `schema.gql` in your project root. Use the `-t` option if your schema is located elsewhere.

## Troubleshooting

If you encounter any issues, make sure:

1. You have the correct API key set as an environment variable.
2. The source directory you're specifying exists and contains TypeScript files.
3. The GraphQL schema file exists at the specified location.
4. You have write permissions for the output directory.

For any other issues, please open an issue on the GitHub repository.

## License

MIT - Rocket Connect - https://github.com/rocket-connect
