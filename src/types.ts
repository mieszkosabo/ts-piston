export type ExecuteRequest = {
  language: string;
  version: string;
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

export type ExecuteResponse = {
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
};
