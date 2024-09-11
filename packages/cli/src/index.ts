#!/usr/bin/env node
import { Command } from "commander";
import dotenv from "dotenv";

import { generate } from "./commands/generate";

dotenv.config();

const program = new Command();

program
  .name("gqlpt")
  .description("CLI to generate type definitions for GQLPT")
  .version("1.0.0");

program.addCommand(generate);

program.parse();
