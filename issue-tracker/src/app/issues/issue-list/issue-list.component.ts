import {Component, OnInit} from '@angular/core';
import {Issue, IssueStatus} from "../../../model/Issue";

@Component({
  selector: 'app-issue-list',
  templateUrl: './issue-list.component.html',
  styleUrls: ['./issue-list.component.css']
})
export class IssueListComponent implements OnInit {
  issues: Issue[];

  constructor() {
  }

  ngOnInit() {
    this.issues = [new Issue("asd", "asdasd", IssueStatus.ADDED, new Date())]
  }

}
