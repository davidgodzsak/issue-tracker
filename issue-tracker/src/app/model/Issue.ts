import {User} from "./User";

export class IssueStatus {
  static ADDED: String = "ADDED";
  static READY: String = "READY";
  static ONGOING: String = "ONGOING";
}

export class Issue {
  id: number;
  user: User;
  timeStamp: Date;
  status: String;
  description: String;
  location: String;
  messages: String[];

  constructor(description?: String, location?: String, status?: String, timeStamp?: Date, user?: User, id?: number) {
    this.user = user;
    this.timeStamp = timeStamp;
    this.status = status;
    this.description = description;
    this.location = location;
    this.id = id;
  }
}
