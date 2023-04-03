/**
 * This file will be replace by the postinstall script
 */

export type RuntimesResponse =
  | {
      type: "success";
      languages: {
        language: string;
        version: string;
        aliases: string[];
        runtime?: string;
      }[];
    }
  | {
      type: "error";
      message: string;
    };

export type ExecuteRequest = {
  language: string;
  version?: string;
  files: {
    name?: string;
    content: string;
    encoding?: string;
  }[];
  stdin?: string;
  args?: string[];
  run_timeout?: number;
  compile_timeout?: number;
  compile_memory_limit?: number;
  run_memory_limit?: number;
};

export type ExecuteResponse =
  | {
      type: "success";
      language: string;
      version: string;
      run: {
        stdout: string;
        stderr: string;
        output: string;
        code: number;
        signal: number | null;
      };
      compile?: {
        stdout: string;
        stderr: string;
        output: string;
        code: number;
        signal: number | null;
      };
    }
  | {
      type: "error";
      message: string;
    };
