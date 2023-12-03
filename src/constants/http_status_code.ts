class HttpStatusCodes {
  static OK = 200;
  static NO_CONTENT = 204;

  static FOUND = 302; // FOUND

  static BAD_REQUEST = 400;
  static UNAUTHORIZED = 401;
  static NOT_FOUND = 404;
  static ALREADY_EXIST = 409; // Conflict
  static PLAN_LIMIT_EXCEED = 403;
  static UNPROCESSABLE_REQUEST = 422; // Unprocessable Entity
  static APP_UPDATE_NEEDED = 426;

  static INTERNAL_SERVER = 500;
}

export { HttpStatusCodes };
