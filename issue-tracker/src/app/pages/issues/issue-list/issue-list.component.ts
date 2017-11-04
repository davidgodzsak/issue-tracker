import {Component} from '@angular/core';
import {DataSource} from "@angular/cdk/collections";
import {Observable} from "rxjs/Observable";
import "rxjs/add/observable/of";
import {Issue, IssueStatus} from "../../../model/Issue";

@Component({
  selector: 'app-issue-list',
  templateUrl: './issue-list.component.html',
  styleUrls: ['./issue-list.component.css']
})
export class IssueListComponent {
  displayedColumns: String[] = ['description', 'location', 'status', 'timestamp', 'edit'];
  issues: DataSource<any> = new IssueDataSource();

}

const data: Issue[] = [
  new Issue('description', 'location', IssueStatus.ADDED, new Date())
];

export class IssueDataSource extends DataSource<any> {

  connect(): Observable<Issue[]> {
    return Observable.of(data);
  }

  disconnect() {
  }
}
