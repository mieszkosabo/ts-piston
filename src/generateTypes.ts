import { RuntimesResponse } from "../dist/declarations/src/types";

type Language = Extract<
  RuntimesResponse,
  { type: "success" }
>["languages"][number];

export const generateTypes = (
  languages: Extract<RuntimesResponse, { type: "success" }>["languages"]
) => {
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
