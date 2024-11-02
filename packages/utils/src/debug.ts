import Debug from "debug";

const prefix = `@gqlpt/`;

export type LogLevel = "error" | "warn" | "info" | "debug" | "trace";

export interface LeveledDebugger {
  error: Debug.Debugger;
  info: Debug.Debugger;
}

export function createDebugger(namespace: string): LeveledDebugger {
  const baseNamespace = `${prefix}${namespace}`;

  const debugr: LeveledDebugger = {
    error: Debug(`${baseNamespace}:error`),
    info: Debug(`${baseNamespace}:info`),
  };

  return debugr;
}

export { Debug as Debugger } from "debug";
