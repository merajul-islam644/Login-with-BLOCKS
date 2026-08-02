export class OidcError extends Error {
  /**
   * @param {string} code - short machine-readable code, e.g. "state_mismatch"
   * @param {string} message - human-readable description
   * @param {unknown} [cause] - original error/response, if any
   */
  constructor(code, message, cause) {
    super(message);
    this.name = "OidcError";
    this.code = code;
    this.cause = cause;
  }
}
