#!/usr/bin/env node
import { Command } from "commander";
import fs from "fs/promises";
import path from "path";

import { generateTypes } from "./generator";
import { parseFiles } from "./parser";

const program = new Command();

program
  .name("@gqlpt/cli")
  .description("CLI to generate type definitions for GQLPT")
  .version("1.0.0");

program
  .command("generate")
  .description("Generate type definitions for GQLPT")
  .argument("<source>", "Source directory to scan for GQLPT usage")
  .option(
    "-o, --output <path>",
    "Output path for generated types",
    "../gqlpt/src/types.ts",
  )
  .action(async (source, options) => {
    try {
      const srcDir = path.resolve(process.cwd(), source);
      const outputPath = path.resolve(process.cwd(), options.output);

      console.log(`Scanning directory: ${srcDir}`);
      const files = await getTypeScriptFiles(srcDir);
      console.log(`Found ${files.length} TypeScript files`);

      console.log("Parsing files for GQLPT usage...");
      const queries = await parseFiles(files);
      console.log(`Found ${queries.length} unique GQLPT queries`);

      console.log("Generating type definitions...");
      const typesContent = await generateTypes(queries);

      console.log(`Writing type definitions to ${outputPath}`);
      await fs.writeFile(outputPath, typesContent);

      console.log("Type generation complete!");
    } catch (error) {
      console.error("Error generating types:", error);
      process.exit(1);
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

program.parse();
