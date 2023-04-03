import { createPistonClient } from "../src";
import { generateTypes } from "../src/generateTypes";
import fs from "fs";

(async () => {
  const client = createPistonClient();
  const runtimes = await client.runtimes();

  if (runtimes.type === "error") {
    throw new Error("Failed to generate types: could not fetch runtimes");
  }

  const languageTypeString = generateTypes(runtimes.languages);
  fs.writeFileSync("./src/types.generated.ts", languageTypeString);
})();
