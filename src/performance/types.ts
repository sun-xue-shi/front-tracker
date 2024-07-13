export enum PerformanceIndexName {
  /**白屏时长 */
  FP = "first-paint",
  /**灰屏时长 */
  FCP = "first-contentful-paint",
  /**最大内容绘制时长 */
  LCP = "largest-contentful-paint",
  /**首次输入延迟 */
  FID = "first-input-delay",
  /**累计布局偏移 */
  CLS = "layout-shift",
  /**页面请求加载过程的重要指标信息 */
  NT = "navigation-time",
  /** */
  RF = "resource-flow",
}

export interface NTModel {
  start: number;
  end: number;
  value: number;
}

/**
 *  @param FP 白屏时间-开始解析html文档的时间
 *  @param TTI 首次可交互时间-DOM构建完成，资源开始加载的时间
 *  @param Load 页面加载完成时间-DOM解析 + 首次渲染 + 同步js执行 + 资源加载
 *  @param DNS DNS查询耗时
 *  @param SSL SSL安全连接耗时 - 使用https时有效
 *  @param TCP TCP连接耗时
 *  @param TTFB 请求响应耗时
 *  @param Trans 内容传输耗时
 *  @param Res 资源加载耗时
 *  @param Trans 内容传输耗时
 *  @param DOM DOM解析耗时
 */
export interface PerformanceTiming {
  FP: NTModel;
  TTI: NTModel;
  Load: NTModel;
  Trans: NTModel;
  TTFB: NTModel;
  TCP: NTModel;
  SSL: NTModel;
  DOM: NTModel;
  DNS: NTModel;
  Res: NTModel;
}
