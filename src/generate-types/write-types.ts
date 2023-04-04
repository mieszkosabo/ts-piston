#!/usr/bin/env node

import { createPistonClient } from "../client";
import { generateLanguages } from "./generate-languages";
import * as fs from "fs";
import * as path from "path";

const declarationsPath = path.join(
	"node_modules",
	"ts-piston",
	"dist",
	"declarations",
	"src"
);

const languageFilePath = path.join(declarationsPath, "language.type.d.ts");
const clientFilePath = path.join(declarationsPath, "client.d.ts");

export const run = async () => {
	const client = createPistonClient();
	const runtimes = await client.runtimes();

	if (runtimes.type === "error") {
		throw new Error("Failed to generate types: could not fetch runtimes");
	}

	// fully replace the language.type.d.ts file with the type generated from the API response
	const languageTypeString = generateLanguages(runtimes.languages);
	fs.writeFileSync(languageFilePath, languageTypeString);

	// At build time, the `Language["language"]` is being inferred to be `string`, so it is being simplified,
	// but now we need to bring the `Language["language"]` back.
	// We also need to import the `Language` type.
	const clientFileContent = fs.readFileSync(clientFilePath).toString();
	const updatedClientFileContent =
		"import { Language } from './language.type'\n"
			.concat(clientFileContent)
			.replace("<Lang extends string>", `<Lang extends Language["language"]>`);

	fs.writeFileSync(clientFilePath, updatedClientFileContent);
};
