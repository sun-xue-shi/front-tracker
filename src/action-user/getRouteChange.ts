//由于pushState和replaceState方法不会触发popstate事件，所以要单独创建事件来监听
function writeHistoryEvent(type: keyof History) {
  const originEvent = history[type];
  return function (this: any) {
    const res = originEvent.apply(this, arguments);
    const newEvent = new Event(type);
    window.dispatchEvent(newEvent);
    return res;
  };
}

// 添加上述两个事件
export function addHistoryEvent() {
  history.pushState = writeHistoryEvent("pushState");
  history.replaceState = writeHistoryEvent("replaceState");
}

//监听上述两个事件 + popstate事件
export function trackRouteChange(handler: Function) {
  window.addEventListener("popstate", (e) => handler(e), true);
  window.addEventListener("pushState", (e) => handler(e), true);
  window.addEventListener("replaceState", (e) => handler(e), true);
}
