import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import prettier from "prettier";

function camelize(str: string) {
  return str
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase());
}

function run() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const imagesPath = path.resolve(__dirname, "..", "src", "images");

  const filePaths = fs.readdirSync(imagesPath).filter((filePath) => {
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

    imports.push(`import ${varName} from "../images/${fileBaseName}";`);

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

  fs.writeFileSync("./src/data/sprites.ts", prettier.format(str));
}

run();
