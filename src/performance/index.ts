import {
  CLSMetric,
  FCPMetric,
  FIDMetric,
  LCPMetric,
  onCLS,
  onFCP,
  onLCP,
} from "web-vitals";
import { performanceIndexName } from "./types";

export class PerformanceTracker {
  private data: Record<string, Record<string, any>>;
  public trackerInstance: any;

  constructor(trackerInstance: any) {
    this.data = {};
    this.trackerInstance = trackerInstance;
  }

  initFCP() {
    onFCP((metric: FCPMetric) => {
      this.data[performanceIndexName.FCP] = {
        name: metric.name,
        value: metric.value,
        rating: metric.rating,
      };
    });
  }

  initCLS() {
    onCLS((metric: CLSMetric) => {
      this.data[performanceIndexName.CLS] = {
        name: metric.name,
        value: metric.value,
        rating: metric.rating,
      };
    });
  }

  initLCP() {
    onLCP((metric: LCPMetric) => {
      this.data[performanceIndexName.LCP] = {
        name: metric.name,
        value: metric.value,
        rating: metric.rating,
      };
    });
  }
}
