import {Component, OnInit} from '@angular/core';
import {Role} from "../../model/User";
import {AuthService} from "../../services/auth.service";

interface MenuItem {
  link: String;
  title: String;
}

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  private roleMenus = new Map<Role, MenuItem[]>([
    // [Role.GUEST, [{link: '/stats', title: 'Statistics'}]],
    [Role.USER, [{link: '/stats', title: 'Statistics'}, {link: '/issues', title: 'Issues'}]],
    [Role.GUEST, [{link: '/stats', title: 'Statistics'}, {link: '/issues', title: 'Issues'}]]
  ]);

  menus: MenuItem[];

  constructor(private authService: AuthService) {
  }

  ngOnInit() {
    this.menus = this.roleMenus.get(this.authService.user.role);
  }

}
