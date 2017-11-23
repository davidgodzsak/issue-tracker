import {Component, OnInit} from '@angular/core';
import {Issue, IssueStatus} from "../../../model/Issue";
import {IssueService} from "../../../services/issue.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-issue-detail',
  templateUrl: './issue-detail.component.html',
  styleUrls: ['./issue-detail.component.css']
})
export class IssueDetailComponent implements OnInit {
  issue: Issue = new Issue();
  message: String = '';
  id: number;
  statuses: String[] = [IssueStatus.ADDED, IssueStatus.ONGOING, IssueStatus.READY];

  constructor(private issueService: IssueService,
              private route: ActivatedRoute,
              private router: Router) {
    this.route.params.subscribe(
      params => this.id = params.id,
      err => console.log(err)
    )
  }

  ngOnInit() {
    this.reload();
  }

  private reload() {
    this.issueService.read(this.id)
      .subscribe(
        issue => this.issue = issue,
        err => console.log(err)
      )
  }

  updateStatus(event) {
    this.issue.status = event.source.triggerValue;
    this.issueService.update(this.issue)
      .subscribe(
        issue => console.log('ok'),
        err => console.log(err)
      )
  }

  submit() {
    this.issueService.sendMessage(this.issue.id, this.message)
      .subscribe(
        issue => this.reload(),
        err => console.log(err)
      )
  }

}
