import { getPageInfo } from "./getPageInfo";
import { PageInformation, UserActionName, UserActionOptions } from "./types";

export class UserActionTracker {
  private data: Record<string, Record<string, any>>;
  public trackerInstance: any;
  private options: UserActionOptions;

  constructor(options: UserActionOptions, trackerInstance: any) {
    this.data = {};
    this.trackerInstance = trackerInstance;
    this.options = Object.assign(
      {
        PI: true,
        OI: true,
        RCR: true,
        DBR: true,
        HT: true,
        BS: true,
        PV: true,
        elementTrackedList: ["button", "div"],
        classTrackedList: ["tracked"],
        eventTrackedList: ["click"],
        maxBehaviorRecords: 100,
      },
      options
    );
  }

  initPI() {
    const pageInfo: PageInformation = getPageInfo();
    this.data[UserActionName.PI] = pageInfo;
  }
}
