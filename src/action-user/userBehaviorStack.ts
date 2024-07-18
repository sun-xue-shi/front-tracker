import { behaviorRecordsOptions, BehaviorStack } from "./types";

export class UserBehaviorStack {
  private maxBehaviorRecords: number;
  private data: BehaviorStack[];

  constructor(option: behaviorRecordsOptions) {
    const { maxBehaviorRecords } = option;
    this.data = [];
    this.maxBehaviorRecords = maxBehaviorRecords;
  }

  push(value: BehaviorStack) {
    if (this.length() === this.maxBehaviorRecords) {
      this.shift();
    }
    this.data.push(value);
  }

  shift() {
    return this.data.shift();
  }

  get() {
    return this.data;
  }

  length() {
    return this.data.length;
  }

  clear() {
    this.data = [];
  }
}
