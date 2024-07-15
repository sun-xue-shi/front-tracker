import { PageInformation } from "./types";

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
    userAgent,
    language: language.substring(0, 2),
    title: document.title,
    winScreen: `${width}x${height}`,
    docScreen: `${document.documentElement.clientWidth || document.body.clientWidth}x${document.documentElement.clientHeight || document.body.clientHeight}`,
  };
}
