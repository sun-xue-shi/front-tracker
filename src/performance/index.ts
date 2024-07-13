import {
  CLSMetric,
  FCPMetric,
  LCPMetric,
  onCLS,
  onFCP,
  onLCP,
} from "web-vitals";
import { PerformanceIndexName } from "./types";

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
}
