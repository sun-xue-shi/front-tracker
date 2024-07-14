import { ResourceFlowTiming } from "./types";

export function getRF(): ResourceFlowTiming[] {
  const resourceArr = performance.getEntriesByType("resource");

  return resourceArr.map((recourceItem) => {
    const {
      name,
      transferSize,
      initiatorType,
      startTime,
      responseEnd,
      domainLookupEnd,
      domainLookupStart,
      connectStart,
      connectEnd,
      secureConnectionStart,
      responseStart,
      requestStart,
    } = recourceItem;

    return {
      name,
      responseEnd,
      startTime,
      initiatorType,
      transferSize,
      DNS: domainLookupEnd - domainLookupStart,
      SSL: connectEnd - secureConnectionStart,
      TCP: connectEnd - connectStart,
      TTFB: responseStart - requestStart,
      Trans: responseEnd - responseStart,
    };
  });
}
