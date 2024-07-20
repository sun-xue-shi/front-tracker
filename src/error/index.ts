import { ErrorOptions } from "./types";

export class PerformanceTracker {
  private data: Record<string, Record<string, any>>;
  public trackerInstance: any;
  private options: ErrorOptions;

  constructor(options: ErrorOptions, trackerInstance: any) {
    this.data = {};
    this.trackerInstance = trackerInstance;
    this.options = Object.assign(
      {
        js: true,
        resource: true,
        promise: true,
        http: true,
        cors: true,
      },
      options
    );
  }
}
