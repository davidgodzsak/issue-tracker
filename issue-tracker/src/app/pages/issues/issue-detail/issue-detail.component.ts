import {Component, OnInit} from '@angular/core';
import {Issue} from "../../../model/Issue";
import {IssueService} from "../../../services/issue.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-issue-detail',
  templateUrl: './issue-detail.component.html',
  styleUrls: ['./issue-detail.component.css']
})
export class IssueDetailComponent implements OnInit {
  issue: Issue = new Issue();
  comment: String = '';
  id: number;

  constructor(private issueService: IssueService,
              private route: ActivatedRoute,
              private router: Router) {
    this.route.params.subscribe(
      params => this.id = params.id,
      err => console.log(err)
    )
  }

  ngOnInit() {
    this.issueService.read(this.id)
      .subscribe(
        issue => this.issue = issue,
        err => console.log(err)
      )
  }

}
