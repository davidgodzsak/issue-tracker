import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router'

import {AppComponent} from './app.component';
import {LoginComponent} from './login/login.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {AuthService} from "../services/login.service";
import {HttpModule} from "@angular/http";
import { RegisterComponent } from './register/register.component';
import  {appRoutes} from './routes';
import { IssueDetailComponent } from './issues/issue-detail/issue-detail.component';
import { IssueListComponent } from './issues/issue-list/issue-list.component';
import {MaterialItemsModule} from "./MaterialItemsModule";

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    IssueDetailComponent,
    IssueListComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialItemsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [AuthService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
