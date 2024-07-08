export const afterLoad = (callback: () => any) => {
  // 只在页面加载完成后的事件捕获阶段执行一次callback
  if (document.readyState === "complete") {
    setTimeout(callback);
  } else {
    window.addEventListener("pageshow", callback, {
      once: true,
      capture: true,
    });
  }
};
