import { PerformanceNT } from "./types";

export function getNT(): PerformanceNT {
  const {
    domainLookupStart, //
    domainLookupEnd,
    connectStart,
    connectEnd,
    secureConnectionStart,
    requestStart,
    responseStart,
    responseEnd,
    domInteractive,
    domContentLoadedEventEnd,
    loadEventStart,
    fetchStart,
  } = performance.getEntriesByType("navigation")[0];

  return {
    //使用长连接或本地缓存时为0
    DNS: {
      start: domainLookupStart,
      end: domainLookupEnd,
      value: domainLookupEnd - domainLookupStart,
    },
    //使用长连接或本地缓存时为0
    TCP: {
      start: connectStart,
      end: connectEnd,
      value: connectEnd - connectStart,
    },
    //只在HTTPS下有效，判断secureConnectionStart的值是否大于0,如果为0，转为减connectEnd
    SSL: {
      start: secureConnectionStart ?? 0,
      end: secureConnectionStart ? connectEnd : 0,
      value: secureConnectionStart ? connectEnd - secureConnectionStart : 0,
    },
    TTFB: {
      start: requestStart,
      end: responseStart,
      value: responseStart - requestStart,
    },
    Trans: {
      start: responseStart,
      end: responseEnd,
      value: responseEnd - responseStart,
    },
    FP: {
      start: fetchStart,
      end: responseEnd,
      value: responseEnd - fetchStart,
    },
    DomParse: {
      start: responseEnd,
      end: domInteractive,
      value: domInteractive - responseEnd,
    },
    TTI: {
      start: fetchStart,
      end: domInteractive,
      value: domInteractive - fetchStart,
    },
    DomReady: {
      start: fetchStart,
      end: domContentLoadedEventEnd,
      value: domContentLoadedEventEnd - fetchStart,
    },
    Res: {
      start: responseEnd,
      end: loadEventStart,
      value: loadEventStart - responseEnd,
    },
    Load: {
      start: fetchStart,
      end: loadEventStart,
      value: loadEventStart - fetchStart,
    },
  };
}
