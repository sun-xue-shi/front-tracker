/**
 * @param PI 页面基本信息
 * @param RCR 路由跳转信息
 * @param OI 用户来路信息
 * @param CBR 点击事件获取
 * @param CDR 自定义获取信息
 * @param HT 请求数据的获取
 */
export enum UserActionName {
  PI = "page-information",
  OI = "origin-information",
  RCR = "router-change-record",
  CBR = "click-behavior-record",
  CDR = "custom-define-record",
  HT = "http-record",
}

/**
 * @param maxBehaviorRecords 最大行为追踪记录数
 */
export interface UserActionOptions {
  PI?: boolean;
  OI?: boolean;
  RCR?: boolean;
  DBR?: boolean;
  HT?: boolean;
  BS?: boolean;
  PV?: boolean;
  elementTrackedList?: string[];
  classTrackedList?: string[];
  eventTrackedList?: string[];
  maxBehaviorRecords: number;
}

export interface behaviorRecordsOptions {
  maxBehaviorRecords: number;
}

//用户行为记录栈
export interface BehaviorStack {
  name: UserActionName | string;
  page: string;
  timestamp: number | string;
  value: Record<string, any>;
}

//页面信息
/**
 * @param href 整个url
 * @param origin 页面来源：协议 + 域名 + 端口号 -- http://www.example.com:80
 * @param protocol 协议名
 * @param host 域名 + 端口号 -- www.example.com:8080
 * @param hostname 域名 -- www.example.com
 * @param port 端口号
 * @param pathname 路由路径
 * @param search 查询字符串(params)  -- ?name=zilong&age=18
 * @param hash URL中的片段标识符部分，#及其后的部分。
 * @param title 网页标题
 * @param language 浏览器的语种 (eg:zh) ; 这里截取前两位，有需要也可以不截取
 * @param userAgentData 用户信息
 * @param winScreen 屏幕宽高 (eg:1920x1080)  屏幕宽高意为整个显示屏的宽高
 * @param docScreen 文档宽高 (eg:1388x937)   文档宽高意为当前页面显示的实际宽高
 *
 */
export interface PageInformation {
  host: string;
  hostname: string;
  href: string;
  protocol: string;
  origin: string;
  port: string;
  pathname: string;
  search: string;
  hash: string;
  title: string;
  language: string;
  userAgent?: string;
  winScreen: string;
  docScreen: string;
}
