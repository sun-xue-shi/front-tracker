import { getPageInfo } from "../action-user/getPageInfo";
import { holdFetch } from "../action-user/holdFetch";
import { holdHTTP } from "../action-user/holdHTTP";
import { HttpMetricsData } from "../action-user/types";
import { getErrorId } from "../utils/getErrorId";
import { getErrorKey } from "./getErrorKey";
import { resolveErrorStack } from "./resolveErrorStack";
import { ErrorData, ErrorOptions, ErrorType } from "./types";

export class PerformanceTracker {
  private data: Record<string, Record<string, any>>;
  public trackerInstance: any;
  private options: ErrorOptions;

  constructor(options: ErrorOptions, trackerInstance: any) {
    this.data = {};
    this.trackerInstance = trackerInstance;
    this.options = Object.assign(
      {
        js: true,
        resource: true,
        promise: true,
        http: true,
        cors: true,
      },
      options
    );
  }

  initJsError() {
    window.addEventListener(
      "error",
      (event) => {
        if (getErrorKey(event) !== ErrorType.JS) return;
        const errorData: ErrorData = {
          errorUid: getErrorId(
            `${ErrorType.JS}-${event.message}-${event.filename}`
          ),
          mechanismType: ErrorType.JS,
          errorMessage: event.message,
          type: event.error?.name || "unknow",
          pageInformation: getPageInfo(),
          errorStack: resolveErrorStack(event.error),
          meta: {
            name: event.filename,
            col: event.colno,
            row: event.lineno,
          },
          // behaviorStack:
        };
        //上报
      },
      true
    );
  }

  initRsError() {
    window.addEventListener(
      "error",
      (event) => {
        if (getErrorKey(event) !== ErrorType.RS) return;
        const target = event.target as HTMLScriptElement;
        const errorData: ErrorData = {
          errorUid: getErrorId(
            `${ErrorType.RS}-${target.src}-${target.tagName}`
          ),
          mechanismType: ErrorType.RS,
          errorMessage: "",
          type: "ResourceError",
          pageInformation: getPageInfo(),
          errorStack: resolveErrorStack(event.error),
          meta: {
            url: target.src,
            html: target.outerHTML,
            type: target.tagName,
          },
          // behaviorStack:
        };
        //上报
      },
      true
    );
  }

  initPromiseError() {
    window.addEventListener(
      "unhandledrejection",
      (event: PromiseRejectionEvent) => {
        const reason = event.reason;
        const errorData: ErrorData = {
          errorUid: getErrorId(
            `${ErrorType.PM}-${reason.message || reason}-${reason.name || "unknow"}`
          ),
          mechanismType: ErrorType.PM,
          errorMessage: reason.message || reason,
          errorStack: resolveErrorStack(reason),
          type: reason.name || "unknow",
          pageInformation: getPageInfo(),
          meta: {},
          // behaviorStack:
        };
        //上报
      },
      true
    );
  }

  initHttpError() {
    const loadhandler = (httpMetricsData: HttpMetricsData) => {
      if (httpMetricsData.status < 400) return;
      const errorData: ErrorData = {
        errorUid: getErrorId(
          `${ErrorType.HP}-${httpMetricsData.response}-${httpMetricsData.statusText}`
        ),
        mechanismType: ErrorType.HP,
        errorMessage: httpMetricsData.response,
        type: "HttpError",
        pageInformation: getPageInfo(),
        meta: {
          httpMetricsData,
        },
        // behaviorStack:
      };
      //上报
    };
    holdFetch(loadhandler);
    holdHTTP(loadhandler);
  }

  initCorsError() {
    window.addEventListener(
      "error",
      (event) => {
        if (getErrorKey(event) !== ErrorType.CS) return;
        const errorData: ErrorData = {
          errorUid: getErrorId(`${ErrorType.CS}-${event.message}`),
          mechanismType: ErrorType.CS,
          errorMessage: event.message,
          type: "CorsError",
          pageInformation: getPageInfo(),
          meta: {},
          // behaviorStack:
        };
        //上报
      },
      true
    );
  }
}
