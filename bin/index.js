#!/usr/bin/env node

const { createPistonClient } = require("../dist/ts-piston.cjs.prod");
const { generateTypes } = require("../dist/generateTypes");
const fs = require("fs");
const path = require("path");

const declarationsPath = path.join(
  "node_modules",
  "ts-piston",
  "dist",
  "declarations",
  "src"
);

const languageFilePath = path.join(declarationsPath, "language.type.d.ts");
const clientFilePath = path.join(declarationsPath, "client.d.ts");

(async () => {
  const client = createPistonClient();
  const runtimes = await client.runtimes();

  if (runtimes.type === "error") {
    throw new Error("Failed to generate types: could not fetch runtimes");
  }

  const languageTypeString = generateTypes(runtimes.languages);
  fs.writeFileSync(languageFilePath, languageTypeString);

  const clientFileContent = fs.readFileSync(clientFilePath).toString();
  const updatedClientFileContent =
    "import { Language } from './language.type'\n"
      .concat(clientFileContent)
      .replace("<Lang extends string>", `<Lang extends Language["language"]>`);

  fs.writeFileSync(clientFilePath, updatedClientFileContent);
})();
