import {
  CLSMetric,
  FCPMetric,
  LCPMetric,
  onCLS,
  onFCP,
  onLCP,
} from "web-vitals";
import {
  PerformanceIndexName,
  PerformanceNT,
  ResourceFlowTiming,
} from "./types";
import { getNT } from "./getNT";
import { getRF } from "./getRF";
import { getCacheHit } from "./getCacheHit";

export class PerformanceTracker {
  private data: Record<string, Record<string, any>>;
  public trackerInstance: any;

  constructor(trackerInstance: any) {
    this.data = {};
    this.trackerInstance = trackerInstance;
  }

  initFCP() {
    onFCP((metric: FCPMetric) => {
      this.data[PerformanceIndexName.FCP] = {
        name: metric.name,
        value: metric.value,
        rating: metric.rating,
      };
    });
  }

  initCLS() {
    onCLS((metric: CLSMetric) => {
      this.data[PerformanceIndexName.CLS] = {
        name: metric.name,
        value: metric.value,
        rating: metric.rating,
      };
    });
  }

  initLCP() {
    onLCP((metric: LCPMetric) => {
      this.data[PerformanceIndexName.LCP] = {
        name: metric.name,
        value: metric.value,
        rating: metric.rating,
      };
    });
  }

  initNT() {
    const navigationTiming: PerformanceNT = getNT();
    this.data[PerformanceIndexName.NT] = navigationTiming;
  }

  initRF() {
    const resourceFlowTiming: ResourceFlowTiming[] = getRF();
    this.data[PerformanceIndexName.RF] = resourceFlowTiming;
  }

  initCacheHitRate() {
    const cacheHitData = getCacheHit();
    this.data[PerformanceIndexName.CHR] = cacheHitData;
  }
}
