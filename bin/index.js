#!/usr/bin/env node

const { run } = require("../dist/generate-types/write-types");

run().catch((e) => {
	console.error(e);
	process.exit(1);
});
