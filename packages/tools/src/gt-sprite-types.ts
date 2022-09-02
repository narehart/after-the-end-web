#!/usr/bin/env node

import fs from "fs";
import path from "path";
import prettier from "prettier";
import { program } from "commander";

program
  .name("sprite-types")
  .description("Generate a TypeScript file for sprites.")
  .argument("<string>", "path to directory containing sprites.")
  .argument("<string>", "path of file to output")
  .option("-w, --watch", "watch directory for changes and run program")
  .action((src, dest, opts) => {
    if (opts.watch) {
      fs.watch(src, () => {
        run(src, dest);
      });
    } else {
      run(src, dest);
    }
  })
  .parse();

function camelize(str: string) {
  return str
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase());
}

function run(src: string, dest: string) {
  const filePaths = fs.readdirSync(src).filter((filePath) => {
    return path.extname(filePath) === ".png";
  });

  if (!filePaths.length) return;

  const imports: string[] = [];
  const types: string[] = [];
  const exports: string[] = [];

  filePaths.forEach((filePath) => {
    const fileBaseName = path.basename(filePath);
    const fileBaseNameParts = fileBaseName.split(".");
    const fileName = fileBaseNameParts[0];
    const varName = camelize(fileName);

    const relative = path.relative(path.dirname(dest), src);
    const importPath = path.join(relative, fileBaseName);

    imports.push(`import ${varName} from "${importPath}";`);

    types.push(`"${fileName}"`);

    exports.push(`{ id: "${fileName}", filePath: ${varName} }`);
  });

  const str = `
    /**
     * This file was auto-generated. Do not edit manually.
    */
    ${imports.join("\n")}
    export type Sprites = ${types.join(" | ")};
    export const SPRITES = [ ${exports.join(",")} ];
  `;

  fs.writeFileSync(
    dest,
    prettier.format(str, {
      parser: "babel",
    })
  );
}
