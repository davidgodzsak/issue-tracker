import {User} from "./User";

export enum IssueStatus {
  ADDED, READY, ONGOING
}

export class Issue {
  id: number;
  user: User;
  timeStamp: Date;
  status: IssueStatus;
  description: String;
  location: String;
  messages: String[];

  constructor(description?: String, location?: String, status?: IssueStatus, timeStamp?: Date, user?: User, id?: number) {
    this.user = user;
    this.timeStamp = timeStamp;
    this.status = status;
    this.description = description;
    this.location = location;
    this.id = id;
  }
}
