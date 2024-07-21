import { ErrorType } from "./types";

export function getErrorKey(event: ErrorEvent | Event) {
  const isJsError = event instanceof Error;
  if (!isJsError) return ErrorType.RS;
  return event.message === "Script error." ? ErrorType.CS : ErrorType.JS;
}
