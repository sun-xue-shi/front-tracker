import { UserActionTracker } from "../action-user";
import { ErrorTracker } from "../error";
import { PerformanceTracker } from "../performance";
import { Options, SdkConfigEnum } from "./type";

export class Tracker {
  public appId: string;
  public userId?: string;
  public extra?: Record<string, any>;
  public userActionTracker?: UserActionTracker;
  public performanceTracker?: PerformanceTracker;
  public errorTracker?: ErrorTracker;
  public options: Options;

  constructor(appId: string, options: Options) {
    this.appId = appId;
    this.options = Object.assign(
      {
        sdkVersion: SdkConfigEnum.sdkVersion,
        userActionTracker: true,
        errorTracker: true,
        performanceTracker: true,
        requestUrl: "http://localhost:3000",
      },
      options
    );
    (window as any).zilongId = this.setUserId.bind(this);
    (window as any).zilongExtra = this.setExtra.bind(this);
    this.initTracker();
  }

  report(data: any, type: string) {
    const params = Object.assign(
      { data, type },
      {
        appId: this.appId,
        userId: this.userId,
        extra: this.extra,
        time: new Date().getTime(),
      }
    );
    const blob = new Blob([JSON.stringify(params)]);
    navigator.sendBeacon(this.options.requestUrl, blob);
  }

  initTracker() {
    if (this.options.errorTracker) {
      this.errorTracker = new ErrorTracker(
        this.options.errorTracker,
        this.report.bind(this),
        this
      );
    }
    if (this.options.performanceTracker) {
      this.performanceTracker = new PerformanceTracker(
        this.options.performanceTracker,
        this.report.bind(this),
        this
      );
    }
    if (this.options.userActionTracker) {
      this.userActionTracker = new UserActionTracker(
        this.options.userActionTracker,
        this.report.bind(this),
        this
      );
    }
  }

  setUserId(uid: string) {
    this.userId = uid;
  }

  setExtra(extra: Record<string, any>) {
    this.extra = extra;
  }
}
