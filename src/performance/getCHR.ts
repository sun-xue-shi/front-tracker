/**
 * @returns 资源缓存命中相关计算
 */
export function getCHR() {
  const cacheData = performance.getEntriesByType("resource");
  let hitQuantity = 0;

  cacheData.forEach((cacheItem) => {
    if (cacheItem.duration === 0 && cacheItem.transferSize !== 0) hitQuantity++;
  });

  return {
    hitQuantity,
    cacheHitRate: (hitQuantity / cacheData.length).toFixed(2),
  };
}
