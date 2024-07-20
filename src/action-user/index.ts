import { afterLoad } from "../utils/afterLoad";
import { getPageInfo } from "./getPageInfo";
import { addHistoryEvent, trackRouteChange } from "./getRouteChange";
import { getOriginInfo } from "./grtOriginInfo";
import { holdFetch } from "./holdFetch";
import { holdHTTP } from "./holdHTTP";
import {
  BehaviorStack,
  HttpMetricsData,
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
  private elementTrackedList: string[];
  private classTrackedList: string[];
  private eventTrackedList: string[];

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
    this.classTrackedList = this.options.classTrackedList;
    this.elementTrackedList = this.options.elementTrackedList;
    this.eventTrackedList = this.options.eventTrackedList;
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
        time: new Date().getTime(),
        value: {
          jumpType: e.type,
        },
      };

      this.userBehaviorStack.push(behaviorStackData);
    });
  }

  /**
   * 用户访问量
   */

  initPV() {
    const hanlder = () => {
      const pvInfo = {
        pageInfo: getPageInfo(),
        originInfo: getOriginInfo(),
        time: new Date().getTime(),
      };

      //上报方法
    };

    afterLoad(hanlder);
    //进入页面时即可上报
    trackRouteChange(hanlder);
  }

  initEventHandler() {
    this.eventTrackedList.forEach((eventItem) => {
      window.addEventListener(
        eventItem,
        (event) => {
          let target = undefined;
          if (
            this.elementTrackedList.includes(
              (event.target as HTMLElement)?.tagName.toLocaleLowerCase()
            ) ||
            Array.from((event.target as HTMLElement)?.classList).find(
              (className) => {
                this.classTrackedList.includes(className);
              }
            )
          ) {
            target = event.target as HTMLElement;
          }

          if (!target) return;

          const domData = {
            tagInfo: {
              id: target.id,
              classList: Array.from(target.classList),
              tagName: target.tagName,
              text: target.textContent,
            },
            pageInfo: getPageInfo(),
            time: new Date().getTime(),
          };

          if (!this.data[UserActionName.DBR]) {
            this.data[UserActionName.DBR] = { [eventItem]: [domData] };
          } else if (!this.data[UserActionName.DBR][eventItem]) {
            this.data[UserActionName.DBR][eventItem] = [domData];
          } else {
            this.data[UserActionName.DBR][eventItem].push(domData);
          }

          const behaviorStackData = {
            name: eventItem,
            page: getPageInfo().pathname,
            value: {
              tagInfo: {
                id: target.id,
                classList: Array.from(target.classList),
                tagName: target.tagName,
                text: target.textContent,
              },
              pageInfo: getOriginInfo(),
            },
            time: new Date().getTime(),
          };

          this.userBehaviorStack.push(behaviorStackData);
        },
        true
      );
    });
  }

  initHttpHandler() {
    const loadHandler = (httpMetricsData: HttpMetricsData) => {
      if (!this.data[UserActionName.HT]) {
        this.data[UserActionName.HT] = [httpMetricsData];
      } else {
        this.data[UserActionName.HT].push(httpMetricsData);
      }
    };

    holdHTTP(loadHandler);
    holdFetch(loadHandler);
  }
}
