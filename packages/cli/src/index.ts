#!/usr/bin/env node
import { Command } from "commander";

import { generate } from "./commands/generate";

const program = new Command();

program
  .name("gqlpt")
  .description("CLI to generate type definitions for GQLPT")
  .version("1.0.0");

program.addCommand(generate);

program.parse();
