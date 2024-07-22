//生成唯一的错误编码
export function getErrorId(input: string) {
  return window.btoa(unescape(encodeURIComponent(input)));
}
