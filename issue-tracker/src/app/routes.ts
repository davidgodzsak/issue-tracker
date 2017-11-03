import {Routes} from '@angular/router';
import {LoginComponent} from "./login/login.component";
import {RegisterComponent} from "./register/register.component";
import {IssueListComponent} from "./issues/issue-list/issue-list.component";
import {IssueDetailComponent} from "./issues/issue-detail/issue-detail.component";

export const appRoutes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'issues', component: IssueListComponent},
  {path: 'issue/:id', component: IssueDetailComponent}
];
