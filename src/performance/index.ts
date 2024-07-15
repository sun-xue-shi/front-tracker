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
  PerformanceOptions,
  ResourceFlowTiming,
} from "./types";
import { getNT } from "./getNT";
import { getRF } from "./getRF";
import { getCHR } from "./getCHR";
import { afterLoad } from "../utils/afterLoad";

export class PerformanceTracker {
  private data: Record<string, Record<string, any>>;
  public trackerInstance: any;
  private options: PerformanceOptions;

  constructor(options: PerformanceOptions, trackerInstance: any) {
    this.data = {};
    this.trackerInstance = trackerInstance;
    this.options = Object.assign(
      {
        FCP: true,
        LCP: true,
        FID: true,
        CLS: true,
        NT: true,
        RF: true,
        CHR: true,
      },
      options
    );
    this.installPerformanceInnerTracker();
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

  initCHR() {
    const cacheHitData = getCHR();
    this.data[PerformanceIndexName.CHR] = cacheHitData;
  }

  installPerformanceInnerTracker() {
    if (this.options.FCP) this.initFCP();
    if (this.options.LCP) this.initLCP();
    if (this.options.CLS) this.initCLS();

    afterLoad(() => {
      if (this.options.NT) this.initNT();
      if (this.options.RF) this.initRF();
      if (this.options.CHR) this.initCHR();
    });
  }
}
