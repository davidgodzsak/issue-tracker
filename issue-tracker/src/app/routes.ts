import {Routes} from '@angular/router';
import {LoginComponent} from "./pages/login/login.component";
import {RegisterComponent} from "./pages/register/register.component";
import {IssueListComponent} from "./pages/issues/issue-list/issue-list.component";
import {IssueDetailComponent} from "./pages/issues/issue-detail/issue-detail.component";
import {NewIssueComponent} from "./pages/issues/new-issue/new-issue.component";

export const appRoutes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'issues', component: IssueListComponent},
  {path: 'issues/new', component: NewIssueComponent},
  {path: 'issues/:id', component: IssueDetailComponent}
];
