# ts-piston

Typescript client for [Piston](https://github.com/engineer-man/piston), high performance general purpose code execution engine.

## Features

- Works in both Node.js and browsers
- Offers ultimate DX by generating types directly from the API
- Supports usage of both the public API and self-hosted instances

## Installation

1. Install the package:

```bash
# npm
npm install ts-piston

# yarn
yarn add ts-piston

# pnpm
pnpm add ts-piston
```

2. _(optional)_ Generate strict types for the client:

```bash
npx ts-piston generate-types
```

This is going to call the `/runtimes` endpoint and generate TypeScript types based on it. This will provide
the type-safety (and nice IDE autocomplete) for the `language` and `version` fields in the `execute` method.

Note that if you delete the `node_modules` directory, you will have to rerun the command.

Sometimes the TypeScript language server doesn't pick up the new types, so you may have to restart it. For example, in VSCode you can do this by running the `TypeScript: Restart TS Server` command.

You may want to add this to your `postinstall` script:

```json
"scripts": {
  "postinstall": "npx ts-piston generate-types"
}
```

## Usage

```ts
import { createPistonClient } from "ts-piston";

// use the public API:
const client = createPistonClient();

// or use it with your self-hosted instance:
// const client = createPistonClient({ baseUrl: "https://example.com/piston" });

const runtimes = await client.runtimes();

const response = await client.execute({
	language: "js",
	version: "*",
	files: [
		{
			name: "my_cool_code.js",
			content: "console.log(process.argv)",
		},
	],
	args: ["1", "2", "3"],
});

if (response.type === "error") {
	console.log(response.message);
} else {
	console.log(response.run.output);
}
```
