import type { RuntimesResponse } from "../types";

export const generateLanguages = (
	languages: Extract<RuntimesResponse, { type: "success" }>["languages"]
): string => {
	const langEnum = languages.flatMap((language) => {
		const { language: name, version, aliases } = language;
		return [name, ...aliases].map((name) => ({
			name,
			version,
		}));
	});

	const langType = langEnum.map((language) => {
		const { name, version } = language;
		return `{ language: "${name}"; version: "${version}" | "*" }`;
	});

	return `export type Language =\n\t| ${langType.join("\n\t| ")};\n`;
};
