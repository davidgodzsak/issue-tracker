import {Injectable} from '@angular/core';
import {Http} from "@angular/http";
import {Routes, Server} from "../utils/ServerRoutes";
import {Observable} from "rxjs/Observable";
import {Issue} from "../model/Issue";
import "rxjs/add/operator/map";

@Injectable()
export class IssueService {

  constructor(private http: Http) {
  }

  getIssues(): Observable<Issue[]> {
    return this.http.get(Server.routeTo(Routes.ISSUES))
      .map(res => res.json())
  }

  create(issue: Issue): Observable<Issue> {
    return this.http.post(Server.routeTo(Routes.ISSUES), issue)
      .map(res => res.json())
  }

  delete(id: number) {
    return this.http.delete(Server.routeTo(Routes.ISSUES) + '/' + id)
      .map(res => res.json())
  }

  read(id: number) {
    return this.http.get(Server.routeTo(Routes.ISSUES) + '/' + id)
      .map(res => res.json())
  }

  update(issue: Issue) {
    return this.http.put(Server.routeTo(Routes.ISSUES) + '/' + issue.id, issue)
      .map(res => res.json())
  }

  sendMessage(id: number, message: String) {
    return this.http.post(Server.routeTo(Routes.ISSUES + '/' + id + '/message'), {message})
      .map(res => res.json())
  }
}
