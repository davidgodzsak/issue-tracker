import {Component} from '@angular/core';
import {DataSource} from "@angular/cdk/collections";
import {Observable} from "rxjs/Observable";
import "rxjs/add/observable/of";
import {Issue, IssueStatus} from "../../../model/Issue";
import {IssueService} from "../../../services/issue.service";

@Component({
  selector: 'app-issue-list',
  templateUrl: './issue-list.component.html',
  styleUrls: ['./issue-list.component.css']
})
export class IssueListComponent {
  displayedColumns: String[] = ['description', 'location', 'status', 'timestamp', 'edit'];
  issues: DataSource<any> = new IssueDataSource(this.issueService);

  constructor(private issueService: IssueService) {
  }

  delete(id: number) {
    this.issueService.delete(id)
      .subscribe(
        res => console.log(res),
        err => console.log(err)
      );
  }
}

const data: Issue[] = [
  new Issue('description', 'location', IssueStatus.ADDED, new Date(), undefined, 1),
  new Issue('elromlott a tábla', '0.420', IssueStatus.ADDED, new Date(), undefined, 2)
];

export class IssueDataSource extends DataSource<any> {
  constructor(private issueService: IssueService) {
    super();
  }

  connect(): Observable<Issue[]> {
    return this.issueService.getIssues();
  }

  disconnect() {
  }
}
