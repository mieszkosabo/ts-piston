import { ExecuteRequest, ExecuteResponse, RuntimesResponse } from "./types";
import { Language } from "./language.type";

export type CreateClientConfig = {
	baseUrl?: string;
};

const PUBLIC_API_BASE_URL = "https://emkc.org/api/v2/piston";

export const createPistonClient = (config: CreateClientConfig = {}) => {
	const { baseUrl = PUBLIC_API_BASE_URL } = config;
	const normalizedBaseUrl =
		baseUrl.at(-1) === "/" ? baseUrl.slice(0, -1) : baseUrl;

	const runtimesUrl = `${normalizedBaseUrl}/runtimes`;
	const executeUrl = `${normalizedBaseUrl}/execute`;

	const runtimes = async (): Promise<RuntimesResponse> => {
		const response = await fetch(runtimesUrl);
		if (response.ok) {
			return {
				languages: await response.json(),
				type: "success",
			};
		}

		return {
			type: "error",
			message: (await response.json()).message,
		};
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

		if (response.ok) {
			return {
				type: "success",
				...(await response.json()),
			};
		}

		return {
			type: "error",
			message: (await response.json()).message,
		};
	};

	return {
		runtimes,
		execute,
	};
};
