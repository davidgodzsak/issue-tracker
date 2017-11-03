import {Component, OnInit} from '@angular/core';
import {User} from "../../model/User";
import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from "../../services/login.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  user: User;
  loginForm: FormGroup = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  });

  constructor(private loginService: AuthService) {

  }

  ngOnInit() {
    this.user = new User();
  }

  submit() {
    console.log('submit');
    this.loginService.login(new User(this.username.value, this.password.value))
      .then(res => console.log(res))
      .catch(err => console.log(err))
  }

  get username(): AbstractControl {
    return this.loginForm.get('username');
  }

  get password(): AbstractControl {
    return this.loginForm.get('password');
  }
}
