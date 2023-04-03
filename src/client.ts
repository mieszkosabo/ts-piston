import { ExecuteRequest, ExecuteResponse } from "./types";
import { Language } from "./types.generated";

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

  const execute = async <Lang extends Language["language"]>(
    request: ExecuteRequest<Lang>
  ): Promise<ExecuteResponse> => {
    const normalizedRequest = {
      ...request,
      version: request.version || "*",
    };

    const response = await fetch(executeUrl, {
      method: "POST",
      body: JSON.stringify(normalizedRequest),
    });

    return response.json();
  };

  return {
    runtimes,
    execute,
  };
};
