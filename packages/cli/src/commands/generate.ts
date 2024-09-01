import { AdapterAnthropic } from "@gqlpt/adapter-anthropic";
import { Adapter } from "@gqlpt/adapter-base";
import { AdapterOpenAI } from "@gqlpt/adapter-openai";

import { Command } from "commander";
import fs from "fs/promises";
import { GQLPTClient } from "gqlpt";
import path from "path";

import { generateTypes } from "../generator";
import { parseFiles } from "../parser";

export const generate = new Command("generate");

generate
  .description("Generate type definitions for GQLPT")
  .argument("<source>", "Source directory to scan for GQLPT usage")
  .option(
    "-a, --adapter <adapter>",
    "The type of adapter to use either OpenAI or Anthropic",
    "openai",
  )
  .option("-o, --output <path>", "Output path for generated types")
  .option("-t --typeDefs <typeDefs>", "Path to type definitions file")
  .option("-u --url <url>", "GraphQL server URL")
  .option("-h --headers <headers>", "Headers to send to the server")
  .option("-r --raw", "Raw type definitions to stdout")
  .action(async (source, options) => {
    let adapter: Adapter;

    switch (options.adapter) {
      case "openai":
        if (!process.env.OPENAI_API_KEY) {
          throw new Error("process.env.OPENAI_API_KEY is required");
        }
        adapter = new AdapterOpenAI({
          apiKey: process.env.OPENAI_API_KEY,
        });
        break;
      case "anthropic":
        if (!process.env.ANTHROPIC_API_KEY) {
          throw new Error("process.env.ANTHROPIC_API_KEY is required");
        }
        adapter = new AdapterAnthropic({
          apiKey: process.env.ANTHROPIC_API_KEY,
        });
        break;
      default:
        throw new Error("Invalid adapter");
    }

    let outputPath: string;
    if (options.output) {
      outputPath = path.resolve(process.cwd(), options.output);
    } else {
      outputPath = path.resolve(
        process.cwd(),
        "node_modules/gqlpt/build/types.d.ts",
      );
    }

    let typeDefs: string = "";
    if (options.typeDefs) {
      typeDefs = await fs.readFile(options.typeDefs, "utf-8");
    }

    let headers: undefined | Record<string, string> = undefined;
    if (options.headers) {
      headers = JSON.parse(options.headers);
    }

    const client = new GQLPTClient({
      adapter,
      typeDefs,
      url: options.url,
      headers,
    });
    await client.connect();

    const srcDir = path.resolve(process.cwd(), source);

    const files = await getTypeScriptFiles(srcDir);

    const queries = await parseFiles(files);

    const typesContent = await generateTypes({
      queries: queries.map((x) => x.query),
      client,
    });

    if (options.raw) {
      process.stdout.write(typesContent);
    } else {
      await fs.writeFile(outputPath, typesContent);
      console.log("Type generation complete!");
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
