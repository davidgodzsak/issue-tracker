export class Routes {
  static LOGIN: String = 'user/login';
  static REGISTER: String = 'user/register';
}

export class Server {
  private static address: String = 'localhost';
  private static port: String = '8080';
  private static prefix: String = 'api';

  static routeTo(route: String) {
    return `http://${Server.address}:${Server.port}/${Server.prefix}/${route}`
  }
}


