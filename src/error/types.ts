import { BehaviorStack, PageInformation } from "../action-user/types";

// 错误类型
export enum ErrorType {
  JS = "js",
  /**资源异常 */
  RS = "resource",
  /**promise请求异常 */
  PM = "promise",
  /**http请求异常 */
  HP = "http",
  /**跨域错误 */
  CS = "cors",
}

// 错误数据结构体
export interface ErrorData {
  errorUid: string;
  mechanismType: ErrorType;
  type: string;
  errorMessage?: string;
  meta: Record<string, any>;
  errorStack?: ErrorStackData[];
  behaviorStack?: BehaviorStack[];
  pageInformation?: PageInformation;
}

export interface ErrorStackData {
  fileName?: string;
  functionName?: string;
  row?: number;
  col?: number;
}

export interface ErrorOptions {
  js?: boolean;
  resource?: boolean;
  promise?: boolean;
  http?: boolean;
  cors?: boolean;
}
