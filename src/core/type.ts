import { Tracker } from ".";
import { UserActionOptions } from "../action-user/types";
import { ErrorOptions } from "../error/types";
import { PerformanceOptions } from "../performance/types";

/**
 * @param sdkVersion sdk版本
 * @param requestUrl 上报数据的接口地址
 * @param userActionTracker 用户行为上报
 * @param performanceTracker 性能数据上报
 * @param errorStack 错误上报
 */

export interface Options {
  sdkVersion: string | number;
  requestUrl: string;
  userActionTracker: boolean | UserActionOptions;
  performanceTracker: boolean | PerformanceOptions;
  errorTracker: boolean | ErrorOptions;
}

export type Report = Tracker["report"];

export enum SdkConfigEnum {
  /**sdk版本 */
  sdkVersion = "1.0.0",
}
