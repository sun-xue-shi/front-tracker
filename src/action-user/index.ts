import { getPageInfo } from "./getPageInfo";
import { addHistoryEvent, trackRouteChange } from "./getRouteChange";
import { getOriginInfo } from "./grtOriginInfo";
import {
  BehaviorStack,
  OriginInformation,
  PageInformation,
  UserActionName,
  UserActionOptions,
} from "./types";
import { UserBehaviorStack } from "./userBehaviorStack";

export class UserActionTracker {
  private data: Record<string, Record<string, any>>;
  public trackerInstance: any;
  private options: UserActionOptions;
  private userBehaviorStack: UserBehaviorStack;

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

    //添加replaceState+pushState事件
    addHistoryEvent();
    this.userBehaviorStack = new UserBehaviorStack({
      maxBehaviorRecords: this.options.maxBehaviorRecords,
    });
  }

  initPI() {
    const pageInfo: PageInformation = getPageInfo();
    this.data[UserActionName.PI] = pageInfo;
  }

  initOI() {
    const originInfo: OriginInformation = getOriginInfo();
    this.data[UserActionName.OI] = originInfo;
  }

  initRouteChange() {
    trackRouteChange((e: Event) => {
      const routeData = {
        // 跳转的方法 eg:replaceState
        jumpType: e.type,
        // 创建时间
        createTime: new Date().getTime(),
        // 页面信息
        pageInfo: getPageInfo(),
      };

      if (this.data[UserActionName.RCR]) {
        this.data[UserActionName.RCR].push(routeData);
      } else {
        this.data[UserActionName.RCR] = [routeData];
      }

      const behaviorStackData: BehaviorStack = {
        name: UserActionName.RCR,
        page: getPageInfo().pathname,
        timestamp: new Date().getTime(),
        value: {
          jumpType: e.type,
        },
      };

      this.userBehaviorStack.push(behaviorStackData);
    });
  }
}
