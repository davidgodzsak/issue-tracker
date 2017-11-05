import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Issue} from "../../../model/Issue";
import {IssueService} from "../../../services/issue.service";

@Component({
  selector: 'app-new-issue',
  templateUrl: './new-issue.component.html',
  styleUrls: ['./new-issue.component.css']
})
export class NewIssueComponent implements OnInit {
  issueForm: FormGroup = new FormGroup({
    description: new FormControl('', [Validators.required]),
    location: new FormControl('', [Validators.required])
  });

  constructor(private issueService: IssueService) {

  }

  ngOnInit() {
  }

  get location() {
    return this.issueForm.get('location')
  }

  get description() {
    return this.issueForm.get('description')
  }

  submit() {
    this.issueService.create(new Issue(this.description.value, this.location.value))
      .subscribe(
        res => res,
        err => console.log(err)
      )
  }
}
