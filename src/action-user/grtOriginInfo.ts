import { OriginInformation } from "./types";

export function getOriginInfo(): OriginInformation {
  return {
    referrer: document.referrer,
    type: performance.getEntriesByType("navigation")[0].type,
  };
}
