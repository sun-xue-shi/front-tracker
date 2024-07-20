import { HttpMetricsData } from "./types";

export function holdHTTP(loadHandler: Function) {
  if (
    "XMLHttpRequest" in window &&
    typeof window.XMLHttpRequest === "function"
  ) {
    const newXMLHttpRequest = window.XMLHttpRequest;
    if (!(window as any).newXMLHttpRequest) {
      (window as any).newXMLHttpRequest = newXMLHttpRequest;
    }

    (window as any).XMLHttpRequest = function () {
      const xhr = new newXMLHttpRequest();
      let httpMetricsData = {} as HttpMetricsData;
      const { open, send } = xhr;
      xhr.open = (method, url) => {
        httpMetricsData.method = method;
        httpMetricsData.url = url;
        open.call(xhr, method, url, true);
      };

      xhr.send = (body) => {
        httpMetricsData.body = body || "";
        httpMetricsData.requestTime = new Date().getTime();
        send.call(xhr, body);
      };

      xhr.addEventListener("loadend", () => {
        const { status, statusText, response } = xhr;
        httpMetricsData = {
          ...httpMetricsData,
          status,
          statusText,
          response: response && JSON.parse(response),
          responseTime: new Date().getTime(),
        };
        if (typeof loadHandler === "function") loadHandler(httpMetricsData);
      });

      return xhr;
    };
  }
}
