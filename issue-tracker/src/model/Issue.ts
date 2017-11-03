import {User} from "./User";

export enum IssueStatus {
  ADDED, READY, ONGOING
}

export class Issue {
  user: User;
  timeStamp: Date;
  status: IssueStatus;
  description: String;
  location: String;

  constructor(description?: String, location?: String, status?: IssueStatus, timeStamp?: Date, user?: User) {
    this.user = user;
    this.timeStamp = timeStamp;
    this.status = status;
    this.description = description;
    this.location = location;
  }
}
