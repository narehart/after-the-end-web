#!/usr/bin/env node

import { program } from "commander";

program
  .name("gt")
  .version("0.1.0")
  .command("sprite-types", "Generate a TypeScript file for sprites.");

program.parse(process.argv);
