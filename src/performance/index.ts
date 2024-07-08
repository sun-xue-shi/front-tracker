export class PerformanceTracker {
  private data: Record<string, Record<string, any>>;
  public trackerInstance: any;

  constructor(trackerInstance: any) {
    this.data = {};
    this.trackerInstance = trackerInstance;
  }
}
