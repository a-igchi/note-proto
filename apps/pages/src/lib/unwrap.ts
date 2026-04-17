import type { Result } from "core";

export const unwrap = <T, E extends string>(result: Result<T, E>): T => {
  if (!result.ok) throw new Error(result.error);
  return result.value;
};
