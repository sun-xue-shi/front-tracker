import { HttpMetricsData } from "./types";

export function holdFetch(loadHandler: Function) {
  if ("fetch" in window && typeof window.fetch === "function") {
    const newFetch = window.fetch;
    if (!(window as any).newFetch) {
      (window as any).newFetch = newFetch;
    }

    (window as any).fetch = async (input: any, init: RequestInit) => {
      let httpMetricsData = {} as HttpMetricsData;

      httpMetricsData.body = init.body || "";
      httpMetricsData.method = init.method || "";
      httpMetricsData.requestTime = new Date().getTime();
      httpMetricsData.url =
        (input && typeof input !== "string" ? input?.url : input) || "";

      return newFetch.call(window, input, init).then(async (response) => {
        const res = response.clone();

        httpMetricsData = {
          ...httpMetricsData,
          responseTime: new Date().getTime(),
          status: res.status,
          statusText: res.statusText,
          response: res.text() || JSON.parse(await res.text()),
        };

        if (typeof loadHandler === "function") loadHandler(httpMetricsData);

        return response;
      });
    };
  }
}
