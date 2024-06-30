export const observe = (type: string, callback: (entry: any) => any) => {
  //判断浏览器是否支持传入的EntryType性能条目
  if (PerformanceObserver.supportedEntryTypes?.includes(type)) {
    const performanceObserve = new PerformanceObserver((entryList) => {
      return entryList.getEntries().map(callback);
    });

    /* 
    buffered设置为true时，PerformanceObserver会接收自页面加载开始以来产生的所有匹配的性能条目，
    而不只是自调用observe方法之后产生的条目~~
    */
    //当type在指定性能条目中时，调用该指标的回调函数
    performanceObserve.observe({ type, buffered: true });
    return performanceObserve;
  } else {
    return undefined;
  }
};
