import {Injectable} from '@angular/core';
import {Http} from "@angular/http";
import {User} from "../model/User";
import {Routes, Server} from "../utils/ServerRoutes";

@Injectable()
export class AuthService {

  constructor(private http: Http) {
  }

  login(user: User) {
    return this.http.post(Server.routeTo(Routes.LOGIN), user)
      .toPromise();
  }

  register(user: User) {
    return this.http.post(Server.routeTo(Routes.REGISTER), user)
      .toPromise();
  }
}
