import { getPageInfo } from "../action-user/getPageInfo";
import { holdFetch } from "../action-user/holdFetch";
import { holdHTTP } from "../action-user/holdHTTP";
import { HttpMetricsData } from "../action-user/types";
import { Tracker } from "../core";
import { Report } from "../core/type";
import { getErrorId } from "../utils/getErrorId";
import { getErrorKey } from "./getErrorKey";
import { resolveErrorStack } from "./resolveErrorStack";
import { ErrorData, ErrorOptions, ErrorType } from "./types";

export class ErrorTracker {
  public trackerInstance: Tracker;
  private options: ErrorOptions;
  private report: Report;
  private submitErrorIds: string[];

  constructor(
    options: true | ErrorOptions,
    report: Report,
    trackerInstance: Tracker
  ) {
    this.submitErrorIds = [];
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
    this.report = report;
    this.trackerInstance = trackerInstance;
    this.installErrorTracker();
  }

  private initJsError() {
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
          behaviorStack:
            this.trackerInstance?.userActionTracker?.userBehaviorStack?.get(),
        };
        //上报
        this.errorDataReport(errorData);
      },
      true
    );
  }

  private initRsError() {
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
          behaviorStack:
            this.trackerInstance?.userActionTracker?.userBehaviorStack?.get(),
        };
        //上报
        this.errorDataReport(errorData);
      },
      true
    );
  }

  private initPromiseError() {
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
          behaviorStack:
            this.trackerInstance?.userActionTracker?.userBehaviorStack?.get(),
        };
        //上报
        this.errorDataReport(errorData);
      },
      true
    );
  }

  private initHttpError() {
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
        behaviorStack:
          this.trackerInstance?.userActionTracker?.userBehaviorStack?.get(),
      };
      //上报
      this.errorDataReport(errorData);
    };
    holdFetch(loadhandler);
    holdHTTP(loadhandler);
  }

  private initCorsError() {
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
          behaviorStack:
            this.trackerInstance?.userActionTracker?.userBehaviorStack?.get(),
        };
        //上报
        this.errorDataReport(errorData);
      },
      true
    );
  }

  private installErrorTracker() {
    if (this.options.js) this.initJsError();
    if (this.options.resource) this.initRsError();
    if (this.options.promise) this.initPromiseError();
    if (this.options.http) this.initHttpError();
    if (this.options.cors) this.initCorsError();
  }

  private errorDataReport(errorData: ErrorData) {
    //防止错误重复上报
    if (this.submitErrorIds.includes(errorData.errorUid)) return;
    this.submitErrorIds.push(errorData.errorUid);
    this.report(errorData, "ERROR");
  }
}
