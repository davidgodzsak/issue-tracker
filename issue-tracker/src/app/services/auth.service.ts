import {Injectable} from '@angular/core';
import {Http} from "@angular/http";
import {User} from "../model/User";
import {Routes, Server} from "../utils/ServerRoutes";

@Injectable()
export class AuthService {
  user: User;

  constructor(private http: Http) {
    this.user = new User();
  }

  login(user: User) {
    return this.http.post(Server.routeTo(Routes.LOGIN), user)
      .toPromise()
      .then(res => this.user = res.json())
      .catch(err => console.log('handle Error', err))
  }

  register(user: User) {
    return this.http.post(Server.routeTo(Routes.REGISTER), user)
      .toPromise();
  }
}
