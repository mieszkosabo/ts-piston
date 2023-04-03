import { afterAll, afterEach, beforeAll, describe, expect, test } from "vitest";
import { PRIVATE_API_BASE_URL, server, UNKNOWN_LANGUAGE } from "../mocks";
import runtimesMock from "../mocks/responses/runtimes.mock.json";
import executeOkMock from "../mocks/responses/execute-ok.mock.json";
import { createPistonClient } from "../src/client";

const executeCorrectPayload = {
  language: "js",
  version: "15.10.0",
  files: [
    {
      name: "my_cool_code.js",
      content: "console.log(process.argv)",
    },
  ],
  stdin: "",
  args: ["1", "2", "3"],
  compile_timeout: 10000,
  run_timeout: 3000,
  compile_memory_limit: -1,
  run_memory_limit: -1,
};

describe("Piston client sends correct requests", () => {
  beforeAll(() => {
    server.listen();
  });

  afterEach(() => {
    server.resetHandlers();
  });

  afterAll(() => {
    server.close();
  });

  test("runtimes public api", async () => {
    const client = createPistonClient();
    const runtimes = await client.runtimes();
    expect(runtimes).toEqual(runtimesMock);
  });

  test("execute ok", async () => {
    const client = createPistonClient();
    const execute = await client.execute(executeCorrectPayload as any);

    expect(execute).toEqual(executeOkMock);
  });

  test("execute bad", async () => {
    const client = createPistonClient();
    const execute = await client.execute({
      language: UNKNOWN_LANGUAGE as any,
      version: "*",
      files: [
        {
          name: "my_cool_code.js",
          content: "console.log(process.argv)",
        },
      ],
      stdin: "",
      args: ["1", "2", "3"],
      compile_timeout: 10000,
      run_timeout: 3000,
      compile_memory_limit: -1,
      run_memory_limit: -1,
    });

    expect(execute).toEqual({
      message: `${UNKNOWN_LANGUAGE} runtime is unknown`,
    });
  });

  test("works with private API", async () => {
    const client = createPistonClient({ baseUrl: PRIVATE_API_BASE_URL });
    const execute = await client.execute(executeCorrectPayload as any);

    expect(execute).toEqual(executeOkMock);
  });

  test("works with private API that end with a slash (/)", async () => {
    const client = createPistonClient({ baseUrl: `${PRIVATE_API_BASE_URL}/` });
    const execute = await client.execute(executeCorrectPayload as any);

    expect(execute).toEqual(executeOkMock);
  });
});
