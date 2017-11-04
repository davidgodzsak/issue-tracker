export enum Role {
  GUEST, USER, ADMIN
}

export class User {
  username: String;
  password: String;
  email: String;
  role: Role;

  constructor(username?: String, password?: String, email?: String, role?: Role) {
    this.username = username || "";
    this.password = password || "";
    this.email = email || "";
    this.role = role || Role.GUEST;
  }
}
