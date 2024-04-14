export type ShowErrorType =
  | "not-found"
  | "internal-server-error"
  | "unauthorized"
  | "invalid-schema"
  | "google-auth-error"
  | "email-already-in-use"
  | "no-account-for-google-email"
  | "invalid-token"
  | "license-with-same-key-already-exists"
  | "failed-captcha";

export class ShowError extends Error {
  type: ShowErrorType;

  constructor(message: string, type: ShowErrorType) {
    super(`+ ${message}`);

    this.type = type;
  }

  static internalServerError() {
    return new ShowError(
      "Something went wrong, please try again later.",
      "internal-server-error"
    );
  }
}
