import { rest } from "msw";
import { setupServer } from "msw/node";

import runtimesMock from "./responses/runtimes.mock.json";
import executeOkMock from "./responses/execute-ok.mock.json";

export const UNKNOWN_LANGUAGE = "some-unknown-language";
export const PRIVATE_API_BASE_URL = "https://example.com/piston";

const handlers = [
	rest.get("https://emkc.org/api/v2/piston/runtimes", (req, res, ctx) => {
		return res(ctx.status(200), ctx.json(runtimesMock));
	}),
	rest.post("https://emkc.org/api/v2/piston/execute", async (req, res, ctx) => {
		if ((await req.json()).language === UNKNOWN_LANGUAGE) {
			return res(
				ctx.status(400),
				ctx.json({ message: `${UNKNOWN_LANGUAGE} runtime is unknown` })
			);
		}

		return res(ctx.status(200), ctx.json(executeOkMock));
	}),
	rest.post(`${PRIVATE_API_BASE_URL}/execute`, async (req, res, ctx) => {
		if ((await req.json()).language === UNKNOWN_LANGUAGE) {
			return res(
				ctx.status(400),
				ctx.json({ message: `${UNKNOWN_LANGUAGE} runtime is unknown` })
			);
		}

		return res(ctx.status(200), ctx.json(executeOkMock));
	}),
];

export const server = setupServer(...handlers);
