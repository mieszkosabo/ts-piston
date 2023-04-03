import { ExecuteRequest, ExecuteResponse } from "./types";

type createClientConfig = {
  baseUrl?: string;
};

const PUBLIC_API_BASE_URL = "https://emkc.org/api/v2/piston";

export const createPistonClient = (config: createClientConfig = {}) => {
  const { baseUrl = PUBLIC_API_BASE_URL } = config;
  const normalizedBaseUrl =
    baseUrl.at(-1) === "/" ? baseUrl.slice(0, -1) : baseUrl;

  const runtimesUrl = `${normalizedBaseUrl}/runtimes`;
  const executeUrl = `${normalizedBaseUrl}/execute`;

  const runtimes = async () => {
    const response = await fetch(runtimesUrl);
    return response.json();
  };

  const execute = async (request: ExecuteRequest): Promise<ExecuteResponse> => {
    const response = await fetch(executeUrl, {
      method: "POST",
      body: JSON.stringify(request),
    });
    return response.json();
  };

  return {
    runtimes,
    execute,
  };
};
