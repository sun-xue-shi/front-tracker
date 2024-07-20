import { PageInformation } from "./types";
import Bowser from "bowser";
import parser from "ua-parser-js";

export function getPageInfo(): PageInformation {
  const {
    hash,
    host,
    hostname,
    href,
    pathname,
    port,
    protocol,
    search,
    origin,
  } = window.location;

  const { width, height } = window.screen;
  const { language, userAgent } = navigator;

  return {
    hash,
    host,
    hostname,
    href,
    pathname,
    port,
    protocol,
    search,
    origin,
    userAgent: resolveUA(userAgent),
    language: language.substring(0, 2),
    title: document.title,
    winScreen: `${width}x${height}`,
    docScreen: `${document.documentElement.clientWidth || document.body.clientWidth}x${document.documentElement.clientHeight || document.body.clientHeight}`,
  };
}

// 获取user-agent解析
function resolveUA(userAgent: string) {
  const browserData = Bowser.parse(userAgent);
  const parserData = parser(userAgent);
  const browserName = browserData.browser.name || parserData.browser.name; // 浏览器名
  const browserVersion =
    browserData.browser.version || parserData.browser.version; // 浏览器版本号
  const osName = browserData.os.name || parserData.os.name; // 操作系统名
  const osVersion = parserData.os.version || browserData.os.version; // 操作系统版本号
  const deviceType = browserData.platform.type || parserData.device.type; // 设备类型
  const deviceVendor =
    browserData.platform.vendor || parserData.device.vendor || ""; // 设备所属公司
  const deviceModel =
    browserData.platform.model || parserData.device.model || ""; // 设备型号
  const engineName = browserData.engine.name || parserData.engine.name; // engine名
  const engineVersion = browserData.engine.version || parserData.engine.version; // engine版本号
  return {
    browserName,
    browserVersion,
    osName,
    osVersion,
    deviceType,
    deviceVendor,
    deviceModel,
    engineName,
    engineVersion,
  };
}
