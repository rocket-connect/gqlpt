import { AdapterAnthropic } from "@gqlpt/adapter-anthropic";
import { Adapter } from "@gqlpt/adapter-base";
import { AdapterOpenAI } from "@gqlpt/adapter-openai";

import { Command } from "commander";
import fs from "fs/promises";
import { GQLPTClient } from "gqlpt";
import path from "path";

import { generateTypesAndQueries } from "../generator";
import { parseFiles } from "../parser";

export const generate = new Command("generate");

generate
  .description("Generate type definitions for GQLPT")
  .argument("<source>", "Source directory to scan for GQLPT usage")
  .option(
    "-a, --adapter <adapter>",
    "The type of adapter to use either OpenAI or Anthropic",
    process.env.GQLPT_ADAPTER || "openai",
  )
  .option(
    "-k --key <key>",
    "API key for the adapter or set env OPENAI_API_KEY or ANTHROPIC_API_KEY",
  )
  .option(
    "-o --output <path>",
    "Output path for generated types or set env GQLPT_OUTPUT_PATH",
  )
  .option(
    "-g --generated <path>",
    "Output path for generated queries or set env GQLPT_GENERATED_PATH",
  )
  .option(
    "-t --typeDefs <typeDefs>",
    "Path to type definitions file to use or set env GQLPT_TYPE_DEFS",
  )
  .option("-u --url <url>", "GraphQL server URL or set env GQLPT_URL")
  .option(
    "-h --headers <headers>",
    "Headers to send to the server or set env GQLPT_HEADERS",
  )
  .option("-r --raw", "Raw type definitions to stdout or set env GQLPT_RAW")
  .option(
    "-rg --rawgen",
    "Raw generated queries to stdout or set env GQLPT_RAW_GENERATED",
  )
  .action(async (source, options) => {
    let adapter: Adapter;

    const adapterType =
      options.adapter || process.env.GQLPT_ADAPTER || "openai";
    switch (adapterType.toLowerCase()) {
      case "openai":
        adapter = new AdapterOpenAI({
          apiKey: options.key || process.env.OPENAI_API_KEY,
        });
        break;
      case "anthropic":
        adapter = new AdapterAnthropic({
          apiKey: options.key || process.env.ANTHROPIC_API_KEY,
        });
        break;
      default:
        throw new Error("Invalid adapter");
    }

    let outputPath: string;
    if (options.output || process.env.GQLPT_OUTPUT_PATH) {
      outputPath = path.resolve(
        process.cwd(),
        options.output || process.env.GQLPT_OUTPUT_PATH,
      );
    } else {
      outputPath = path.resolve(
        process.cwd(),
        "node_modules/gqlpt/build/types.d.ts",
      );
    }

    let generatedPath: string;
    if (options.generated || process.env.GQLPT_GENERATED_PATH) {
      generatedPath = path.resolve(
        process.cwd(),
        options.generated || process.env.GQLPT_GENERATED_PATH,
      );
    } else {
      generatedPath = path.resolve(
        process.cwd(),
        "node_modules/gqlpt/build/generated.json",
      );
    }

    let typeDefs: string = "";
    if (options.typeDefs || process.env.GQLPT_TYPE_DEFS) {
      typeDefs = await fs.readFile(
        options.typeDefs || process.env.GQLPT_TYPE_DEFS,
        "utf-8",
      );
    }

    let headers: undefined | Record<string, string> = undefined;
    if (options.headers || process.env.GQLPT_HEADERS) {
      headers = JSON.parse(options.headers || process.env.GQLPT_HEADERS);
    }

    const client = new GQLPTClient({
      adapter,
      typeDefs,
      url: options.url || process.env.GQLPT_URL,
      headers,
    });
    await client.connect();

    const srcDir = path.resolve(process.cwd(), source);

    const files = await getTypeScriptFiles(srcDir);

    const queries = await parseFiles(files);
    const { typesContent, queriesContent } = await generateTypesAndQueries({
      queries: queries.map((x) => x.query),
      client,
      schemaHash: client.schemaHash as string,
    });

    if (options.raw || process.env.GQLPT_RAW) {
      process.stdout.write(typesContent);
    } else {
      await fs.writeFile(outputPath, typesContent);
    }

    if (options.rawgen || process.env.GQLPT_RAW_GENERATED) {
      process.stdout.write(queriesContent);
    } else {
      await fs.writeFile(generatedPath, queriesContent);
    }
  });

async function getTypeScriptFiles(dir: string): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map((entry) => {
      const res = path.resolve(dir, entry.name);
      return entry.isDirectory() ? getTypeScriptFiles(res) : res;
    }),
  );
  return files
    .flat()
    .filter((file) => file.endsWith(".ts") || file.endsWith(".tsx"));
}
