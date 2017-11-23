export class Role {
  static GUEST: String = "GUEST";
  static USER: String = "USER";
  static ADMIN: String = "ADMIN";
}

export class User {
  username: String;
  password: String;
  email: String;
  role: String;

  constructor(username?: String, password?: String, email?: String, role?: String) {
    this.username = username || "";
    this.password = password || "";
    this.email = email || "";
    this.role = role || Role.GUEST;
  }
}
